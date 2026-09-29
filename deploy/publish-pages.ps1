<#
.SYNOPSIS
  Публикация собранного сайта на GitHub Pages через репозиторий пользователя.

.EXAMPLE
  .\deploy\publish-pages.ps1
#>
param(
  [string]$Repo = 'ilya33836-cpu/ilya33836-cpu.github.io',
  [string]$Branch = 'main',
  [string]$Staging = "$env:TEMP\ilya-pages-publish"
)

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot

function Get-GhToken {
  if ($env:GH_TOKEN) { return $env:GH_TOKEN }
  if ($env:GITHUB_TOKEN) { return $env:GITHUB_TOKEN }
  $out = gh auth token 2>$null
  if ($LASTEXITCODE -eq 0 -and $out) { return $out.Trim() }
  throw 'Не найден токен GitHub. Выполните gh auth login или задайте $env:GH_TOKEN.'
}

$env:GH_TOKEN = Get-GhToken

Write-Host '1/5 Сборка проекта' -ForegroundColor Cyan
Push-Location $root
try {
  # GitHub Pages — только статика, обработчика заявок там нет: форма сразу
  # откроет Telegram, без неработающих запросов к /api/lead.
  $env:VITE_LEAD_ENDPOINTS = 'none'
  npm run build:client
} finally {
  Pop-Location
  Remove-Item Env:\VITE_LEAD_ENDPOINTS -ErrorAction SilentlyContinue
}
if ($LASTEXITCODE -ne 0) { throw 'Сборка не удалась' }

Write-Host '2/5 Подготовка файлов' -ForegroundColor Cyan
Remove-Item -LiteralPath $Staging -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $Staging -Force | Out-Null
Copy-Item -Path (Join-Path $root 'dist/*') -Destination $Staging -Recurse -Force
# _headers нужен только Cloudflare, Jekyll такие файлы всё равно игнорирует.
Remove-Item -LiteralPath (Join-Path $Staging '_headers') -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath $Staging -Force | Where-Object { $_.Name -like '.*' } | Remove-Item -Recurse -Force
Set-Content -LiteralPath (Join-Path $Staging '.nojekyll') -Value '' -NoNewline

Push-Location $Staging
try {
  $git = @('-c', 'core.autocrlf=false', '-c', 'core.safecrlf=false')
  & git @git init -q -b $Branch 2>&1 | Out-Null
  & git @git add -A 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'git add не удался' }
  & git @git -c user.name='ilya33836-cpu' -c user.email='ilya33836@gmail.com' commit -q -m "Публикация сайта: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'git commit не удался' }
} finally {
  Pop-Location
}

Write-Host '3/5 Создание или обновление репозитория' -ForegroundColor Cyan
$parts = $Repo -split '/'
if ($parts.Count -ne 2) { throw "Ожидается формат владелец/репозиторий, получено: $Repo" }
$owner = $parts[0]
$name = $parts[1]
$exists = $true
$viewOutput = & gh repo view $Repo --json name 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { $exists = $false }

if (-not $exists) {
  $createOutput = & gh repo create $Repo --public --description 'Сайт-портфолио ILYA (сборка)' 2>&1 | Out-String
  if ($LASTEXITCODE -ne 0) { throw "Не удалось создать репозиторий: $createOutput" }
  $createOutput.Trim()
} else {
  "Репозиторий $Repo уже существует — обновляем содержимое" | Write-Host
}

Push-Location $Staging
try {
  $remote = (& git remote 2>$null | Out-String).Trim()
  if (-not $remote) {
    & git remote add origin "https://github.com/$Repo.git" 2>&1 | Out-String | Out-Null
  }
  # Важно: вывод собираем целиком через Out-String — иначе Select-Object
  # прерывает пайплайн и git завершается с ненулевым кодом.
  # postBuffer увеличен: при большом объёме картинок GitHub отвечал 408.
  $pushOutput = & git -c http.postBuffer=524288000 push --force "https://x-access-token:$($env:GH_TOKEN)@github.com/$Repo.git" "$Branch`:$Branch" 2>&1 | Out-String
  $pushCode = $LASTEXITCODE
  $pushOutput.Trim() -split "`n" | Select-Object -Last 2 | ForEach-Object { $_.Trim() }
  if ($pushCode -ne 0) { throw "Не удалось отправить файлы (git exit $pushCode)" }
} finally {
  Pop-Location
}

Write-Host '4/5 Включение GitHub Pages' -ForegroundColor Cyan
$pagesUrl = "https://$owner.github.io/"
$createPages = & gh api -X POST "repos/$owner/$name/pages" -f "source[branch]=$Branch" -f 'source[path]=/' 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
  'Pages: создан новый проект' | Write-Host
} else {
  $updatePages = & gh api -X PUT "repos/$owner/$name/pages" -f "source[branch]=$Branch" -f 'source[path]=/' 2>&1 | Out-String
  if ($LASTEXITCODE -ne 0) { throw "Не удалось включить Pages: $updatePages" }
  'Pages: обновлён существующий проект' | Write-Host
}

Write-Host '5/5 Проверка' -ForegroundColor Cyan
$ready = $false
for ($i = 0; $i -lt 20 -and -not $ready; $i++) {
  Start-Sleep -Seconds 10
  try {
    $response = Invoke-WebRequest $pagesUrl -UseBasicParsing -TimeoutSec 20
    if ($response.StatusCode -eq 200 -and $response.Content -match 'ILYA') { $ready = $true }
  } catch { }
}
if ($ready) {
  Write-Host ''
  Write-Host "Сайт доступен: $pagesUrl" -ForegroundColor Green
} else {
  Write-Host ''
  Write-Host "GitHub собирает сайт, попробуйте $pagesUrl через минуту." -ForegroundColor Yellow
}

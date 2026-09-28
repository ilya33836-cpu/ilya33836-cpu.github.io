<#
.SYNOPSIS
  Сборка архива для загрузки на обычный PHP-хостинг (Beget, Timeweb, REG.RU).

.EXAMPLE
  .\deploy\package-php.ps1
#>
param(
  [string]$TelegramToken = '',
  [string]$TelegramChatId = '',
  [string]$OutputPath = 'deploy/ilya-portfolio-php.zip'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$staging = Join-Path $env:TEMP ('ilya-portfolio-' + [guid]::NewGuid().ToString('N').Substring(0, 8))

Write-Host '1/4 Сборка проекта' -ForegroundColor Cyan
Push-Location $root
try { npm run build:client } finally { Pop-Location }
if ($LASTEXITCODE -ne 0) { throw 'Сборка не удалась' }

Write-Host '2/4 Подготовка файлов' -ForegroundColor Cyan
New-Item -ItemType Directory -Path $staging -Force | Out-Null
Copy-Item -Path (Join-Path $root 'dist/*') -Destination $staging -Recurse -Force
New-Item -ItemType Directory -Path (Join-Path $staging 'api') -Force | Out-Null
Copy-Item -Path (Join-Path $root 'api/lead.php') -Destination (Join-Path $staging 'api/lead.php') -Force

if ($TelegramToken -and $TelegramChatId) {
  $config = "<?php`n`nreturn [`n    'token' => '$TelegramToken',`n    'chat_id' => '$TelegramChatId',`n];`n"
  Set-Content -LiteralPath (Join-Path $staging 'api/config.php') -Value $config -Encoding UTF8
  Write-Host '    config.php создан с токеном и chat id' -ForegroundColor Green
} else {
  Copy-Item -Path (Join-Path $root 'api/config.example.php') -Destination (Join-Path $staging 'api/config.example.php') -Force
  Write-Host '    ТОКЕН НЕ ПЕРЕДАН: на сервере создайте api/config.php вручную' -ForegroundColor Yellow
}

Write-Host '3/4 Удаление служебных файлов' -ForegroundColor Cyan
# Скрытые файлы (dotfiles) игнорируются распаковщиком, поэтому убираем _headers.
Remove-Item -LiteralPath (Join-Path $staging '_headers') -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath $staging -Force | Where-Object { $_.Name -like '.*' } | Remove-Item -Recurse -Force

Write-Host '4/4 Создание архива' -ForegroundColor Cyan
$target = if ([System.IO.Path]::IsPathRooted($OutputPath)) { $OutputPath } else { Join-Path $root $OutputPath }
Remove-Item -LiteralPath $target -Force -ErrorAction SilentlyContinue
Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $target -CompressionLevel Optimal
Remove-Item -LiteralPath $staging -Recurse -Force

$size = "{0:N1} МБ" -f ((Get-Item $target).Length / 1MB)
$files = (Get-ChildItem -LiteralPath $staging -Recurse -File -ErrorAction SilentlyContinue).Count
Write-Host ''
Write-Host "Готово: $target ($size)" -ForegroundColor Green
Write-Host 'Загрузите архив в панель хостинга, распакуйте в public_html и проверьте:'
Write-Host '  https://ваш-хостинг/api/lead.php'

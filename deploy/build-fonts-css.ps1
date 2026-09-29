$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
$targets = @(
  @{ name = 'Manrope'; file = 'manrope' },
  @{ name = 'Inter'; file = 'inter' }
)

$parts = @()
foreach ($target in $targets) {
  $cssFile = Join-Path $env:TEMP ($target.name + '.css')
  & curl.exe -sS -A $ua ('https://fonts.googleapis.com/css2?family=' + $target.name + ':wght@400..800&display=swap') -o $cssFile
  $css = Get-Content -LiteralPath $cssFile -Raw -Encoding UTF8
  $urls = [regex]::Matches($css, 'url\((https://[^)]+\.woff2)\)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
  for ($i = 0; $i -lt $urls.Count; $i++) {
    $local = '/fonts/' + $target.file + '-' + ($i + 1) + '.woff2'
    $css = $css.Replace($urls[$i], $local)
  }
  # Оставляем только блоки @font-face и комментарии с названием подмножества.
  $blocks = [regex]::Matches($css, '/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{[^}]+\}') | ForEach-Object { $_.Value }
  $parts += $blocks
}

$header = @"
/* Локальные шрифты: загружаются с того же домена, без обращения к Google Fonts.
   Файлы лежат в public/fonts, скрипт загрузки — deploy/fetch-fonts.ps1 */

"@
Set-Content -LiteralPath 'src\fonts.css' -Value ($header + ($parts -join "`n`n")) -Encoding UTF8
Write-Host ('src\fonts.css: блоков @font-face — ' + $parts.Count)
Select-String -Path 'src\fonts.css' -Pattern "url\(" | Measure-Object | ForEach-Object { 'локальных url: ' + $_.Count }

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
New-Item -ItemType Directory -Path 'public\fonts' -Force | Out-Null
$fonts = [ordered]@{
  'manrope' = 'family=Manrope:wght@400..800'
  'inter'   = 'family=Inter:wght@300..700'
}
foreach ($name in $fonts.Keys) {
  $url = 'https://fonts.googleapis.com/css2?' + $fonts[$name] + '&display=swap'
  $css = (Invoke-WebRequest $url -UserAgent $ua -TimeoutSec 30).Content
  $urls = [regex]::Matches($css, 'url\((https://[^)]+\.woff2)\)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
  Write-Host ($name + ': найдено файлов ' + $urls.Count)
  $i = 1
  foreach ($u in $urls) {
    $out = 'public\fonts\' + $name + '-' + $i + '.woff2'
    Invoke-WebRequest $u -OutFile $out -UserAgent $ua -TimeoutSec 30
    $kb = [int]((Get-Item $out).Length / 1KB)
    Write-Host ('  ' + $out + ' (' + $kb + ' КБ)')
    $i++
  }
}

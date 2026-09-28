<#
.SYNOPSIS
  Загрузка портфолио на VPS из Windows (PowerShell).

.EXAMPLE
  .\deploy\deploy.ps1 -Target root@123.45.67
  .\deploy\deploy.ps1 -Target root@123.45.67 -Domain example.ru
#>
param(
  [Parameter(Mandatory = $true)][string]$Target,
  [string]$Domain = '',
  [string]$RemoteDir = '/var/www/ilya-portfolio'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

function Invoke-Ssh {
  param([string]$Command)
  ssh -o StrictHostKeyChecking=accept-new $Target $Command
  if ($LASTEXITCODE -ne 0) { throw "ssh завершился с ошибкой: $Command" }
}

Write-Host '1/5 Сборка проекта' -ForegroundColor Cyan
Push-Location $root
try { npm run build } finally { Pop-Location }
if ($LASTEXITCODE -ne 0) { throw 'Сборка не удалась' }

Write-Host '2/5 Подготовка каталогов на сервере' -ForegroundColor Cyan
Invoke-Ssh "mkdir -p $RemoteDir/dist $RemoteDir && rm -rf $RemoteDir/dist"

Write-Host '3/5 Копирование файлов' -ForegroundColor Cyan
scp -r -q "$root/dist" "${Target}:$RemoteDir/dist"
scp -q "$root/deploy/server.mjs" "$root/deploy/lead.mjs" "$root/deploy/ilya-portfolio.service" "$root/deploy/nginx.conf" "${Target}:$RemoteDir/"
if ($LASTEXITCODE -ne 0) { throw 'Копирование не удалось' }

Write-Host '4/5 Настройка systemd и Nginx' -ForegroundColor Cyan
$serverName = if ($Domain) { $Domain } else { '_' }
$remoteScript = @"
set -e
cd $RemoteDir
if [ -f nginx.conf ]; then sed -i 's/server_name _;/server_name $serverName;/' nginx.conf; fi
if [ -f ilya-portfolio.service ]; then
  cp ilya-portfolio.service /etc/systemd/system/ilya-portfolio.service
  systemctl daemon-reload
  systemctl enable --now ilya-portfolio
  systemctl restart ilya-portfolio
fi
chown -R www-data:www-data $RemoteDir || true
if [ -f nginx.conf ] && command -v nginx >/dev/null 2>&1; then
  cp nginx.conf /etc/nginx/sites-available/ilya-portfolio
  ln -sf /etc/nginx/sites-available/ilya-portfolio /etc/nginx/sites-enabled/ilya-portfolio
  rm -f /etc/nginx/sites-enabled/default
  if nginx -t; then systemctl reload nginx; else echo 'nginx: конфиг не прошёл проверку'; fi
fi
if [ -f $RemoteDir/.env ]; then
  chown www-data:www-data $RemoteDir/.env
  chmod 600 $RemoteDir/.env
fi
systemctl --no-pager status ilya-portfolio | head -n 8
"@
Invoke-Ssh $remoteScript

Write-Host '5/5 Проверка' -ForegroundColor Cyan
Invoke-Ssh "curl -s -o /dev/null -w 'index: %{http_code}\n' http://127.0.0.1:3000/"

Write-Host ''
Write-Host "Готово. Открывайте: http://<IP-сервера>/" -ForegroundColor Green
if (-not $Domain) {
  Write-Host 'Домен ещё не задан: позже повторите с -Domain example.ru и выпустите сертификат certbot.' -ForegroundColor Yellow
}

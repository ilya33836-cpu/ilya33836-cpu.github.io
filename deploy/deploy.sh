#!/usr/bin/env bash
# Загрузка портфолио на VPS. Использование:
#   ./deploy/deploy.sh root@123.45.67
# Требуется настроенный SSH-ключ (без пароля) на сервере.
set -euo pipefail

TARGET="${1:?Укажите пользователя и IP, например root@123.45.67}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="/var/www/ilya-portfolio"

echo "→ Сборка проекта"
cd "$ROOT"
npm run build

echo "→ Копирование файлов на $TARGET"
ssh "$TARGET" "mkdir -p $APP_DIR/dist $APP_DIR/server $APP_DIR/deploy"
rsync -az --delete "$ROOT/dist/" "$TARGET:$APP_DIR/dist/"
rsync -az "$ROOT/deploy/server.mjs" "$ROOT/deploy/lead.mjs" "$TARGET:$APP_DIR/"
rsync -az "$ROOT/deploy/ilya-portfolio.service" "$ROOT/deploy/nginx.conf" "$TARGET:/etc/ild-deploy/" 2>/dev/null || \
  ssh "$TARGET" "mkdir -p /etc/ild-deploy && true"

echo "→ Настройка systemd и nginx"
ssh "$TARGET" "bash -s" <<'REMOTE'
set -e
APP_DIR=/var/www/ilya-portfolio

# .env с токеном бота и chat id: создаётся вручную, сюда не передаётся.
if [ ! -f "$APP_DIR/.env" ]; then
  echo "ВНИМАНИЕ: создайте $APP_DIR/.env с TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID"
fi
chown -R www-data:www-data "$APP_DIR"
chmod 600 "$APP_DIR/.env" 2>/dev/null || true

cp "$APP_DIR/ilya-portfolio.service" /etc/systemd/system/ilya-portfolio.service 2>/dev/null || true
sed -i 's#^WorkingDirectory=.*#WorkingDirectory='"$APP_DIR"'#' /etc/systemd/system/ilya-portfolio.service
sed -i 's#^ExecStart=.*#ExecStart=/usr/bin/node server.mjs#' /etc/systemd/system/ilya-portfolio.service

systemctl daemon-reload
systemctl enable --now ilya-portfolio
systemctl restart ilya-portfolio

if [ -f "$APP_DIR/nginx.conf" ]; then
  cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/ilya-portfolio
  ln -sf /etc/nginx/sites-available/ilya-portfolio /etc/nginx/sites-enabled/ilya-portfolio
  rm -f /etc/nginx/sites-enabled/default
  nginx -t && systemctl reload nginx || echo "nginx не настроен — пропускаю"
fi

echo "Готово: systemctl status ilya-portfolio"
REMOTE

echo "✓ Задеплоено. Проверка: ssh $TARGET 'curl -s localhost:3000 | head -c 200'"

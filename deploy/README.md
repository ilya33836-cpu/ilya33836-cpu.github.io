# Деплой портфолио на VPS

Статическая сборка раздаётся Node-сервисом, который заодно принимает заявки и
пересылает их в Telegram. Токен бота живёт только в `.env` на сервере.

## Что должно быть на сервере

- Ubuntu 22.04 / Debian 12
- Node.js 20+ (`node -v`; если нет — `apt install -y nodejs npm` или NodeSource)
- Nginx (`apt install -y nginx`)

## Разовая подготовка

```bash
apt update && apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
mkdir -p /var/www/ilya-portfolio/{dist,server}
```

## Загрузка с компьютера

```bash
./deploy/deploy.sh root@<IP>
```

Скрипт собирает проект, копирует `dist/` и сервер в `/var/www/ilya-portfolio`,
ставит systemd-юнит и конфиг Nginx, перезапускает сервис.

## Секреты на сервере

Файл не перезаписывается деплоем — создайте его вручную один раз:

```bash
nano /var/www/ilya-portfolio/.env
```

```
TELEGRAM_BOT_TOKEN=123456789:AA...
TELEGRAM_CHAT_ID=8866496840
```

```bash
chown www-data:www-data /var/www/ilya-portfolio/.env
chmod 600 /var/www/ilya-portfolio/.env
systemctl restart ilya-portfolio
```

## Проверка

```bash
curl -s http://127.0.0.1:3000 | head -c 200
curl -s -X POST http://127.0.0.1:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","contact":"@vebairazrabotka","message":"Проверка"}'
systemctl status ilya-portfolio
```

Ожидаемый ответ: `{"ok":true}` и сообщение в Telegram.

## Домен и HTTPS

1. Направьте A-запись домена на IP сервера, подождите 5–15 минут.
2. В `deploy/nginx.conf` замените `server_name _;` на ваш домен.
3. Выпустите сертификат:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.ru -d www.example.ru
systemctl reload nginx
```

Certbot сам добавит редирект на HTTPS и автопродление.

## Обновление сайта

```bash
./deploy/deploy.sh root@<IP>
```

Деплой не трогает `.env` на сервере.

# Деплой на Cloudflare Pages (бесплатно)

Статика едет на CDN Cloudflare, заявки принимает Pages Function и уходят в тот же
Telegram-бот. VPS не нужен.

## Что уже подготовлено

- `functions/api/lead.js` — функция `/api/lead`, пересылает заявку через `server/lead.ts`.
- `public/_headers` — кеш для хешированных билдов и заголовки безопасности (попадает в `dist` автоматически).
- `src/lib/leads.ts` — клиент шлёт форму на `/api/lead`; если функция недоступна,
  открывается Telegram с готовым текстом заявки.

## Способ 1. Через Git (рекомендуется)

Каждое исправление попадает на сайт автоматически после пуша.

1. Залейте проект в репозиторий на GitHub (ветка `main`).
2. Cloudflare → dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Выберите репозиторий.
4. Параметры сборки:
   - Framework preset: `None`
   - Build command: `npm run build:client`
   - Build output directory: `dist`
   - Root directory: корень проекта (если проект в подпапке — укажите её)
5. **Settings → Environment variables → Add variables** (Production и Preview):
   - `TELEGRAM_BOT_TOKEN` = токен от @BotFather
   - `TELEGRAM_CHAT_ID` = id вашего чата
6. **Save and Deploy**.

## Способ 2. Через Wrangler с компьютера

```powershell
npx wrangler login
npm run build:client
npx wrangler pages deploy dist --project-name ilya-portfolio
```

Секреты:

```powershell
"8663582344:AAF1XVf1W2BD9NF1IGshiLVOK_HqK-L7-90" | npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name ilya-portfolio
"8866496840" | npx wrangler pages secret put TELEGRAM_CHAT_ID --project-name ilya-portfolio
```

Сайт будет на `https://ilya-portfolio.pages.dev`.

## Домен

**Pages → ваш проект → Custom domains → Set up a custom domain** → впишите домен.
Cloudflare сам создаст DNS-запись, если домен куплен в Cloudflare.
Для домена из другого регистратора добавьте CNAME на `ilya-portfolio.pages.dev` у него.
Сертификат HTTPS выпускается автоматически за минуту.

## Проверка

```powershell
curl.exe -X POST https://ilya-portfolio.pages.dev/api/lead -H "Content-Type: application/json" -d '{"name":"Тест","contact":"@vebairazrabotka","message":"Проверка Cloudflare"}'
```

Ожидается `{"ok":true}` и сообщение в Telegram.

## Обновление

```powershell
npm run build:client
npx wrangler pages deploy dist --project-name ilya-portfolio
```

Или просто `git push` при способе 1.

## Если заявки не приходят

- Откройте **Pages → проект → Functions** и посмотрите логи: там будет `[lead] не отправлена: ...`
  - `not_configured` — не заданы переменные окружения (или заданы только для Preview).
  - `telegram_401` — неверный токен.
  - `telegram_400` — неверный `TELEGRAM_CHAT_ID`.
- Проверьте, что бот ещё активен и вы ему писали хотя бы раз (иначе Telegram не знает ваш chat id).

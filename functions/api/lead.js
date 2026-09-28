/**
 * Cloudflare Pages Function: приём заявок с формы и пересылка в Telegram.
 * Путь в проекте: /api/lead
 *
 * Секреты задаются в панели Cloudflare:
 * Settings → Environment variables → Production и Preview
 *   TELEGRAM_BOT_TOKEN — токен от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата, куда приходят заявки
 */
import { sendLead } from '../../server/lead'

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })

export async function onRequestPost(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204 })

  let lead = {}
  try {
    lead = await context.request.json()
  } catch {
    lead = {}
  }

  const result = await sendLead(lead, context.env ?? {})

  if (!result.ok) {
    console.error('[lead] не отправлена:', result.error)
  } else {
    console.log('[lead] заявка отправлена в Telegram')
  }

  return json(result)
}

export async function onRequest() {
  return json({ ok: false, error: 'method_not_allowed' }, 405)
}

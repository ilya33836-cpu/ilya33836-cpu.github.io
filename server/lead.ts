export type Lead = {
  name?: string
  contact?: string
  message?: string
  page?: string
}

export type LeadResult = { ok: true } | { ok: false; error: string }

export type LeadEnv = Record<string, string | undefined>

const MAX_LENGTH = 2000

const clean = (value: unknown, max = 300) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function buildMessage(lead: Lead) {
  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(clean(lead.name, 120)) || '—'}`,
    `<b>Контакт:</b> ${escapeHtml(clean(lead.contact, 120)) || '—'}`,
  ]

  if (clean(lead.page, 200)) lines.push(`<b>Страница:</b> ${escapeHtml(clean(lead.page, 200))}`)

  lines.push('', escapeHtml(clean(lead.message, MAX_LENGTH) || '—'))

  return lines.join('\n')
}

/** Отправляет заявку в Telegram от имени бота. Токен живёт только на сервере. */
export async function sendLead(lead: Lead, env: LeadEnv = {}): Promise<LeadResult> {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  if (!clean(lead.message)) return { ok: false, error: 'empty_message' }
  if (!token || !chatId) return { ok: false, error: 'not_configured' }

  type FetchLike = (
    url: string,
    init: { method: string; headers: Record<string, string>; body: string },
  ) => Promise<{ ok: boolean; status: number }>

  const request = (globalThis as { fetch?: unknown }).fetch as FetchLike | undefined
  if (!request) return { ok: false, error: 'no_fetch' }

  try {
    const response = await request(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(lead),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    return response.ok ? { ok: true } : { ok: false, error: `telegram_${response.status}` }
  } catch {
    return { ok: false, error: 'network_error' }
  }
}

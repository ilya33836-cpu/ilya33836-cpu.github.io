export type Lead = {
  name: string
  contact: string
  message: string
  page?: string
}

export type LeadStatus = 'sent' | 'fallback'

/**
 * Куда пробуем отправить заявку, по порядку.
 * Первый адрес — serverless-функция (Cloudflare Pages, Vercel),
 * второй — PHP-обработчик на обычном хостинге (Beget, Timeweb, REG.RU).
 */
const ENDPOINTS = ['/api/lead', '/api/lead.php']

/** Отправляет заявку и возвращает 'sent', если хотя бы один обработчик её принял. */
export async function submitLead(lead: Lead): Promise<LeadStatus> {
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })

      if (!response.ok) continue

      const result = (await response.json()) as { ok?: boolean }
      if (result.ok) return 'sent'
    } catch {
      // Обработчик недоступен — пробуем следующий.
    }
  }

  return 'fallback'
}

/** Резервный путь: открывает Telegram с уже готовым текстом заявки. */
export function telegramLeadLink(lead: Lead) {
  const text = [
    'Заявка с сайта',
    '',
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    '',
    lead.message,
  ].join('\n')

  const url = typeof window === 'undefined' ? '' : window.location.origin
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}

export type Lead = {
  name: string
  contact: string
  message: string
  page?: string
}

export type LeadStatus = 'sent' | 'fallback'

const ENDPOINT = '/api/lead'

/** Отправляет заявку на серверную функцию, которая пересылает её в Telegram. */
export async function submitLead(lead: Lead): Promise<LeadStatus> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    if (response.ok) {
      const result = (await response.json()) as { ok?: boolean }
      if (result.ok) return 'sent'
    }
  } catch {
    // Серверная функция недоступна — уходим в резервный сценарий.
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

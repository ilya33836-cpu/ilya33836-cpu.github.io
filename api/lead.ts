import { sendLead } from '../server/lead'
import type { Lead, LeadEnv } from '../server/lead'

type ApiRequest = {
  method?: string
  body?: unknown
}

type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (payload: unknown) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

function readEnv(): LeadEnv {
  const process = (globalThis as { process?: { env?: LeadEnv } }).process
  return process?.env ?? {}
}

function parseBody(body: unknown): Lead {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Lead
    } catch {
      return {}
    }
  }
  return (body ?? {}) as Lead
}

/**
 * Serverless-обработчик заявок (Vercel / Netlify Node).
 * Токен бота и chat id берутся из переменных окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' })
    return
  }

  const result = await sendLead(parseBody(req.body), readEnv())
  // Отвечаем 200 даже при ошибке доставки: клиент сам уходит в резервный сценарий с Telegram.
  res.status(200).json(result)
}

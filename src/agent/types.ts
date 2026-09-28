export type Role = 'user' | 'agent'

export type MessageKind = 'text' | 'summary'

export type Message = {
  id: string
  role: Role
  text: string
  kind?: MessageKind
  link?: { label: string; url: string }
}

export type Suggestion = { label: string; send?: string; focus?: boolean }

export type Turn = {
  text: string
  kind?: MessageKind
  link?: { label: string; url: string }
  suggestions?: Suggestion[]
}

export type Profile = {
  niche?: string
  projectType?: ServiceKey
  needsCabinet?: boolean
  needsLeads?: boolean
  hasLogo?: boolean
  deadline?: string
  contact?: string
}

export type ServiceKey =
  | 'landing'
  | 'corporate'
  | 'bot'
  | 'automation'
  | 'webapp'
  | 'crm'
  | 'saas'
  | 'ai'
  | 'unknown'

export type Brain = {
  /** Ответ агента на сообщение пользователя. */
  reply(history: Message[], input: string): Promise<Turn> | Turn
  /** Сброс диалога. */
  reset(): void
}

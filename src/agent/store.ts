import { useSyncExternalStore } from 'react'
import { createBrain } from './brain'
import { GREETING } from './knowledge'
import type { Message, Suggestion } from './types'

export type AgentState = {
  messages: Message[]
  suggestions: Suggestion[]
  typing: boolean
  summaryShown: boolean
}

const brain = createBrain()
const listeners = new Set<() => void>()

let sequence = 1
let replyTimer: number | undefined

const initialState = (): AgentState => ({
  messages: [{ id: 'welcome', role: 'agent', text: GREETING }],
  suggestions: [
    { label: 'Сайт для бизнеса', send: 'Мне нужен сайт для бизнеса' },
    { label: 'Что вы умеете?', send: 'Что вы умеете?' },
    { label: 'Показать примеры', send: 'Покажите примеры' },
  ],
  typing: false,
  summaryShown: false,
})

let state: AgentState = initialState()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const setState = (patch: Partial<AgentState>) => {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

const thinkingTime = (input: string) => 480 + Math.min(760, input.length * 14)

export function useAgentState() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export function sendMessage(input: string) {
  const text = input.trim()
  if (!text || state.typing) return

  if (text.toLowerCase() === 'startover') {
    resetConversation()
    return
  }

  const message: Message = { id: `u${sequence++}`, role: 'user', text }
  const history = [...state.messages, message]

  setState({
    messages: history,
    suggestions: [],
    typing: true,
  })

  window.clearTimeout(replyTimer)
  replyTimer = window.setTimeout(() => {
    Promise.resolve(brain.reply(history, text))
      .then((turn) => {
        setState({
          messages: [
            ...history,
            {
              id: `a${sequence++}`,
              role: 'agent',
              text: turn.text,
              kind: turn.kind,
              link: turn.link,
            },
          ],
          suggestions: turn.suggestions ?? [],
          typing: false,
          summaryShown: state.summaryShown || turn.kind === 'summary',
        })
      })
      .catch(() => {
        setState({
          messages: [
            ...history,
            {
              id: `a${sequence++}`,
              role: 'agent',
              text: 'Что-то пошло не так. Попробуйте переформулировать вопрос или опишите задачу ещё раз.',
            },
          ],
          typing: false,
        })
      })
  }, thinkingTime(text))
}

export function resetConversation() {
  window.clearTimeout(replyTimer)
  brain.reset()
  sequence = 1
  setState(initialState())
}

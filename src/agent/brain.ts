import { createLocalBrain } from './engine'
import type { Brain, Message, Turn } from './types'

const endpoint = import.meta.env.VITE_AGENT_ENDPOINT as string | undefined

/**
 * Точка подключения к LLM. Если задан VITE_AGENT_ENDPOINT, запросы уходят на
 * сервер, который сам обращается к модели. Контракт запроса:
 *   POST { messages: [{ role, text }] }  ->  { text, suggestions?, kind?, link? }
 */
function createRemoteBrain(url: string): Brain {
  return {
    async reply(history: Message[], input: string): Promise<Turn> {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', text: input }],
        }),
      })
      if (!response.ok) throw new Error(`Agent endpoint returned ${response.status}`)
      const data = (await response.json()) as Turn
      return { text: data.text ?? '', suggestions: data.suggestions ?? [] }
    },
    reset() {},
  }
}

function createFallbackBrain(remote: Brain, local: Brain): Brain {
  return {
    async reply(history: Message[], input: string) {
      try {
        return await remote.reply(history, input)
      } catch {
        return local.reply(history, input)
      }
    },
    reset() {
      remote.reset()
      local.reset()
    },
  }
}

export function createBrain(): Brain {
  const local = createLocalBrain()
  if (!endpoint) return local
  return createFallbackBrain(createRemoteBrain(endpoint), local)
}

export type AgentScope = 'widget' | 'section'

const EVENT = 'nova:open'

/** Открыть чат с агентом из любого места: виджет или секция на главной. */
export function openAgent(scope: AgentScope = 'widget') {
  window.dispatchEvent(new CustomEvent<AgentScope>(EVENT, { detail: scope }))
}

export function onOpenAgent(handler: (scope: AgentScope) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<AgentScope>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}

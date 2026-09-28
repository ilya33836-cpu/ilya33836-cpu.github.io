import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Send, X } from 'lucide-react'
import { resetConversation, sendMessage, useAgentState } from '../../agent/store'
import { ChatMessage } from './ChatMessage'

type Props = {
  className?: string
  onClose?: () => void
  focusRequest?: number
  showReset?: boolean
}

export function ChatPanel({ className = '', onClose, focusRequest = 0, showReset = true }: Props) {
  const { messages, suggestions, typing } = useAgentState()
  const [value, setValue] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const askContact = suggestions.some((suggestion) => suggestion.focus)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    if (focusRequest > 0) inputRef.current?.focus()
  }, [focusRequest])

  const submit = () => {
    if (!value.trim() || typing) return
    sendMessage(value)
    setValue('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const onInput = () => {
    const node = inputRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 120)}px`
  }

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_30px_80px_-30px_rgba(11,17,32,0.45)] ${className}`}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent font-display text-[14px] font-extrabold text-white">
          N
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block font-display text-[15px] font-bold text-ink">Nova</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI-консультант онлайн
          </span>
        </span>
        <div className="ml-auto flex items-center gap-1">
          {showReset && (
            <button
              type="button"
              onClick={resetConversation}
              aria-label="Начать диалог заново"
              title="Начать заново"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <RotateCcw size={15} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть чат"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Сообщения с AI-консультантом"
        className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-5"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-[20px] rounded-bl-md border border-line bg-canvas px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-muted"
                  animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && !typing && (
        <div className="flex shrink-0 flex-wrap gap-2 px-4 pb-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => {
                if (suggestion.focus) {
                  inputRef.current?.focus()
                  return
                }
                sendMessage(suggestion.send ?? suggestion.label)
              }}
              className="rounded-full border border-line bg-white px-3.5 py-2 text-[12px] font-medium text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="shrink-0 border-t border-line p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-canvas p-2 transition-colors duration-300 focus-within:border-accent focus-within:bg-white focus-within:ring-4 focus-within:ring-accent/10">
          <textarea
            ref={inputRef}
            rows={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onInput={onInput}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
            placeholder={askContact ? 'Telegram или телефон' : 'Опишите вашу задачу'}
            aria-label="Сообщение для AI-консультанта"
            className="max-h-[120px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[14px] leading-relaxed text-ink outline-none placeholder:text-muted/70"
          />
          <button
            type="submit"
            disabled={!value.trim() || typing}
            aria-label="Отправить сообщение"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all duration-300 hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-snug text-muted">
          Демо-режим: Nova отвечает по сценарию и не отправляет данные на сервер.
        </p>
      </form>
    </div>
  )
}

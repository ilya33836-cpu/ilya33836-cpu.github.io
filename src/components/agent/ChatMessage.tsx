import type { ReactNode } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import type { Message } from '../../agent/types'

function renderInline(text: string, offset: number): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${offset}-${index}`} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${offset}-${index}`}>{part}</span>
    ),
  )
}

function renderBlocks(text: string): ReactNode[] {
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flush = () => {
    if (bullets.length === 0) return
    const items = bullets
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="mt-2 space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{renderInline(item, index)}</span>
          </li>
        ))}
      </ul>,
    )
    bullets = []
  }

  text.split('\n').forEach((line) => {
    const value = line.trim()
    if (!value) {
      flush()
      return
    }
    if (value.startsWith('## ')) {
      flush()
      blocks.push(
        <p
          key={`h-${blocks.length}`}
          className="mb-1 font-display text-[15px] font-extrabold uppercase tracking-[0.06em] text-ink"
        >
          {renderInline(value.slice(3), blocks.length)}
        </p>,
      )
      return
    }
    if (value.startsWith('- ')) {
      bullets.push(value.slice(2))
      return
    }
    flush()
    blocks.push(
      <p key={`p-${blocks.length}`} className="[&+p]:mt-2">
        {renderInline(value, blocks.length)}
      </p>,
    )
  })

  flush()
  return blocks
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (message.kind === 'summary') {
    return (
      <div className="rounded-[24px] border border-accent/25 bg-accent-soft/70 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-accent" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">
            Заявка готова
          </span>
        </div>
        <div className="space-y-1.5 text-[14px] leading-relaxed text-ink">
          {renderBlocks(message.text)}
        </div>
        {message.link && (
          <a
            href={message.link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary mt-4 w-full !rounded-2xl !py-3 !text-sm"
          >
            {message.link.label}
            <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[86%] rounded-[20px] rounded-br-md bg-accent px-4 py-2.5 text-[14px] leading-relaxed text-white'
            : 'max-w-[90%] rounded-[20px] rounded-bl-md border border-line bg-canvas px-4 py-2.5 text-[14px] leading-relaxed text-ink'
        }
      >
        {renderBlocks(message.text)}
        {message.link && (
          <a
            href={message.link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-accent/25 bg-white px-3 py-2 text-[13px] font-semibold text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            {message.link.label}
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircleMore } from 'lucide-react'
import { onOpenAgent } from '../../agent/bus'
import { ChatPanel } from './ChatPanel'

export function AgentWidget() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => onOpenAgent((scope) => setOpen(scope === 'widget')), [])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-label="AI-консультант Nova"
            className="fixed inset-x-0 bottom-0 top-[84px] z-[65] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(640px,calc(100svh-120px))] sm:w-[400px]"
          >
            <ChatPanel onClose={() => setOpen(false)} className="h-full" />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-[65] flex items-center gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {!open && (
            <>
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none hidden rounded-2xl border border-line bg-white px-4 py-2.5 font-display text-[13px] font-semibold text-ink shadow-soft sm:block"
              >
                Задать вопрос AI
              </motion.span>

              <motion.button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Открыть AI-консультанта"
                whileHover={reduceMotion ? undefined : { scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_18px_38px_-14px_rgba(37,99,235,0.75)] transition-colors duration-300 hover:bg-accent-deep"
              >
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                  <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400/80" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <MessageCircleMore size={22} />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

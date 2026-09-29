import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { onOpenAgent } from '../agent/bus'
import { Reveal } from './ui/Reveal'
import { ChatPanel } from './agent/ChatPanel'

export function AIAgent() {
  const [focusRequest, setFocusRequest] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      onOpenAgent((scope) => {
        if (scope !== 'section') return
        setFocusRequest((value) => value + 1)
        chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }),
    [],
  )

  return (
    <section id="ai-agent" className="relative overflow-hidden bg-[#0b1120] py-24 sm:py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000_20%,transparent_75%)]" />
      <div className="decor pointer-events-none absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[130px]" />
      <div className="decor pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-violet-500/20 blur-[130px]" />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.02em] text-white/80">
              <Sparkles size={13} className="text-blue-400" />
              AI Sales Agent · Nova
            </span>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] text-white">
              Не знаете, какой проект вам нужен?
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/60">
              Вместо обычной формы заявки расскажите свою задачу AI-консультанту. Он определит
              тип проекта, задаст уточняющие вопросы и подготовит структурированное техническое
              описание.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#ai-agent"
                onClick={() => {
                  setFocusRequest((value) => value + 1)
                  chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                className="btn btn-primary w-full sm:w-auto"
              >
                Открыть AI Agent
                <ArrowUpRight size={17} />
              </a>
              <a href="#contact" className="btn btn-ghost-dark w-full sm:w-auto">
                Или оставить заявку
              </a>
            </div>
            <p className="mt-4 text-[13px] text-white/40">
              Nova определит тип проекта, задаст до двух вопросов за раз, покажет подходящее демо
              и соберёт готовое резюме.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div ref={chatRef} className="h-[clamp(460px,72vh,640px)]">
              <ChatPanel focusRequest={focusRequest} className="h-full" showReset={false} />
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

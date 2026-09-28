import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bot, Layers, Sparkles, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LaptopMockup } from './LaptopMockup'
import { openAgent } from '../agent/bus'

const EASE = [0.16, 1, 0.3, 1] as const

const metrics = [
  { value: '2+ года', label: 'разработки' },
  { value: 'React + TypeScript', label: 'Web App / SaaS' },
  { value: 'FastAPI + PostgreSQL', label: 'Backend и API' },
]

const floaters: {
  icon: LucideIcon
  title: string
  subtitle: string
  className: string
  delay: number
  status?: boolean
}[] = [
  {
    icon: Layers,
    title: 'AUTOHUB',
    subtitle: 'Web App',
    className: 'left-0 top-[7%] xl:-left-6',
    delay: 0,
  },
  {
    icon: Bot,
    title: 'AI Sales Agent',
    subtitle: 'Online',
    status: true,
    className: 'right-0 top-[44%] xl:-right-6',
    delay: 1.4,
  },
  {
    icon: Wrench,
    title: 'React + FastAPI',
    subtitle: 'Backend',
    className: 'bottom-[8%] left-2 xl:-left-2',
    delay: 2.6,
  },
]

function FloatingCard({ item }: { item: (typeof floaters)[number] }) {
  const reduceMotion = useReducedMotion()
  const Icon = item.icon

  return (
    <motion.div
      className={`absolute z-20 hidden xl:block ${item.className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, y: -6, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <motion.div
        animate={{ y: reduceMotion ? 0 : [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white/90 px-3.5 py-2.5 shadow-[0_18px_40px_-26px_rgba(17,24,39,0.5)] backdrop-blur-md"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={17} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[13px] font-bold text-ink">{item.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            {item.status && (
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
            {item.subtitle}
          </span>
        </span>
      </motion.div>
    </motion.div>
  )
}

function FloaterTile({ item, index }: { item: (typeof floaters)[number]; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="min-w-0 rounded-2xl border border-line bg-white px-3 py-2.5 shadow-soft xl:hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: EASE }}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={15} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-[12px] font-bold text-ink">
            {item.title}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted">
            {item.status && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            {item.subtitle}
          </span>
        </span>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="relative isolate overflow-hidden pt-[84px]">
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_35%,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-accent/12 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-accent/8 blur-[120px]" />

      <div className="shell grid min-h-[calc(100svh-84px)] items-center gap-12 py-14 lg:gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:gap-14 xl:py-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="eyebrow">
              <Sparkles size={13} className="text-accent" />
              WEB • SAAS • AI • AUTOMATION
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-[clamp(2rem,5.6vw,3.25rem)] font-extrabold leading-[1.06] text-ink"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
          >
            Разрабатываю сайты и{' '}
            <span className="relative whitespace-nowrap text-accent">
              цифровые продукты
              <svg
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-accent/30"
                aria-hidden="true"
              >
                <path
                  d="M2 9C60 3 120 2 180 5c40 2 78 4 118 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            для бизнеса.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
          >
            Создаю лендинги, Web App, CRM, SaaS-платформы, Telegram-ботов и AI-агентов с
            современным дизайном и продуманной логикой.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
          >
            <a href="#projects" className="btn btn-primary w-full sm:w-auto">
              Смотреть проекты
              <ArrowRight size={17} />
            </a>
            <button
              type="button"
              onClick={() => openAgent('widget')}
              className="btn btn-outline w-full sm:w-auto"
            >
              Поговорить с AI
              <Sparkles size={16} />
            </button>
          </motion.div>

          <motion.a
            href="#services"
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-muted transition-colors duration-300 hover:text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.34 }}
          >
            Услуги и цены — от 20 000 ₽
            <ArrowRight size={15} />
          </motion.a>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-y-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={index > 0 ? 'sm:border-l sm:border-line sm:pl-6' : ''}
              >
                <p className="font-display text-[19px] font-extrabold tracking-[-0.02em] text-ink">
                  {metric.value}
                </p>
                <p className="mt-1 text-[13px] text-muted">{metric.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative flex flex-col items-center xl:items-end"
          initial={{ opacity: 0, scale: 0.96, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        >
          <div className="w-full max-w-[560px] xl:max-w-[600px]">
            <LaptopMockup />
          </div>
          <div className="mt-6 grid w-full max-w-[560px] grid-cols-3 gap-3 xl:hidden">
            {floaters.map((item, index) => (
              <FloaterTile key={item.title} item={item} index={index} />
            ))}
          </div>
          {floaters.map((item) => (
            <FloatingCard key={`desktop-${item.title}`} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

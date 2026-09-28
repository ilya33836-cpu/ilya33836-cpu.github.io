import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import {
  aiBlock,
  priceNoteText,
  priceNoteTitle,
  pricingServices,
} from '../data/services'
import type { PricingService } from '../data/services'
import { Reveal, Stagger, fadeUp } from './ui/Reveal'

function ServiceCard({ service }: { service: PricingService }) {
  const [open, setOpen] = useState(false)
  const panelId = `service-panel-${service.id}`

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className={`card card-hover group relative flex flex-col overflow-hidden transition-colors duration-500 ${
        open ? 'border-accent/35 bg-[#fbfdff]' : ''
      }`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-[3px] origin-left bg-accent transition-transform duration-500 ${
          open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex flex-1 flex-col p-7 text-left sm:p-8"
      >
        <span className="flex items-start justify-between gap-4">
          <span className="font-display text-[13px] font-bold tracking-[0.22em] text-muted">
            {service.number}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-muted transition-transform duration-500 group-hover:text-accent ${
              open ? 'rotate-180 text-accent' : ''
            }`}
          />
        </span>

        <h3 className="mt-5 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[24px]">
          {service.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.description}</p>

        <span className="mt-auto flex items-end justify-between gap-3 pt-7">
          <span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Стоимость
            </span>
            <span className="mt-1 block whitespace-nowrap font-display text-[22px] font-extrabold tracking-[-0.03em] text-ink sm:text-[26px]">
              {service.price}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors duration-300 group-hover:border-accent/45 group-hover:text-accent">
            Подробнее
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-7 pb-7 pt-6 sm:px-8 sm:pb-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Что входит
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              {service.extras && (
                <div className="mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {service.extrasTitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.extras.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {service.examples && (
                <div className="mt-6 space-y-2.5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Пример процесса
                  </p>
                  {service.examples.map((example) => (
                    <p
                      key={example}
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-ink"
                    >
                      {example}
                    </p>
                  ))}
                </div>
              )}

              {service.fits && (
                <div className="mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Подходит для
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    {service.fits.join(' · ')}
                  </p>
                </div>
              )}

              {service.note && (
                <p className="mt-6 rounded-2xl border border-accent/20 bg-accent-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
                  {service.note}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-2.5">
                {service.cases?.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-outline w-full !rounded-2xl !px-5 !py-3.5 !text-sm"
                  >
                    {item.title} — {item.label}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
                <a
                  href={service.cta.href}
                  className="btn btn-primary w-full !rounded-2xl !px-5 !py-3.5 !text-sm"
                >
                  {service.cta.label}
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export function ServicesPricing() {
  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">Прайс</span>
          <h2 className="mt-5 text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold uppercase leading-[1.06] tracking-[-0.02em] text-ink">
            Услуги и цены
          </h2>
          <p className="mt-5 text-[18px] font-medium leading-relaxed text-ink">
            Создаём сайты, Telegram-ботов и цифровые системы для бизнеса.
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Стоимость указана ориентировочно. Финальная цена зависит от задач и объёма проекта.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid items-start gap-5 md:grid-cols-2">
          {pricingServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Stagger>

        <Reveal delay={0.06} className="mt-5">
          <div className="card overflow-hidden p-7 sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[12px] font-semibold text-accent">
                  <Sparkles size={13} />
                  AI внутри бизнес-процессов
                </span>
                <h3 className="mt-4 font-display text-[19px] font-extrabold leading-snug text-ink sm:text-[21px]">
                  {aiBlock.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{aiBlock.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {aiBlock.combos.map((combo) => (
                    <span key={combo} className="chip">
                      {combo}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={aiBlock.case.url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline shrink-0 !rounded-2xl !text-sm"
              >
                {aiBlock.case.label}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-ink/10 bg-[#0b1120] p-7 sm:p-9">
              <div>
                <h3 className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[22px]">
                  Нужно что-то другое?
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
                  Опишите задачу — подберём подходящее решение и рассчитаем стоимость проекта.
                </p>
              </div>
              <a href="#contact" className="btn btn-ghost-dark mt-7 w-full !rounded-2xl sm:w-auto">
                Обсудить проект
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-line bg-white p-7 sm:p-9">
              <div>
                <h3 className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[22px]">
                  {priceNoteTitle}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{priceNoteText}</p>
              </div>
              <a
                href="#projects"
                className="mt-7 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors duration-300 hover:text-accent-deep"
              >
                Посмотреть реализованные проекты
                <ArrowRight size={15} className="transition-transform duration-300 hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5 overflow-hidden rounded-[32px] bg-gradient-to-br from-accent to-[#1d4ed8] p-8 sm:p-12">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.02em] text-white">
                  Готовы создать проект?
                </h3>
                <p className="mt-4 text-[16px] leading-relaxed text-white/80">
                  Расскажите о задаче — обсудим решение, сроки и стоимость.
                </p>
              </div>
              <a
                href="#contact"
                className="btn w-full !rounded-2xl !border !border-white/25 !bg-white !text-accent hover:!bg-accent-soft lg:w-auto"
              >
                Обсудить проект
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

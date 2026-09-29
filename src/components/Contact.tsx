import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react'
import { contact } from '../data/site'
import { submitLead, telegramLeadLink } from '../lib/leads'
import { Reveal } from './ui/Reveal'

type Fields = { name: string; contact: string; message: string }
type Status = 'idle' | 'sending' | 'sent' | 'fallback'

const emptyFields: Fields = { name: '', contact: '', message: '' }

const inputClass =
  'w-full rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[15px] text-ink outline-none transition-all duration-300 placeholder:text-muted/70 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10'

export function Contact() {
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (key: keyof Fields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof Fields, string>> = {}
    if (!fields.name.trim()) nextErrors.name = 'Укажите имя'
    if (!fields.contact.trim()) nextErrors.contact = 'Укажите Telegram'
    if (!fields.message.trim()) nextErrors.message = 'Опишите задачу'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('sending')
    const result = await submitLead({ ...fields, page: 'Секция «Обсудим ваш проект»' })

    if (result === 'fallback') {
      window.open(telegramLeadLink(fields), '_blank', 'noopener,noreferrer')
      setStatus('fallback')
      return
    }

    setStatus('sent')
  }

  const reset = () => {
    setFields(emptyFields)
    setStatus('idle')
  }

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="decor pointer-events-none absolute right-0 top-0 -z-10 h-[380px] w-[380px] rounded-full bg-accent/8 blur-[120px]" />

      <div className="shell">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Контакты</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
            Обсудим ваш проект
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Расскажите о задаче — отвечу с идеями по структуре, стеку и срокам.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <div className="flex flex-col gap-5">
            <Reveal>
              <a
                href={contact.telegramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="card card-hover group flex items-center gap-4 p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#229ED9]/10 text-[#1B92CE]">
                  <Send size={21} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-muted">Telegram</span>
                  <span className="mt-0.5 block truncate font-display text-[17px] font-bold text-ink">
                    {contact.telegramLabel}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            </Reveal>

            <Reveal delay={0.1} className="flex-1">
              <div className="flex h-full flex-col justify-center rounded-[28px] border border-line bg-accent-soft/60 p-6">
                <p className="font-display text-[16px] font-bold text-ink">Что дальше</p>
                <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-muted">
                  <li className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Разбираем задачу и предлагаем структуру проекта.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Фиксируем этапы, сроки и стоимость.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Запускаем работу и показываем результат по этапам.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card h-full p-6 sm:p-9">
              <AnimatePresence mode="wait">
                {status === 'sent' || status === 'fallback' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500">
                      <CheckCircle2 size={30} />
                    </span>
                    <h3 className="mt-6 font-display text-[22px] font-extrabold text-ink">
                      Заявка отправлена
                    </h3>
                    <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
                      {status === 'fallback'
                        ? 'Открыл Telegram с готовым текстом заявки — нажмите «Отправить», чтобы я получил её. Также продублирую в личные сообщения.'
                        : 'Заявка уже у меня в Telegram. Свяжусь с вами в ближайшее время и предложу следующий шаг по проекту.'}
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                      {status === 'fallback' && (
                        <a
                          href={telegramLeadLink(fields)}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="btn btn-primary !rounded-2xl !text-sm"
                        >
                          Открыть Telegram
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={reset}
                        className="btn btn-outline !rounded-2xl !text-sm"
                      >
                        Отправить ещё одну заявку
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-full flex-col justify-center"
                    noValidate
                  >
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-[13px] font-semibold text-ink"
                        >
                          Имя
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={fields.name}
                          onChange={(event) => update('name')(event.target.value)}
                          placeholder="Как к вам обращаться"
                          className={inputClass}
                        />
                        {errors.name && (
                          <p className="mt-2 text-[12px] font-medium text-danger">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-field"
                          className="mb-2 block text-[13px] font-semibold text-ink"
                        >
                          Telegram
                        </label>
                        <input
                          id="contact-field"
                          type="text"
                          value={fields.contact}
                          onChange={(event) => update('contact')(event.target.value)}
                          placeholder="@username или ссылка на профиль"
                          className={inputClass}
                        />
                        {errors.contact && (
                          <p className="mt-2 text-[12px] font-medium text-danger">
                            {errors.contact}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block text-[13px] font-semibold text-ink"
                        >
                          Описание проекта
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          value={fields.message}
                          onChange={(event) => update('message')(event.target.value)}
                          placeholder="Задача, сроки, бюджет — всё, что поможет начать"
                          className={`${inputClass} resize-none`}
                        />
                        {errors.message && (
                          <p className="mt-2 text-[12px] font-medium text-danger">
                            {errors.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn btn-primary mt-7 w-full !py-4 disabled:cursor-wait disabled:opacity-70"
                    >
                      {status === 'sending' ? 'Отправляю…' : 'Отправить заявку'}
                      <ArrowUpRight size={17} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

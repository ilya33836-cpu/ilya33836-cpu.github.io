import { ArrowUpRight, Send } from 'lucide-react'
import { contact } from '../data/site'
import { Reveal } from './ui/Reveal'

const hints = [
  {
    title: 'Задача',
    text: 'Что нужно сделать и для кого: сайт, бот, CRM или автоматизация.',
  },
  {
    title: 'Сроки',
    text: 'Когда планируете запуск — от этого зависят этапы и очередь.',
  },
  {
    title: 'Бюджет',
    text: 'Вилка или ограничение — так я сразу предложу реалистичный вариант.',
  },
]

export function Contact() {
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
            Напишите мне в Telegram — отвечу с идеями по структуре, стеку и срокам.
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
            <div className="card flex h-full flex-col justify-center p-6 sm:p-9">
              <h3 className="font-display text-[20px] font-extrabold text-ink">
                Что написать в первом сообщении
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Трёх пунктов достаточно — остальное уточним по ходу разговора.
              </p>

              <ul className="mt-7 space-y-4">
                {hints.map((hint) => (
                  <li key={hint.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-[12px] font-bold text-accent">
                      {hint.title[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-ink">
                        {hint.title}
                      </span>
                      <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">
                        {hint.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={contact.telegramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary mt-9 w-full !py-4 sm:w-auto sm:px-8"
              >
                Написать в Telegram
                <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

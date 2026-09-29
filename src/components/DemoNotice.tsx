import { AlertCircle, Clock3, LockKeyhole } from 'lucide-react'
import { Reveal } from './ui/Reveal'

const notices = [
  { icon: Clock3, text: 'Первый запуск сервера: до 60 сек' },
  { icon: LockKeyhole, text: 'Иногда вход требует повторной попытки' },
  { icon: AlertCircle, text: 'Демо открываются в обычном браузере' },
]

export function DemoNotice() {
  return (
    <section id="demo-notice" className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-danger-soft" />
      <div className="decor pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-200/25 blur-[120px]" />

      <div className="shell">
        <Reveal>
          <div className="rounded-[28px] border border-red-100 bg-white p-6 shadow-soft sm:p-9">
            <div className="border-l-4 border-danger pl-5 sm:pl-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-danger">
                <AlertCircle size={24} />
              </span>
              <h2 className="mt-5 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] font-extrabold uppercase leading-tight tracking-[-0.01em] text-danger">
                Важно перед открытием demo
              </h2>

              <div className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-muted">
                <p>
                  Все проекты размещены на бесплатном зарубежном хостинге исключительно в
                  демонстрационных целях.
                </p>
                <p>
                  Из-за особенностей бесплатного тарифа сервер автоматически «засыпает» после
                  периода бездействия.
                </p>
                <p>
                  Поэтому первое открытие Web App может занимать{' '}
                  <strong className="font-semibold text-ink">20–60 секунд</strong> — это
                  абсолютно нормальное поведение.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50/70 p-6 sm:p-7">
              <h3 className="font-display text-[17px] font-bold text-danger">Обратите внимание</h3>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#7f1d1d]/80">
                <p>
                  В проектах <strong className="font-semibold text-danger">AUTOHUB</strong>,{' '}
                  <strong className="font-semibold text-danger">NEXORA</strong> и{' '}
                  <strong className="font-semibold text-danger">AI SALES AGENT</strong> вход в
                  аккаунт может выполниться{' '}
                  <strong className="font-semibold text-danger">не с первого раза</strong>.
                </p>
                <p>
                  Если авторизация не произошла сразу — просто повторите вход ещё раз после
                  полной загрузки сервера.
                </p>
                <p>Это связано исключительно с бесплатным хостингом Render.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {notices.map((notice, index) => {
            const Icon = notice.icon
            return (
              <Reveal key={notice.text} delay={0.08 * index}>
                <div className="flex h-full items-center gap-3.5 rounded-[24px] border border-red-100 bg-white px-5 py-5 shadow-soft transition-colors duration-500 hover:border-red-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-danger">
                    <Icon size={18} />
                  </span>
                  <span className="text-[14px] font-medium leading-snug text-ink">
                    {notice.text}
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

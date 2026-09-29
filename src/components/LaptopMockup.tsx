import { useState } from 'react'

function Bar({ w = 'w-16', tone = 'bg-[#e8eaee]' }: { w?: string; tone?: string }) {
  return <span className={`block h-[5px] rounded-full ${w} ${tone}`} />
}

function NavRow({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-[5px] ${
        active ? 'bg-accent-soft' : ''
      }`}
    >
      <span
        className={`h-[10px] w-[10px] rounded-[3px] ${
          active ? 'bg-accent' : 'bg-[#dfe2e7]'
        }`}
      />
      <span
        className={`text-[9px] font-semibold tracking-tight ${
          active ? 'text-accent' : 'text-[#9aa1ad]'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function KanbanCard({ title, tone }: { title: string; tone: string }) {
  return (
    <div className="rounded-lg border border-[#eceef1] bg-white p-2 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <span className="mb-[6px] block h-[6px] w-[14px] rounded-full" style={{ background: tone }} />
      <span className="block text-[9px] font-semibold leading-tight text-ink">{title}</span>
      <div className="mt-[7px] flex items-center gap-1">
        <span className="h-[10px] w-[10px] rounded-full bg-[#dfe2e7]" />
        <Bar w="w-8" />
      </div>
    </div>
  )
}

function NexoraScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[#eef0f3] bg-[#f7f8fa] px-3 py-2">
        <span className="flex gap-1">
          <span className="h-[6px] w-[6px] rounded-full bg-[#ff5f57]" />
          <span className="h-[6px] w-[6px] rounded-full bg-[#febc2e]" />
          <span className="h-[6px] w-[6px] rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-[3px] text-[8px] font-medium text-[#9aa1ad] ring-1 ring-[#eceef1]">
          <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" />
          nexora.app/workspace
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[27%] shrink-0 border-r border-[#eef0f3] p-2.5 sm:block">
          <div className="mb-3 flex items-center gap-1.5 px-1">
            <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[5px] bg-ink text-[8px] font-bold text-white">
              N
            </span>
            <span className="text-[9px] font-extrabold tracking-[-0.02em] text-ink">NEXORA</span>
          </div>
          <div className="space-y-[2px]">
            <NavRow label="Обзор" />
            <NavRow label="Проекты" active />
            <NavRow label="Задачи" />
            <NavRow label="Календарь" />
            <NavRow label="Команда" />
            <NavRow label="Аналитика" />
          </div>
          <div className="mt-3 rounded-lg bg-[#f7f8fa] p-2">
            <Bar w="w-10" tone="bg-[#d7dbe1]" />
            <Bar w="w-14" />
            <div className="mt-2 flex items-end gap-[3px]">
              {[40, 70, 52, 88, 64, 96].map((height, index) => (
                <span
                  key={index}
                  className="w-[6px] rounded-sm bg-accent/70"
                  style={{ height: `${height * 0.13}px` }}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 bg-[#fbfbfc] p-2.5">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold tracking-[-0.02em] text-ink">Проекты</p>
              <p className="text-[8px] text-[#9aa1ad]">Рабочее пространство</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md border border-[#eef0f3] bg-white px-2 py-[4px] text-[8px] font-semibold text-[#9aa1ad]">
                Q3
              </span>
              <span className="rounded-md bg-ink px-2 py-[4px] text-[8px] font-semibold text-white">
                + Задача
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  В работе
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="Онбординг" tone="#2563eb" />
                <KanbanCard title="Дизайн CRM" tone="#8b5cf6" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-amber-400" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  Ревью
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="API лидов" tone="#f59e0b" />
                <KanbanCard title="Миграция" tone="#f59e0b" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  Готово
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="Авторизация" tone="#10b981" />
                <KanbanCard title="Аналитика" tone="#10b981" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
              { label: 'Задачи', value: '128' },
              { label: 'Команда', value: '24' },
              { label: 'Sprint', value: '9 дн.' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#eceef1] bg-white p-2 text-center"
              >
                <p className="text-[11px] font-extrabold text-ink">{item.value}</p>
                <p className="text-[8px] text-[#9aa1ad]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Реальный скриншот NEXORA, если файл добавлен в public/projects. */
const NEXORA_SHOT = '/projects/nexora-3.webp'

export function LaptopMockup() {
  const [shotReady, setShotReady] = useState(false)

  return (
    <div className="relative mx-auto w-full max-w-[620px] select-none">
      <div className="decor pointer-events-none absolute -inset-x-10 -top-10 bottom-6 -z-10 rounded-full bg-accent/20 blur-[90px]" />

      <div className="relative rounded-[24px] bg-gradient-to-b from-[#1c2436] to-[#0b1120] p-[10px] shadow-[0_40px_90px_-40px_rgba(11,17,32,0.65)] ring-1 ring-white/10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-white">
          {!shotReady && <NexoraScreen />}
          <img
            src={NEXORA_SHOT}
            alt="NEXORA — рабочее пространство проектов"
            loading="lazy"
            decoding="async"
            onLoad={() => setShotReady(true)}
            onError={() => setShotReady(false)}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
              shotReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="decor pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/25" />
        </div>
        <span className="absolute left-1/2 top-[3px] h-[3px] w-[52px] -translate-x-1/2 rounded-full bg-white/10" />
      </div>
      <div className="relative mx-auto h-[16px] w-[106%] rounded-b-[18px] bg-gradient-to-b from-[#263048] to-[#0b1120] shadow-[0_18px_30px_-24px_rgba(11,17,32,0.9)]">
        <span className="absolute left-1/2 top-0 h-[5px] w-[13%] -translate-x-1/2 rounded-b-full bg-[#0b1120]" />
      </div>
    </div>
  )
}

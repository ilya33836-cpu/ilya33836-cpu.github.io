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

function WorkbenchScreen() {
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
          studio.local / workspace
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[27%] shrink-0 border-r border-[#eef0f3] p-2.5 sm:block">
          <div className="mb-3 flex items-center gap-1.5 px-1">
            <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[5px] bg-ink text-[8px] font-bold text-white">
              N
            </span>
              <span className="text-[9px] font-extrabold tracking-[-0.02em] text-ink">WORKSPACE</span>
          </div>
          <div className="space-y-[2px]">
            <NavRow label="Обзор" />
            <NavRow label="Мои задачи" active />
            <NavRow label="Проекты" />
            <NavRow label="Сообщения" />
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
              <p className="text-[11px] font-extrabold tracking-[-0.02em] text-ink">Задачи проекта</p>
              <p className="text-[8px] text-[#9aa1ad]">Личный кабинет клиента · AUTOHUB</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md border border-[#eef0f3] bg-white px-2 py-[4px] text-[8px] font-semibold text-[#9aa1ad]">
                Сегодня
              </span>
              <span className="rounded-md bg-ink px-2 py-[4px] text-[8px] font-semibold text-white">
                + Новая задача
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  Готово
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="Макет профиля" tone="#2563eb" />
                <KanbanCard title="История обслуживания" tone="#8b5cf6" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-amber-400" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  В работе
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="Карточка клиента" tone="#f59e0b" />
                <KanbanCard title="Онлайн-запись" tone="#f59e0b" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b7280]">
                  Следом
                </span>
              </div>
              <div className="space-y-1.5">
                <KanbanCard title="Уведомления" tone="#10b981" />
                <KanbanCard title="Проверка адаптива" tone="#10b981" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
              { label: 'Выполнено', value: '6 / 9' },
              { label: 'Сейчас', value: 'API клиента' },
              { label: 'До запуска', value: '3 шага' },
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

export function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] select-none">
      <div className="decor pointer-events-none absolute -inset-x-10 -top-10 bottom-6 -z-10 rounded-full bg-accent/20 blur-[90px]" />

      <div className="relative rounded-[24px] bg-gradient-to-b from-[#1c2436] to-[#0b1120] p-[10px] shadow-[0_40px_90px_-40px_rgba(11,17,32,0.65)] ring-1 ring-white/10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-white">
          <WorkbenchScreen />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur sm:left-auto sm:w-[46%]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-[9px] font-bold text-ink sm:text-[10px]">Задача в работе</strong>
              <span className="block truncate text-[8px] text-[#69758b] sm:text-[9px]">Личный кабинет клиента · AUTOHUB</span>
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[8px] font-semibold text-emerald-700 sm:text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse motion-reduce:animate-none" />
              <span>67%</span>
              <span className="h-1 w-8 overflow-hidden rounded-full bg-emerald-100"><span className="block h-full w-2/3 rounded-full bg-emerald-500" /></span>
            </span>
          </div>
        </div>
        <span className="absolute left-1/2 top-[3px] h-[3px] w-[52px] -translate-x-1/2 rounded-full bg-white/10" />
      </div>
      <div className="relative mx-auto h-[16px] w-[106%] rounded-b-[18px] bg-gradient-to-b from-[#263048] to-[#0b1120] shadow-[0_18px_30px_-24px_rgba(11,17,32,0.9)]">
        <span className="absolute left-1/2 top-0 h-[5px] w-[13%] -translate-x-1/2 rounded-b-full bg-[#0b1120]" />
      </div>
    </div>
  )
}

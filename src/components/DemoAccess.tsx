import { KeyRound } from 'lucide-react'
import type { ProjectAccount } from '../data/projects'

type Props = {
  accounts: ProjectAccount[]
}

export function DemoAccess({ accounts }: Props) {
  if (accounts.length === 0) return null

  return (
    <div className="mt-5 rounded-2xl border border-accent/20 bg-accent-soft/60 px-4 py-3.5">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
        <KeyRound size={13} />
        Демо-доступ
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {accounts.map((account) => {
          const parts = [
            account.login && account.login !== account.role ? account.login : null,
            account.email,
            account.password ? `пароль ${account.password}` : null,
          ].filter((part): part is string => Boolean(part))

          return (
            <li key={account.role} className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
              <span className="chip !py-0.5 !text-[11px]">{account.role}</span>
              <span className="font-mono text-ink">{parts.join(' · ')}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

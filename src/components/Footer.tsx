import { ArrowUpRight, Send } from 'lucide-react'
import { contact, navLinks } from '../data/site'

const socialIcons = [{ label: 'Telegram', href: contact.telegramUrl, icon: Send }]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b1120] pt-20 pb-10">
      <div className="decor pointer-events-none absolute -bottom-32 left-1/4 h-[380px] w-[520px] rounded-full bg-accent/18 blur-[130px]" />

      <div className="shell relative">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <div>
            <p className="font-display text-[30px] font-extrabold tracking-[-0.04em] text-white">
              ILYA
            </p>
            <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.2em] text-white/45">
              Web Developer
            </p>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55">
              Сайты и цифровые продукты для бизнеса: лендинги, Web App, CRM, SaaS, Telegram-боты
              и AI-агенты.
            </p>
            <div className="mt-7 flex gap-3">
              {socialIcons.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          <nav aria-label="Навигация">
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white/40">
              Навигация
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-[15px] text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 transition-opacity duration-300 hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white/40">
              Связаться
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={contact.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[15px] text-white/65 transition-colors duration-300 hover:text-white"
                >
                  <Send size={15} className="text-blue-400" />
                  {contact.telegramLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ILYA. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

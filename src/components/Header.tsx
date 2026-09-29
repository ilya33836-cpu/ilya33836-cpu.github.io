import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Menu, X } from 'lucide-react'
import { contact, navLinks } from '../data/site'
import { openAgent } from '../agent/bus'

const SECTION_IDS = ['services', 'projects', 'ai-agent', 'faq', 'contact']

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    SECTION_IDS.forEach((id) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-line shadow-[0_1px_0_rgba(17,24,39,0.02),0_10px_30px_-24px_rgba(17,24,39,0.35)]'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
      <div className="shell flex h-[84px] items-center justify-between gap-6">
        <a href="#top" className="group flex flex-col leading-none">
          <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-ink">
            ILYA
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent">
            Web Developer
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 ${
                  active === id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  className={`pointer-events-none absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_2px_rgba(17,24,39,0.06)] ring-1 ring-line transition-opacity duration-300 ${
                    active === id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => openAgent('widget')}
            className="btn btn-outline !rounded-2xl !px-5 !py-3 !text-sm"
          >
            AI Agent
          </button>
          <a href="#contact" className="btn btn-primary !rounded-2xl !px-5 !py-3 !text-sm">
            Обсудить проект
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white/90 text-ink transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      </header>

      {/* Панель вынесена из header: backdrop-filter у шапки делает её
          containing block для position: fixed, и вложенное меню схлопывалось. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="rise fixed inset-x-0 bottom-0 top-[84px] z-40 lg:hidden"
          style={{ '--rise-y': '-12px' } as CSSProperties}
        >
          <div className="h-full overflow-y-auto overscroll-contain border-t border-line bg-white px-5 py-5 pb-10">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl px-4 py-3.5 text-[17px] font-medium text-ink transition-colors hover:bg-accent-soft hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    openAgent('widget')
                  }}
                  className="btn btn-outline w-full"
                >
                  AI Agent
                </button>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Обсудить проект
                </a>
                <a
                  href={contact.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="py-2 text-center text-sm font-medium text-muted"
                >
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>
      )}
    </>
  )
}

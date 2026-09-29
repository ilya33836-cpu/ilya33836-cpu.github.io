import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Globe2,
  Send,
  X,
  ZoomIn,
} from 'lucide-react'
import type { Project } from '../data/projects'
import { contact } from '../data/site'
import { ProjectPreview } from './ProjectPreview'
import { DemoAccess } from './DemoAccess'

type Props = {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined)
  const [broken, setBroken] = useState<string[]>([])

  const gallery = (project?.gallery ?? []).filter((item) => !broken.includes(item))
  const index = Math.max(0, gallery.indexOf(activeSrc ?? ''))
  const mainSrc = gallery[index] ?? project?.image
  const hasGallery = gallery.length > 1

  const step = (delta: number) => {
    if (gallery.length < 2) return
    const next = (index + delta + gallery.length) % gallery.length
    setActiveSrc(gallery[next])
  }

  useEffect(() => {
    if (!project) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose, index, gallery])

  useEffect(() => {
    setActiveSrc(undefined)
    setBroken([])
  }, [project?.id])

  // Портал в body: внутри секции с content-visibility окно позиционировалось бы
  // относительно секции, а не экрана, и уезжало вниз на телефоне.
  return createPortal(
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Закрыть окно"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white shadow-[0_50px_120px_-40px_rgba(11,17,32,0.6)] sm:rounded-[32px]"
          >
            <div className="relative">
              <ProjectPreview
                project={project}
                src={mainSrc}
                ratio="aspect-[16/9]"
                onUnavailable={() => mainSrc && setBroken((prev) => [...prev, mainSrc])}
              />

              {hasGallery && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Предыдущий скриншот"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/85 text-ink shadow-soft backdrop-blur transition-all duration-300 hover:bg-white hover:text-accent sm:left-4 sm:h-11 sm:w-11"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Следующий скриншот"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/85 text-ink shadow-soft backdrop-blur transition-all duration-300 hover:bg-white hover:text-accent sm:right-4 sm:h-11 sm:w-11"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur">
                    {index + 1} / {gallery.length}
                  </span>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-ink shadow-soft backdrop-blur transition-colors hover:bg-white hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="px-6 pt-4 sm:px-9">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[12px] font-medium text-muted">
                    Нажмите на миниатюру, чтобы открыть кадр
                  </p>
                </div>
                <div className="mt-2.5 flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gallery.map((item, itemIndex) => {
                    const active = item === mainSrc
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setActiveSrc(item)}
                        aria-label={`Показать скриншот ${itemIndex + 1}`}
                        aria-current={active}
                        title={`Кадр ${itemIndex + 1} из ${gallery.length}`}
                        className={`group/thumb relative h-[72px] w-28 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft sm:h-20 sm:w-32 ${
                          active
                            ? 'border-accent ring-2 ring-accent/25'
                            : 'border-line opacity-70 hover:border-accent/45 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item}
                          srcSet={item.endsWith('.webp')
                            ? `${item.replace(/\.webp$/, '-160.webp')} 160w, ${item.replace(/\.webp$/, '-320.webp')} 320w, ${item} 1600w`
                            : undefined}
                          sizes="128px"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={() => setBroken((prev) => [...prev, item])}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                        />
                        {active ? (
                          <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white shadow">
                            <Check size={12} />
                          </span>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover/thumb:bg-ink/20 group-hover/thumb:opacity-100">
                            <ZoomIn size={16} className="text-white" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip !border-accent/25 !bg-accent-soft !font-semibold !text-accent">
                  {project.category}
                </span>
                {project.stack.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>

              <h2
                id="project-modal-title"
                className="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.1] text-ink"
              >
                {project.title}
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{project.description}</p>

              {project.accounts && <DemoAccess accounts={project.accounts} />}

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 rounded-2xl border border-line bg-canvas px-4 py-3 text-[15px] text-ink"
                  >
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              {project.coldStart && (
                <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] leading-relaxed text-amber-900">
                  <Clock3 size={17} className="mt-0.5 shrink-0" />
                  Демо работает на бесплатном хостинге Render: первый запуск может занять до 60
                  секунд, а вход — потребовать повторной попытки.
                </p>
              )}

              {project.vpn && (
                <p className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] leading-relaxed text-amber-900">
                  <Globe2 size={17} className="mt-0.5 shrink-0" />
                  Сайт размещён на зарубежном хостинге и может быть недоступен без VPN.
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Открыть демо
                  <ExternalLink size={17} />
                </a>
                <a
                  href={contact.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-outline w-full sm:w-auto"
                >
                  <Send size={16} />
                  Обсудить похожий проект
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

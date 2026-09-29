import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  src?: string
  ratio?: string
  eager?: boolean
  className?: string
  onUnavailable?: () => void
}

export function ProjectPreview({
  project,
  src,
  ratio = 'aspect-[16/10]',
  eager = false,
  className = '',
  onUnavailable,
}: Props) {
  const initial = src ?? project.image
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Повторная попытка с меняющимся адресом: если браузер отдаёт из кэша
  // устаревшую картинку или первый запрос оборвался, второй проходит.
  const current = attempt === 0 ? initial : `${initial}?attempt=${attempt}`

  useEffect(() => {
    setAttempt(0)
    setLoaded(false)
    setFailed(false)
  }, [initial])

  const handleError = () => {
    if (attempt === 0) {
      setAttempt(1)
      return
    }
    if (project.fallbackImage && current !== project.fallbackImage) {
      setAttempt(-1)
      return
    }
    setFailed(true)
    onUnavailable?.()
  }

  const imageSrc = attempt === -1 ? (project.fallbackImage ?? current) : current

  return (
    <div className={`relative overflow-hidden bg-[#f4f5f7] ${ratio} ${className}`}>
      {!loaded && !failed && <div className="skeleton absolute inset-0" aria-hidden="true" />}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] px-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white/70">
            <ImageOff size={18} />
          </span>
          <span className="font-display text-[15px] font-bold text-white">{project.title}</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/45">
            {project.category}
          </span>
        </div>
      ) : (
        <img
          key={imageSrc}
          src={imageSrc}
          alt={`Интерфейс проекта ${project.title}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

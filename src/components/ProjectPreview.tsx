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
  const [current, setCurrent] = useState(initial)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrent(initial)
    setLoaded(false)
    setFailed(false)
  }, [initial])

  const handleError = () => {
    if (project.fallbackImage && current !== project.fallbackImage) {
      setCurrent(project.fallbackImage)
      return
    }
    setFailed(true)
    onUnavailable?.()
  }

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
          key={current}
          src={current}
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

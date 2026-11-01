import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Expand } from 'lucide-react'
import type { Project } from '../data/projects'
import { featuredProjects, landingProjects } from '../data/projects'
import { ProjectPreview } from './ProjectPreview'
import { ProjectModal } from './ProjectModal'
import { DemoAccess } from './DemoAccess'
import { Reveal, Stagger, fadeUp } from './ui/Reveal'

function ProjectCard({
  project,
  eager = false,
  onOpenDetails,
}: {
  project: Project
  eager?: boolean
  onOpenDetails: (project: Project) => void
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        aria-label={`Открыть галерею проекта ${project.title}`}
        className="group/shot relative block w-full cursor-zoom-in overflow-hidden"
      >
        <ProjectPreview
          project={project}
          ratio="aspect-[16/10]"
          eager={eager}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover/shot:bg-ink/25">
          <span className="flex scale-90 items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 font-display text-[13px] font-semibold text-ink opacity-0 shadow-soft backdrop-blur transition-all duration-400 group-hover/shot:scale-100 group-hover/shot:opacity-100">
            <Expand size={15} />
            Смотреть галерею
            {project.gallery && project.gallery.length > 1 && (
              <span className="text-muted">{project.gallery.length}</span>
            )}
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip !border-accent/25 !bg-accent-soft !font-semibold !text-accent">
            {project.category}
          </span>
        </div>

        <h3 className="mt-4 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          {project.title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{project.description}</p>

        {project.accounts && <DemoAccess accounts={project.accounts} />}

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-2.5 pt-1 sm:mt-auto sm:flex-row">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary w-full !rounded-2xl !px-5 !py-3.5 !text-sm sm:w-auto"
          >
            Открыть демо
            <ExternalLink size={15} />
          </a>
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="btn btn-outline w-full !rounded-2xl !px-5 !py-3.5 !text-sm sm:w-auto"
          >
            Подробнее
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!activeProject) return

    const prevTitle = document.title
    document.title = `${activeProject.title} — ИИ-администратор для бизнеса | Портфолио`

    const touched: { el: HTMLMetaElement; prev: string | null; created: boolean }[] = []

    const put = (attr: 'name' | 'property', key: string, value: string) => {
      const el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (el) {
        touched.push({ el, prev: el.getAttribute('content'), created: false })
        el.setAttribute('content', value)
      } else {
        const created = document.createElement('meta')
        created.setAttribute(attr, key)
        created.setAttribute('content', value)
        document.head.appendChild(created)
        touched.push({ el: created, prev: null, created: true })
      }
    }

    put('name', 'description', activeProject.description)
    put('property', 'og:title', activeProject.title)
    put('property', 'og:description', activeProject.description)

    return () => {
      document.title = prevTitle
      touched.forEach(({ el, prev, created }) => {
        if (created) el.remove()
        else if (prev === null) el.removeAttribute('content')
        else el.setAttribute('content', prev)
      })
    }
  }, [activeProject])

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Избранные проекты</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
              Реальные продукты, которые можно открыть
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              Каждый проект работает: Web App, CRM, SaaS и AI-консультант с авторизацией и
              живыми данными.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <a href="#demo-notice" className="btn btn-outline !rounded-2xl !text-sm">
              Перед открытием демо
              <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              eager={index < 2}
              onOpenDetails={setActiveProject}
            />
          ))}
        </Stagger>

        <Stagger className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpenDetails={setActiveProject} />
          ))}
        </Stagger>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  )
}

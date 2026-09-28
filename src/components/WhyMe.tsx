import { motion } from 'framer-motion'
import { Bot, Boxes, Compass, Code2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { advantages } from '../data/content'
import { Reveal, Stagger, fadeUp } from './ui/Reveal'

const icons: Record<(typeof advantages)[number]['icon'], LucideIcon> = {
  stack: Code2,
  product: Boxes,
  ux: Compass,
  ai: Bot,
}

export function WhyMe() {
  return (
    <section id="why" className="relative py-24 sm:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Преимущества</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
            Почему выбирают меня
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item) => {
            const Icon = icons[item.icon]
            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="card card-hover group relative overflow-hidden p-7"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-500 group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 font-display text-[18px] font-bold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
              </motion.article>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

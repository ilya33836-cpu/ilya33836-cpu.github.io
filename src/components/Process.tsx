import { motion } from 'framer-motion'
import { processSteps } from '../data/content'
import { Reveal, Stagger, fadeUp } from './ui/Reveal'

export function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Процесс</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
            Процесс работы
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Пять этапов от обсуждения задачи до запуска готового продукта.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block" />

          <Stagger className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                className="relative pl-14 lg:pl-0"
              >
                {index < processSteps.length - 1 && (
                  <span className="absolute left-[21px] top-14 h-[calc(100%+0.4rem)] w-px bg-line lg:hidden" />
                )}
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white font-display text-[15px] font-extrabold text-accent shadow-soft transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-white lg:mb-6">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-[17px] font-bold leading-snug text-ink lg:mt-0 lg:pr-2">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[240px] text-[14px] leading-relaxed text-muted">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

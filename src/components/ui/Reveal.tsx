import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  variants?: Variants
}

export function Reveal({ children, className, delay = 0, variants = fadeUp }: RevealProps) {
  const withDelay: Variants = {
    hidden: variants.hidden,
    show: {
      ...variants.show,
      transition: { ...(variants.show as { transition?: object }).transition, delay },
    },
  }

  return (
    <motion.div
      className={className}
      variants={withDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
}

export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </motion.div>
  )
}

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Footer } from './Footer'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Route-level transition: the outgoing page fades out quickly, the incoming
 * page fades in and settles upward — short, crisp, no bounce.
 */
export function Page({ children, footer = true, solid = false }: { children: ReactNode; footer?: boolean; solid?: boolean }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
      style={{ paddingTop: solid ? 'var(--header-height)' : 0, paddingBottom: 'var(--bottom-bar, 0px)' }}
    >
      {children}
      {footer && <Footer />}
    </motion.main>
  )
}

import { motion, type HTMLMotionProps } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Fades + lifts content in once it scrolls into view. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container + item for grids that cascade in. */
export const staggerParent = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
}
export const staggerChild = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function RevealGroup({ children, className, ...rest }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className, ...rest }: HTMLMotionProps<'div'>) {
  return (
    <motion.div className={className} variants={staggerChild} {...rest}>
      {children}
    </motion.div>
  )
}

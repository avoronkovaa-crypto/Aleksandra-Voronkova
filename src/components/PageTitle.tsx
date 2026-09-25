import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import s from './PageTitle.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  title: string
  count?: number
  size?: 'display' | 'giant'
  children?: ReactNode
}

/** Figma › Categories block › Title (Title + Amount + optional anchor links). */
export function PageTitle({ title, count, size = 'display', children }: Props) {
  return (
    <div className={`${s.heading} ${size === 'giant' ? s.giant : ''}`}>
      <div className={s.titleRow}>
        <h1 className={s.title}>
          {title.split(' ').map((w, i) => (
            <span key={i} className={s.mask}>
              <motion.span
                className={s.word}
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        {count !== undefined && (
          <motion.span
            className={s.count}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
          >
            ({count})
          </motion.span>
        )}
      </div>
      {children}
    </div>
  )
}

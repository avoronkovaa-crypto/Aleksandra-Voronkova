import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import s from './Tabs.module.css'

type Tab = { id: string; label: ReactNode }

/** Figma › Tabs › Horizontal tab (Current yes/no) with a sliding indicator. */
export function Tabs({
  tabs,
  value,
  onChange,
  group,
  tall,
  className,
}: {
  tabs: Tab[]
  value: string
  onChange: (id: string) => void
  group: string
  tall?: boolean
  className?: string
}) {
  return (
    <div className={`${s.tabs} ${tall ? s.tall : ''} ${className ?? ''}`} role="tablist">
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className={`${s.tab} ${value === t.id ? s.current : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {value === t.id && (
            <motion.span layoutId={`tab-${group}`} className={s.indicator} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
          )}
        </button>
      ))}
    </div>
  )
}

import { motion } from 'motion/react'
import s from './AnchorLinks.module.css'

type Item = { id: string; label: string; count?: number }

/** Figma › Anchor link (Desktop) — Default (grey) / Active (black). */
export function AnchorLinks({ items, active, onSelect }: { items: Item[]; active: string; onSelect: (id: string) => void }) {
  return (
    <motion.div
      className={s.row}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
    >
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          className={`${s.link} ${active === it.id ? s.active : ''}`}
          onClick={() => onSelect(it.id)}
        >
          <span className="t-title-4">{it.label}</span>
          {it.count !== undefined && <sup className="t-foot-2">({it.count})</sup>}
        </button>
      ))}
    </motion.div>
  )
}

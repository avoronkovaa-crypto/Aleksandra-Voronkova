import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon'
import s from './Accordion.module.css'

type Item = { id: string; title: string; content: ReactNode }

/** Figma › Dropdowns › Dropdown list (Open no/yes, Desktop). */
export function Accordion({ items, defaultOpen, size = 'md' }: { items: Item[]; defaultOpen?: string; size?: 'md' | 'lg' }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)
  return (
    <div className={`${s.list} ${size === 'lg' ? s.lg : ''}`}>
      {items.map(it => {
        const isOpen = open === it.id
        return (
          <div key={it.id} className={`${s.item} ${isOpen ? s.open : ''}`}>
            <button type="button" className={s.head} onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen}>
              <span className={size === 'lg' ? 't-title-3' : 't-title-4'}>{it.title}</span>
              <motion.span className={s.caret} animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <Icon name="caret-down" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className={s.body}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={s.content}>{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export type Spec = { title: string; value: string; note?: string }

export function SpecGrid({ specs, columns = 2 }: { specs: Spec[]; columns?: 1 | 2 }) {
  return (
    <dl className={s.specs} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {specs.map((sp, i) => (
        <div key={i} className={s.spec}>
          <dt className="t-title-4">{sp.title}</dt>
          <dd className="t-foot-1">
            {sp.value}
            {sp.note && <span className={s.note}>{sp.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export const COMPATIBILITY: Spec[] = [
  { title: 'Motherboard compatibility', value: 'ATX / mATX / Mini ITX' },
  { title: 'Power supply type', value: 'ATX' },
  { title: 'PSU max length', value: '170 mm' },
  { title: 'GPU max length', value: '405 mm with front fan mounted' },
  { title: 'CPU cooler max height', value: '170 mm' },
  { title: 'Front radiator', value: 'Up to 280 mm' },
  { title: 'Top radiator', value: 'Up to 240 mm', note: '(max 46 mm RAM height)' },
  { title: 'Rear radiator', value: '1 x 120 mm' },
  { title: 'Bottom radiator', value: 'N/A' },
  { title: 'Cable routing space', value: '19 mm' },
]

export const SPECIFICATIONS: Spec[] = [
  { title: 'Case type', value: 'Mid tower' },
  { title: 'Material', value: 'Steel, tempered glass, ABS' },
  { title: 'Front fans', value: '3 x Aspect 12 RGB' },
  { title: 'Rear fan', value: '1 x Aspect 12' },
  { title: 'Drive bays', value: '2 x 3.5"/2.5" + 2 x 2.5"' },
  { title: 'Expansion slots', value: '7' },
]

export const DIMENSIONS: Spec[] = [
  { title: 'Case dimensions (L x W x H)', value: '454 x 215 x 474 mm' },
  { title: 'Net weight', value: '7.6 kg' },
  { title: 'Package dimensions', value: '552 x 283 x 520 mm' },
  { title: 'Package weight', value: '9.1 kg' },
]

export const OTHER: Spec[] = [
  { title: 'Front I/O', value: '2 x USB 3.0, 1 x USB-C ready, audio' },
  { title: 'Warranty', value: '2 years' },
]

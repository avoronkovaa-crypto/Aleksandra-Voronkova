import { useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../Icon'
import { ProductCard } from '../ProductCard'
import { PRODUCTS, SEARCH_RESULTS } from '../../data/catalog'
import { panelMotion } from './MegaMenu'
import s from './Search.module.css'

/** Figma › Search bar (Placeholder / Hover / Active / Focused / Filled). */
export function SearchField({
  value,
  onChange,
  onFocusChange,
}: {
  value: string
  onChange: (v: string) => void
  onFocusChange: (f: boolean) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className={s.wrap}>
      <label className={`${s.field} ${value ? s.filled : ''}`}>
        <Icon name="search" className={s.icon} />
        <input
          ref={ref}
          className={`t-foot-1 ${s.input}`}
          placeholder="Search"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          aria-label="Search products"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              className={s.clear}
              aria-label="Clear search"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                onChange('')
                ref.current?.focus()
              }}
            >
              <Icon name="cross" size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </label>
    </div>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const

export function SearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = SEARCH_RESULTS.map(id => PRODUCTS[id])
    const hits = all.filter(p => p.name.toLowerCase().includes(q))
    return { hits, list: hits.length ? hits : all }
  }, [query])

  return (
    <motion.div className={s.panel} {...panelMotion}>
      <div className={s.head}>
        <div className={s.headText}>
          <p className={`t-title-5 ${s.muted}`}>{results.hits.length ? 'Search results for' : 'Nothing found for'}</p>
          <p className="t-title-4">{query}</p>
          {!results.hits.length && <p className={`t-foot-1 ${s.muted} ${s.hint}`}>Popular right now</p>}
        </div>
        <button type="button" className={`t-foot-1 ${s.clearLink}`} onClick={onClear}>
          Clear
        </button>
      </div>
      <div className={s.scroll}>
        <motion.div
          className={s.grid}
          key={results.list.map(p => p.id).join()}
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
        >
          {results.list.map((p, i) => (
            <motion.div
              key={`${p.id}-${i}`}
              variants={{
                initial: { opacity: 0, y: 18 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
              }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon'
import s from './Dropdown.module.css'

type Props = {
  label: string
  options: string[]
  value?: string
  onChange: (v: string) => void
  align?: 'left' | 'right'
  /** `up` opens the list above the trigger (e.g. in a bar pinned to the bottom). */
  direction?: 'down' | 'up'
}

/** Figma › Landing navigation › Dropdowns (Expanded no/yes). */
export function Dropdown({ label, options, value, onChange, align = 'right', direction = 'down' }: Props) {
  const shift = direction === 'up' ? 6 : -6
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} className={s.root}>
      <button type="button" className={`${s.trigger} ${open ? s.open : ''}`} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="t-body-2">{value ?? label}</span>
        <Icon name="caret-down" className={s.caret} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={`${s.list} ${align === 'right' ? s.right : s.left} ${direction === 'up' ? s.up : ''}`}
            initial={{ opacity: 0, y: shift, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shift, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map(o => (
              <li key={o}>
                <button
                  type="button"
                  className={`t-foot-1 ${s.option} ${o === value ? s.selected : ''}`}
                  onClick={() => {
                    onChange(o)
                    setOpen(false)
                  }}
                >
                  {o}
                  {o === value && <Icon name="check" size={16} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

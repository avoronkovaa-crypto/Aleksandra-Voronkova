import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../Icon'
import { Img } from '../Img'
import { FLAGS } from '../../lib/assets'
import s from './LanguageSwitch.module.css'

const LANGS = Object.keys(FLAGS) as (keyof typeof FLAGS)[]

/** Figma › Dropdowns › flag drop down (Default / Expanded) + En (Default / Hover). */
export function LanguageSwitch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<keyof typeof FLAGS>('EN')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} className={`${s.root} ${className ?? ''}`}>
      <button
        type="button"
        className={s.trigger}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={s.flag}>
          <Img src={FLAGS[lang]} eager />
        </span>
        <span className="t-foot-2">{lang}</span>
        <Icon name="caret-down" size={16} className={`${s.caret} ${open ? s.caretOpen : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={s.list}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {LANGS.map(l => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === lang}
                  className={`${s.option} ${l === lang ? s.selected : ''}`}
                  onClick={() => {
                    setLang(l)
                    setOpen(false)
                  }}
                >
                  <span className={s.flag}>
                    <Img src={FLAGS[l]} eager />
                  </span>
                  <span className="t-foot-2">{l}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

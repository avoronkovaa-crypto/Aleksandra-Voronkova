import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../Icon'
import { useStore } from '../../state/store'
import s from './PromoCode.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Figma › Cart and Checkout › dropdown promocode (Opened no/yes) +
 * Input field promocode (Placeholder / Focused / Filled / Destructive).
 */
export function PromoCode({ className }: { className?: string }) {
  const { state, dispatch } = useStore()
  const { promo } = state
  const [open, setOpen] = useState(promo.status !== 'idle')
  const [value, setValue] = useState(promo.code)

  useEffect(() => setValue(promo.code), [promo.code])

  const status = promo.status === 'error' && value !== promo.code ? 'idle' : promo.status
  const submit = () => value.trim() && dispatch({ type: 'promo', code: value })

  return (
    <div className={`${s.root} ${className ?? ''}`}>
      <button type="button" className={s.head} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className={s.label}>
          <Icon name="gift" />
          <span className="t-body-1">Promocode</span>
        </span>
        <span className={s.toggle} aria-hidden>
          <motion.span className={s.bar} />
          <motion.span className={s.bar} animate={{ rotate: open ? 0 : 90 }} transition={{ duration: 0.3, ease: EASE }} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={s.body}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <form
              className={s.form}
              onSubmit={e => {
                e.preventDefault()
                submit()
              }}
            >
              <div className={`${s.input} ${status === 'applied' ? s.applied : ''} ${status === 'error' ? s.error : ''}`}>
                <input
                  className="t-body-1"
                  placeholder="Enter promocode"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  readOnly={status === 'applied'}
                  aria-label="Promocode"
                  autoFocus={promo.status === 'idle'}
                />
                <AnimatePresence>
                  {value.trim() && status !== 'applied' && (
                    <motion.button
                      type="submit"
                      className={s.go}
                      aria-label="Apply promocode"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.2, ease: EASE }}
                    >
                      <Icon name="arrow-right" />
                    </motion.button>
                  )}
                </AnimatePresence>
                {status === 'applied' && (
                  <span className={s.go} aria-hidden>
                    <Icon name="arrow-right" />
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {status === 'applied' && (
                  <motion.div key="ok" className={s.message} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <span className={`t-foot-1 ${s.success}`}>
                      <Icon name="circle-check" size={16} />
                      <strong className="t-foot-2">{promo.code.toUpperCase()}</strong> applied
                    </span>
                    <button
                      type="button"
                      className={`t-foot-1 ${s.remove}`}
                      onClick={() => {
                        dispatch({ type: 'promo-clear' })
                        setValue('')
                      }}
                    >
                      Remove
                    </button>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div key="err" className={s.message} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0, x: [0, -4, 4, -2, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <span className={`t-foot-1 ${s.errorText}`}>
                      <Icon name="circle-warning" size={16} />
                      This promocode doesn’t exist. Try FRACTAL
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

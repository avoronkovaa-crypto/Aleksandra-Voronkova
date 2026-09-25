import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../Icon'
import s from './Field.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string | null
  /** Show the green check once the field is valid (Figma: Filled, Trailing icon = yes). */
  valid?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  hint?: string
  options?: string[]
}

/**
 * Figma › Input field (Default / Phone number / Payment input) with
 * Placeholder, Focused, Filled and Destructive states.
 */
export function Field({ label, value, onChange, error, valid, leading, trailing, hint, options, className, onBlur, ...rest }: FieldProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const showError = !!error
  const select = !!options

  return (
    <div className={`${s.field} ${className ?? ''}`}>
      <label htmlFor={id} className="t-foot-2">
        {label}
      </label>
      <div className={`${s.control} ${showError ? s.error : ''} ${valid && !showError ? s.valid : ''}`}>
        {leading}
        <input
          id={id}
          className={`t-body-1 ${s.input}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={select}
          onClick={() => select && setOpen(o => !o)}
          onBlur={e => {
            onBlur?.(e)
            window.setTimeout(() => setOpen(false), 120)
          }}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-err` : undefined}
          {...rest}
        />
        <AnimatePresence>
          {valid && !showError && (
            <motion.span
              key="ok"
              className={s.trailing}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            >
              <Icon name="circle-check" />
            </motion.span>
          )}
        </AnimatePresence>
        {select && (
          <span className={`${s.trailing} ${s.caret} ${open ? s.caretOpen : ''}`}>
            <Icon name="caret-down" />
          </span>
        )}
        {trailing}
        <AnimatePresence>
          {select && open && (
            <motion.ul
              className={s.menu}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              {options!.map(o => (
                <li key={o}>
                  <button
                    type="button"
                    className={`t-body-1 ${s.option} ${o === value ? s.optionOn : ''}`}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      onChange(o)
                      setOpen(false)
                    }}
                  >
                    {o}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {(showError || hint) && (
          <motion.p
            key={showError ? 'err' : 'hint'}
            id={`${id}-err`}
            className={`t-foot-1 ${showError ? s.errorText : s.hint}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {showError ? error : hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Country code dropdown used inside the phone field. */
export function PhonePrefix({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const codes = ['SE', 'US', 'DE', 'NO', 'DK']
  return (
    <div className={s.prefix}>
      <button type="button" className={`t-body-1 ${s.prefixBtn}`} onClick={() => setOpen(o => !o)} onBlur={() => window.setTimeout(() => setOpen(false), 120)}>
        {value}
        <Icon name="caret-down" className={`${s.caret} ${open ? s.caretOpen : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={`${s.menu} ${s.prefixMenu}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            {codes.map(c => (
              <li key={c}>
                <button
                  type="button"
                  className={`t-body-1 ${s.option} ${c === value ? s.optionOn : ''}`}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    onChange(c)
                    setOpen(false)
                  }}
                >
                  {c}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Radio + checkbox (Figma › Checkbox and Radiobutton)                  */
/* ------------------------------------------------------------------ */
export function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span className={`${s.radio} ${checked ? s.radioOn : ''}`} aria-hidden>
      <motion.span className={s.radioDot} initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ type: 'spring', stiffness: 600, damping: 30 }} />
    </span>
  )
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className={s.checkRow}>
      <input type="checkbox" className="visually-hidden" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className={`${s.check} ${checked ? s.checkOn : ''}`} aria-hidden>
        <motion.svg viewBox="0 0 16 16" width="14" height="14" initial={false} animate={{ opacity: checked ? 1 : 0 }}>
          <motion.path
            d="M12 5L6.5 10.5L4 8"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          />
        </motion.svg>
      </span>
      <span className="t-body-2">{children}</span>
    </label>
  )
}

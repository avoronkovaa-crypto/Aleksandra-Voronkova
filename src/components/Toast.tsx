import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './Icon'
import s from './Toast.module.css'

type ToastCtx = (message: string) => void
const Ctx = createContext<ToastCtx>(() => {})

/** Lightweight toast for prototype hints (e.g. screens that aren't designed yet). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current)
    setMsg({ id: Date.now(), text })
    timer.current = window.setTimeout(() => setMsg(null), 2600)
  }, [])
  return (
    <Ctx.Provider value={show}>
      {children}
      <div className={s.host} aria-live="polite">
        <AnimatePresence>
          {msg && (
            <motion.div
              key={msg.id}
              className={s.toast}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon name="arrow-up-right" size={16} />
              <span className="t-foot-1">{msg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)

export const NOT_IN_PROTOTYPE = 'Not designed in this prototype yet — explore the Pop series flow.'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../state/store'
import { Icon } from './Icon'
import s from './PrototypeNav.module.css'

const SCREENS = [
  { to: '/', label: 'All Categories' },
  { to: '/cases', label: 'Cases' },
  { to: '/pop-series', label: 'Pop Series' },
  { to: '/cases/pop-air', label: 'Cases Pop Air' },
  { to: '/pop-air', label: 'Pop Air — landing' },
  { to: '/product/pop-air', label: 'Product page' },
  { to: '/checkout/delivery', label: 'Checkout — Delivery' },
  { to: '/checkout/payment', label: 'Checkout — Payment' },
]

/** Floating jump-menu for reviewers — not part of the Figma design. */
export function PrototypeNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { dispatch } = useStore()
  return (
    <div className={s.root}>
      <AnimatePresence>
        {open && (
          <motion.nav
            className={s.panel}
            aria-label="Prototype screens"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`t-micro ${s.caption}`}>PROTOTYPE SCREENS</p>
            {SCREENS.map(x => (
              <Link key={x.to} to={x.to} className={`t-foot-1 ${s.link} ${pathname === x.to ? s.active : ''}`} onClick={() => setOpen(false)}>
                {x.label}
              </Link>
            ))}
            <button
              type="button"
              className={`t-foot-1 ${s.link} ${s.muted}`}
              onClick={() => {
                dispatch({ type: 'open', open: true })
                setOpen(false)
              }}
            >
              Open cart
            </button>
            <button
              type="button"
              className={`t-foot-1 ${s.link} ${s.muted}`}
              onClick={() => {
                dispatch({ type: 'reset' })
                setOpen(false)
              }}
            >
              Reset cart & checkout
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
      <button type="button" className={`t-foot-1 ${s.fab}`} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <Icon name={open ? 'cross' : 'burger'} size={16} />
        Prototype screens
      </button>
    </div>
  )
}

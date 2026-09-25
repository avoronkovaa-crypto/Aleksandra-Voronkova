import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore, totals } from '../../state/store'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { CartLine } from './CartLine'
import { PromoCode } from './PromoCode'
import { PriceSummary, DeliveryBadge } from './PriceSummary'
import s from './CartDrawer.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** Figma › Cart_Desktop › Cart (empty = no / yes). */
export function CartDrawer() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const open = state.cartOpen
  const { count } = totals(state)
  const close = () => dispatch({ type: 'open', open: false })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className={s.scrim}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
          <motion.aside
            key="panel"
            className={s.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.55, ease: EASE } }}
            exit={{ x: '100%', transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }}
          >
            <button type="button" className={s.close} onClick={close} aria-label="Close cart">
              <Icon name="cross" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {state.items.length === 0 ? (
                <motion.div
                  key="empty"
                  className={s.empty}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <motion.span
                    className={s.emptyIcon}
                    initial={{ scale: 0.6, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  >
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden>
                      <path d="M45.2903 16.7745H8.38643C7.46 16.7745 6.70898 17.4504 6.70898 18.2842V45.4588C6.70898 46.2926 7.46 46.9685 8.38643 46.9685H45.2903C46.2167 46.9685 46.9677 46.2926 46.9677 45.4588V18.2842C46.9677 17.4504 46.2167 16.7745 45.2903 16.7745Z" stroke="#3578E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.4521 15.097C18.4521 12.8726 19.3357 10.7393 20.9087 9.16636C22.4816 7.59344 24.6149 6.70979 26.8393 6.70979C29.0638 6.70979 31.1971 7.59345 32.77 9.16636C34.3429 10.7393 35.2266 12.8726 35.2266 15.097" stroke="#3578E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M23.3499 37.5748C24.4235 35.9645 26.3023 35.9645 26.839 35.9645C27.3758 35.9645 29.2546 35.9645 30.3281 37.5748" stroke="#3578E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="17.7135" cy="30.0599" r="2.14713" fill="#3578E7" />
                      <circle cx="35.9635" cy="30.0599" r="2.14713" fill="#3578E7" />
                    </svg>
                  </motion.span>
                  <p className="t-title-3">Your cart is empty</p>
                  <p className="t-body-1">Looks like you haven’t added anything yet...</p>
                  <Button variant="tertiary" size="md" onClick={close}>
                    Continue shopping
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="full" className={s.full} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className={s.scroll}>
                    <div className={s.head}>
                      <h2 className={s.title}>
                        <span className="t-title-3">Cart</span>
                        <sup className="t-foot-2">({count})</sup>
                      </h2>
                      <DeliveryBadge />
                    </div>

                    <motion.ul className={s.items} layout>
                      <AnimatePresence initial={false}>
                        {state.items.map((item, i) => (
                          <motion.li
                            key={item.key}
                            layout
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE, delay: 0.15 + i * 0.05 } }}
                            exit={{ opacity: 0, x: 60, height: 0, transition: { duration: 0.35, ease: EASE } }}
                          >
                            <CartLine item={item} />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </motion.ul>

                    <PromoCode className={s.promo} />
                  </div>

                  <div className={s.footer}>
                    <PriceSummary />
                    <Button
                      block
                      onClick={() => {
                        close()
                        navigate('/checkout/delivery')
                      }}
                    >
                      Process order
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

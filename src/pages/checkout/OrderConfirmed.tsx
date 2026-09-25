import { motion } from 'motion/react'
import { Page } from '../../components/Page'
import { ButtonLink } from '../../components/Button'
import { formatKr } from '../../data/catalog'
import { useStore } from '../../state/store'
import s from './OrderConfirmed.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** End of the checkout flow (not in Figma — kept in the same visual language). */
export function OrderConfirmed() {
  const { state } = useStore()
  const order = state.lastOrder
  return (
    <Page solid>
      <div className={s.wrap}>
        <motion.svg width="96" height="96" viewBox="0 0 96 96" className={s.mark} initial="hidden" animate="shown">
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#027A48"
            strokeWidth="2.5"
            variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 0.7, ease: EASE } } }}
          />
          <motion.path
            d="M31 49.5L43 61L66 37"
            fill="none"
            stroke="#027A48"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 0.45, ease: EASE, delay: 0.55 } } }}
          />
        </motion.svg>
        <motion.div className={s.text} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}>
          <h1 className="t-title-2">Thank you{state.address?.name ? `, ${state.address.name}` : ''}!</h1>
          <p className="t-body-1">
            Your order {order ? <strong>{order.id}</strong> : null} is confirmed
            {order ? <> — {formatKr(order.total)} charged.</> : '.'} We’ll email you as soon as it ships.
          </p>
          <ButtonLink to="/" variant="secondary" size="lg">
            Continue shopping
          </ButtonLink>
        </motion.div>
      </div>
    </Page>
  )
}

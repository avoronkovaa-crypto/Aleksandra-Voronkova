import { AnimatePresence, motion } from 'motion/react'
import { formatKr } from '../../data/catalog'
import { useStore, totals } from '../../state/store'
import { Icon } from '../Icon'
import s from './PriceSummary.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

function Row({ label, value, note, big }: { label: string; value: string; note?: string; big?: boolean }) {
  return (
    <motion.div
      layout
      className={s.row}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <span className={s.label}>
        <span className={big ? 't-title-5' : 't-body-2'}>{label}</span>
        {note && <span className="t-foot-1 t-secondary">{note}</span>}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="t-body-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}

/** Figma › Cart and Checkout › Price type rows (Subtotal / Delivery / Promocode / Total). */
export function PriceSummary({ deliveryPrice, showDelivery = true }: { deliveryPrice?: number; showDelivery?: boolean }) {
  const { state } = useStore()
  const t = totals(state, deliveryPrice)
  const single = state.items.length === 1 && state.items[0].qty > 1 ? state.items[0] : null

  return (
    <div className={s.summary}>
      <div className={s.rows}>
        <AnimatePresence initial={false}>
          <Row key="sub" label="Subtotal" value={formatKr(t.subtotal)} note={single ? `${formatKr(single.price)} x${single.qty}` : undefined} />
          {showDelivery && <Row key="del" label="Delivery" value={t.delivery === 0 ? 'Free' : formatKr(t.delivery)} />}
          {t.discount > 0 && <Row key="promo" label="Promocode" value={formatKr(-t.discount)} />}
        </AnimatePresence>
      </div>
      <div className={s.total}>
        <span className={s.label}>
          <span className="t-title-5">Total</span>
          <span className="t-foot-1 t-secondary">(Moms)</span>
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={t.total}
            className="t-body-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
          >
            {formatKr(t.total)}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Figma › Cart and Checkout › Badges (Warning / Success). */
export function DeliveryBadge() {
  const { state } = useStore()
  const t = totals(state)
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={t.freeShipping ? 'free' : 'warn'}
        className={`${s.badge} ${t.freeShipping ? s.success : s.warning}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <Icon name="delivery" />
        {t.freeShipping ? (
          <span className="t-foot-1">Free standard delivery</span>
        ) : (
          <span className="t-foot-1">
            You need to spend <strong className="t-foot-2">{formatKr(t.remaining)}</strong> more to get your free delivery
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'motion/react'
import type { CartItem } from '../../state/store'
import { useStore } from '../../state/store'
import { formatKr } from '../../data/catalog'
import { Img } from '../Img'
import { Icon } from '../Icon'
import s from './CartLine.module.css'

/** Figma › Cart and Checkout › Image + Info (Editable yes/no) + quantity indicator. */
export function CartLine({ item, editable = true }: { item: CartItem; editable?: boolean }) {
  const { dispatch } = useStore()
  return (
    <div className={s.line}>
      <div className={s.thumb}>
        <Img src={item.image} fit="contain" />
      </div>
      <div className={s.info}>
        <div className={s.top}>
          <div className={s.text}>
            <p className="t-title-5">{item.name}</p>
            <p className="t-body-1">{item.variant}</p>
            {!editable && <p className="t-body-1">x{item.qty}</p>}
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={item.qty}
              className="t-body-1"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              {formatKr(item.price * item.qty)}
            </motion.p>
          </AnimatePresence>
        </div>
        {editable && (
          <div className={s.bottom}>
            <div className={s.qtyRow}>
              <div className={s.qty}>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={item.qty <= 1}
                  onClick={() => dispatch({ type: 'qty', key: item.key, qty: item.qty - 1 })}
                >
                  <Icon name="minus" size={16} />
                </button>
                <span className="t-body-1">{item.qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => dispatch({ type: 'qty', key: item.key, qty: item.qty + 1 })}>
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <AnimatePresence>
                {item.qty > 1 && (
                  <motion.span
                    className={`t-foot-1 ${s.unit}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    x {formatKr(item.price)}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <button type="button" className={s.trash} aria-label={`Remove ${item.name}`} onClick={() => dispatch({ type: 'remove', key: item.key })}>
              <Icon name="trash" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

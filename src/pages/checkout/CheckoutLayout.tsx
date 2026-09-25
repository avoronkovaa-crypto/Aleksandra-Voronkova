import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Page } from '../../components/Page'
import { Icon } from '../../components/Icon'
import { ButtonLink } from '../../components/Button'
import { CartLine } from '../../components/cart/CartLine'
import { PromoCode } from '../../components/cart/PromoCode'
import { useStore } from '../../state/store'
import s from './Checkout.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  step: 'delivery' | 'payment'
  children: ReactNode
  summaryExtra?: ReactNode
  summaryFooter: ReactNode
  onEdit?: () => void
}

/** Shared two-column checkout shell (Figma › Cart_Delivery_* / Cart_Payment_*). */
export function CheckoutLayout({ step, children, summaryExtra, summaryFooter, onEdit }: Props) {
  const { state } = useStore()

  if (state.items.length === 0) {
    return (
      <Page solid footer={false}>
        <div className={s.emptyPage}>
          <p className="t-title-3">Your cart is empty</p>
          <p className="t-body-1 t-secondary">Add a product to start the checkout.</p>
          <ButtonLink to="/product/pop-air" variant="secondary" size="md">
            Shop Pop Air
          </ButtonLink>
        </div>
      </Page>
    )
  }

  return (
    <Page solid footer={false}>
      <div className={s.layout}>
        <section className={s.main}>
          {step === 'payment' && (
            <Link to="/checkout/delivery" className={`t-foot-1 ${s.back}`}>
              <Icon name="arrow-left" size={16} />
              Go back to Delivery
            </Link>
          )}
          <h1 className={`t-title-3 ${s.steps}`}>
            <motion.span animate={{ color: step === 'delivery' ? '#131313' : '#b2b2b2' }} transition={{ duration: 0.4 }}>
              {step === 'payment' ? <Link to="/checkout/delivery">Delivery</Link> : 'Delivery'}
            </motion.span>{' '}
            /{' '}
            <motion.span animate={{ color: step === 'payment' ? '#131313' : '#b2b2b2' }} transition={{ duration: 0.4 }}>
              Payment
            </motion.span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
            {children}
          </motion.div>
        </section>

        <aside className={s.summary}>
          <div className={s.summaryHead}>
            <h2 className="t-title-3">Summary</h2>
            {onEdit && (
              <button type="button" className={`t-foot-1 ${s.edit}`} onClick={onEdit}>
                edit
              </button>
            )}
          </div>
          <div className={s.lines}>
            {state.items.map(i => (
              <CartLine key={i.key} item={i} editable={false} />
            ))}
          </div>
          <PromoCode className={s.promo} />
          {summaryExtra}
          <div className={s.summaryFooter}>{summaryFooter}</div>
        </aside>
      </div>
    </Page>
  )
}

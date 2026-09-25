import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CheckoutLayout } from './CheckoutLayout'
import { Field, RadioMark, Checkbox } from '../../components/form/Field'
import { Icon } from '../../components/Icon'
import { Button } from '../../components/Button'
import { PriceSummary } from '../../components/cart/PriceSummary'
import { DELIVERY_METHODS, PAYMENT_METHODS, SAVED_CARDS } from '../../data/catalog'
import { useStore } from '../../state/store'
import { useForm, required, cardNumber, cvv, expiry, formatCard, formatExpiry, type Validator } from '../../lib/useForm'
import mastercard from '../../assets/brands/mastercard.svg'
import visa from '../../assets/brands/visa.svg'
import applepay from '../../assets/brands/applepay.svg'
import klarna from '../../assets/brands/klarna.svg'
import s from './Checkout.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const LOGOS: Record<string, string> = { mastercard, visa, applepay, klarna }

type Key = 'nameOnCard' | 'number' | 'cvv' | 'expiry'
const RULES: Partial<Record<Key, Validator>> = { nameOnCard: required, number: cardNumber, cvv, expiry }

/** Figma › Cart_Payment Default / Chosen card / Focused / Error / Filled / Existing Payment (+ Added). */
export function Payment() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [method, setMethod] = useState(state.paymentMethod ?? 'mastercard')
  const [savedCard, setSavedCard] = useState<string | null>(null)
  const [cards, setCards] = useState(SAVED_CARDS)
  const [saveCard, setSaveCard] = useState(false)
  const [recapOpen, setRecapOpen] = useState(true)
  const [paying, setPaying] = useState(false)

  const form = useForm<Key>({ nameOnCard: '', number: '', cvv: '', expiry: '' }, RULES)
  const cardMethod = method === 'mastercard' || method === 'visa'
  const canPay = !cardMethod || !!savedCard || form.isValid
  const delivery = DELIVERY_METHODS.find(m => m.id === state.deliveryMethod)
  const ad = state.address

  const pay = () => {
    form.submit()
    if (!canPay) {
      window.setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      return
    }
    dispatch({ type: 'payment-method', id: method })
    setPaying(true)
    window.setTimeout(() => {
      dispatch({ type: 'place-order' })
      navigate('/checkout/confirmed')
    }, 1400)
  }

  return (
    <CheckoutLayout
      step="payment"
      summaryExtra={
        ad && (
          <div className={s.recap}>
            <button type="button" className={s.recapHead} onClick={() => setRecapOpen(o => !o)} aria-expanded={recapOpen}>
              <span className="t-body-1">Delivery details</span>
              <Icon name={recapOpen ? 'minus' : 'plus'} />
            </button>
            <AnimatePresence initial={false}>
              {recapOpen && (
                <motion.div
                  className={s.recapBody}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className={`t-body-1 ${s.recapInner}`}>
                    <p className="t-title-5">
                      {ad.name} {ad.surname}
                    </p>
                    <span>{ad.email}</span>
                    <span>
                      {ad.phoneCountry === 'SE' ? '+46' : ad.phoneCountry === 'US' ? '+1' : '+'} {ad.phone}
                    </span>
                    <span>{ad.address}</span>
                    <span>
                      {ad.postcode}, {ad.province}
                    </span>
                    <span>{ad.city}</span>
                    <span>{ad.country}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      }
      summaryFooter={
        <>
          <PriceSummary deliveryPrice={delivery?.price} showDelivery={!!delivery} />
          <Button block onClick={pay} className={canPay ? '' : s.softDisabled} aria-disabled={!canPay} disabled={paying}>
            {paying ? <span className={s.spinner} aria-label="Processing payment" /> : 'Pay'}
          </Button>
        </>
      }
    >
      <div className={s.methods} role="radiogroup" aria-label="Payment method">
        {PAYMENT_METHODS.map(m => (
          <div
            key={m.id}
            role="radio"
            aria-checked={method === m.id}
            tabIndex={0}
            className={`${s.method} ${s.payMethod} radio-host`}
            onClick={() => setMethod(m.id)}
            onKeyDown={e => e.key === 'Enter' && setMethod(m.id)}
          >
            <RadioMark checked={method === m.id} />
            <img className={s.payLogo} src={LOGOS[m.id]} alt="" />
            <span className="t-body-1">{m.title}</span>
          </div>
        ))}
      </div>

      <div className={s.details}>
        <p className={`t-body-2 ${s.detailsTitle}`}>Payment details</p>
        <AnimatePresence mode="wait" initial={false}>
          {cardMethod ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {cards.length > 0 && (
                <>
                  <div className={s.saved} role="radiogroup" aria-label="Saved cards">
                    <AnimatePresence initial={false}>
                      {cards.map(c => (
                        <motion.div
                          key={c.id}
                          layout
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <div
                            role="radio"
                            aria-checked={savedCard === c.id}
                            tabIndex={0}
                            className={`${s.savedCard} ${savedCard === c.id ? s.savedOn : ''} radio-host`}
                            onClick={() => setSavedCard(savedCard === c.id ? null : c.id)}
                            onKeyDown={e => e.key === 'Enter' && setSavedCard(c.id)}
                          >
                            <div className={s.savedMain} style={{ alignItems: 'center' }}>
                              <RadioMark checked={savedCard === c.id} />
                              <div className={s.savedText}>
                                <span className="t-body-2">{c.title}</span>
                                <span className="t-foot-1">Expiry {c.expiry}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={s.savedTrash}
                              aria-label="Delete card"
                              onClick={e => {
                                e.stopPropagation()
                                setCards(list => list.filter(x => x.id !== c.id))
                                if (savedCard === c.id) setSavedCard(null)
                              }}
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className={`t-foot-1 ${s.orNew}`}>or pay with a new card</p>
                </>
              )}

              <motion.div animate={{ opacity: savedCard ? 0.4 : 1 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 16, pointerEvents: savedCard ? 'none' : 'auto' }}>
                <Field label="Name on card" placeholder="Your Name and Surname" autoComplete="cc-name" {...form.bind('nameOnCard')} error={savedCard ? null : form.bind('nameOnCard').error} />
                <Field
                  label="Card number"
                  placeholder="1234 1234 1234 1234"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  leading={<img className={s.payLogo} style={{ width: 34, height: 24 }} src={LOGOS[method]} alt="" />}
                  {...form.bind('number')}
                  onChange={v => form.bind('number').onChange(formatCard(v))}
                  error={savedCard ? null : form.bind('number').error}
                />
                <div className={s.grid2}>
                  <Field
                    label="CVV"
                    placeholder="•••"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="cc-csc"
                    {...form.bind('cvv')}
                    onChange={v => form.bind('cvv').onChange(v.replace(/\D/g, '').slice(0, 4))}
                    error={savedCard ? null : form.bind('cvv').error}
                  />
                  <Field
                    label="Expiry"
                    placeholder="06 / 2027"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    {...form.bind('expiry')}
                    onChange={v => form.bind('expiry').onChange(formatExpiry(v))}
                    error={savedCard ? null : form.bind('expiry').error}
                  />
                </div>
                <div className={s.saveRow}>
                  <Checkbox checked={saveCard} onChange={setSaveCard}>
                    Save my payment method for future orders
                  </Checkbox>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="redirect"
              className={s.redirect}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <img className={s.payLogo} src={LOGOS[method]} alt="" />
              <p className="t-body-1">
                You’ll confirm the payment with {method === 'klarna' ? 'Klarna' : 'Apple Pay'} after pressing <strong>Pay</strong>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CheckoutLayout>
  )
}

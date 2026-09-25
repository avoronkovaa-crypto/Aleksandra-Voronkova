import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CheckoutLayout } from './CheckoutLayout'
import { Field, PhonePrefix, RadioMark, Checkbox } from '../../components/form/Field'
import { Icon } from '../../components/Icon'
import { Button } from '../../components/Button'
import { PriceSummary } from '../../components/cart/PriceSummary'
import { DELIVERY_METHODS, SAVED_ADDRESSES, formatKr } from '../../data/catalog'
import { useStore } from '../../state/store'
import { useForm, required, email, phone, postcode, type Validator } from '../../lib/useForm'
import postnord from '../../assets/brands/postnord.svg'
import s from './Checkout.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

type Key = 'name' | 'surname' | 'email' | 'phone' | 'address' | 'postcode' | 'province' | 'city' | 'country'
const RULES: Partial<Record<Key, Validator>> = {
  name: required,
  surname: required,
  email,
  phone,
  address: required,
  postcode,
  province: required,
  city: required,
  country: required,
}
const PROVINCES = ['Västra Götaland', 'Stockholm', 'Skåne', 'Uppsala', 'Halland']
const COUNTRIES = ['Sweden', 'Norway', 'Denmark', 'Finland', 'Germany']

/** Figma › Cart_Delivery_Default / Chosen / Focused / Error / Filled / Existing (+ Added). */
export function Delivery() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [method, setMethod] = useState<string | null>(state.deliveryMethod)
  const [saved, setSaved] = useState<string | null>(null)
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES)
  const [saveAddress, setSaveAddress] = useState(false)
  const [tip, setTip] = useState(false)
  const [methodError, setMethodError] = useState(false)
  const [phoneCountry, setPhoneCountry] = useState(state.address?.phoneCountry ?? 'SE')

  const a = state.address
  const form = useForm<Key>(
    {
      name: a?.name ?? '',
      surname: a?.surname ?? '',
      email: a?.email ?? '',
      phone: a?.phone ?? '',
      address: a?.address ?? '',
      postcode: a?.postcode ?? '',
      province: a?.province ?? '',
      city: a?.city ?? '',
      country: a?.country ?? '',
    },
    RULES,
  )

  const chosen = DELIVERY_METHODS.find(m => m.id === method)
  const canContinue = !!method && form.isValid

  const pickSaved = (id: string) => {
    const ad = addresses.find(x => x.id === id)!
    setSaved(id)
    form.setValues(v => ({
      ...v,
      name: v.name || 'Aleksandra',
      surname: v.surname || 'Voronkova',
      email: v.email || 'a.voronkovaa@gmail.com',
      phone: v.phone || '(734) 000-0000',
      address: ad.line,
      postcode: ad.zip.replace(/^(\d{3})(\d+)/, '$1 $2'),
      province: 'Västra Götaland',
      city: ad.city,
      country: 'Sweden',
    }))
  }

  const onContinue = () => {
    form.submit()
    if (!method) setMethodError(true)
    if (!canContinue) {
      window.setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      return
    }
    dispatch({ type: 'delivery-method', id: method! })
    dispatch({ type: 'address', address: { ...form.values, phoneCountry } })
    navigate('/checkout/payment')
  }

  return (
    <CheckoutLayout
      step="delivery"
      onEdit={() => dispatch({ type: 'open', open: true })}
      summaryFooter={
        <>
          <PriceSummary deliveryPrice={chosen?.price} showDelivery={!!chosen} />
          <Button block onClick={onContinue} className={canContinue ? '' : s.softDisabled} aria-disabled={!canContinue}>
            Continue
          </Button>
        </>
      }
    >
      <div className={s.methods} role="radiogroup" aria-label="Delivery method">
        {DELIVERY_METHODS.map(m => (
          <div
            key={m.id}
            role="radio"
            aria-checked={method === m.id}
            tabIndex={0}
            className={`${s.method} radio-host`}
            onClick={() => {
              setMethod(m.id)
              setMethodError(false)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setMethod(m.id)
                setMethodError(false)
              }
            }}
          >
            <RadioMark checked={method === m.id} />
            <div className={s.methodBody}>
              <div className={s.methodText}>
                <span className={`t-body-1 ${s.methodTitle}`}>
                  {m.title}
                  {'carrier' in m && <img src={postnord} alt="PostNord" width={44} height={20} />}
                  {'info' in m && (
                    <span className={s.info} onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                      <Icon name="question" size={16} />
                      <AnimatePresence>
                        {tip && (
                          <motion.span
                            className={`t-foot-1 ${s.tooltip}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.18 }}
                          >
                            Choose one of 1 800+ pick-up points near you after payment.
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  )}
                </span>
                <span className={`t-body-1 ${s.methodNote}`}>{m.note}</span>
              </div>
              <span className="t-body-1" style={{ fontWeight: 500 }}>
                {formatKr(m.price)}
              </span>
            </div>
          </div>
        ))}
        <AnimatePresence>
          {methodError && (
            <motion.p
              className={`t-foot-1 ${s.methodError}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', x: [0, -4, 4, -2, 0] }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              Choose a delivery method to continue
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {method && (
          <motion.div
            key="details"
            className={s.detailsWrap}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className={s.details}>
              <p className={`t-body-2 ${s.detailsTitle}`}>Delivery details</p>

              {addresses.length > 0 && (
                <>
                  <div className={s.saved} role="radiogroup" aria-label="Saved addresses">
                    <AnimatePresence initial={false}>
                      {addresses.map(ad => (
                        <motion.div
                          key={ad.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginTop: -8 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <div
                            role="radio"
                            aria-checked={saved === ad.id}
                            tabIndex={0}
                            className={`${s.savedCard} ${saved === ad.id ? s.savedOn : ''} radio-host`}
                            onClick={() => pickSaved(ad.id)}
                            onKeyDown={e => e.key === 'Enter' && pickSaved(ad.id)}
                          >
                            <div className={s.savedMain}>
                              <RadioMark checked={saved === ad.id} />
                              <div className={s.savedText}>
                                <span className="t-body-2">{ad.line}</span>
                                <span className="t-foot-1">
                                  {ad.city}
                                  <br />
                                  {ad.region}
                                  <br />
                                  {ad.zip}
                                  <br />
                                  {ad.country}
                                  <br />
                                  {ad.phone}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={s.savedTrash}
                              aria-label="Delete address"
                              onClick={e => {
                                e.stopPropagation()
                                setAddresses(list => list.filter(x => x.id !== ad.id))
                                if (saved === ad.id) setSaved(null)
                              }}
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className={`t-foot-1 ${s.orNew}`}>or add a new address</p>
                </>
              )}

              <div className={s.grid2}>
                <Field label="Name" placeholder="Your name" autoComplete="given-name" {...form.bind('name')} />
                <Field label="Surname" placeholder="Your surname" autoComplete="family-name" {...form.bind('surname')} />
              </div>
              <Field label="Email" type="email" placeholder="Your email" autoComplete="email" {...form.bind('email')} />
              <Field
                label="Phone number"
                type="tel"
                placeholder="(555) 000-0000"
                autoComplete="tel-national"
                leading={<PhonePrefix value={phoneCountry} onChange={setPhoneCountry} />}
                {...form.bind('phone')}
              />
              <Field label="Address" placeholder="Your address" autoComplete="street-address" {...form.bind('address')} />
              <div className={s.grid2}>
                <Field label="Postcode" placeholder="Your postcode" autoComplete="postal-code" {...form.bind('postcode')} />
                <Field label="Province" placeholder="Your province" options={PROVINCES} {...form.bind('province')} />
              </div>
              <div className={s.grid2}>
                <Field label="City" placeholder="Your city" autoComplete="address-level2" {...form.bind('city')} />
                <Field label="Country" placeholder="Your country" options={COUNTRIES} {...form.bind('country')} />
              </div>
              <div className={s.saveRow}>
                <Checkbox checked={saveAddress} onChange={setSaveAddress}>
                  Save my address for future orders
                </Checkbox>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CheckoutLayout>
  )
}

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { FREE_SHIPPING_FROM, PROMO_CODES } from '../data/catalog'
import { IMG } from '../lib/assets'

export type CartItem = {
  key: string
  productId: string
  name: string
  variant: string
  price: number
  qty: number
  image: string
}

export type Address = {
  name: string
  surname: string
  email: string
  phoneCountry: string
  phone: string
  address: string
  postcode: string
  province: string
  city: string
  country: string
}

export type Card = { nameOnCard: string; number: string; cvv: string; expiry: string }

type PromoState = { code: string; status: 'idle' | 'applied' | 'error'; discount: number }

type State = {
  items: CartItem[]
  cartOpen: boolean
  promo: PromoState
  deliveryMethod: string | null
  address: Address | null
  paymentMethod: string | null
  lastOrder: { id: string; total: number } | null
}

type Action =
  | { type: 'add'; item: Omit<CartItem, 'qty' | 'key'> }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'open'; open: boolean }
  | { type: 'promo'; code: string }
  | { type: 'promo-clear' }
  | { type: 'delivery-method'; id: string }
  | { type: 'address'; address: Address }
  | { type: 'payment-method'; id: string }
  | { type: 'place-order' }
  | { type: 'reset' }

const seedItem: CartItem = {
  key: 'pop-air:Black',
  productId: 'pop-air',
  name: 'Pop Air case',
  variant: 'Black',
  price: 1399,
  qty: 1,
  image: IMG.cartPopAir,
}

const initial: State = {
  items: [seedItem],
  cartOpen: false,
  promo: { code: '', status: 'idle', discount: 0 },
  deliveryMethod: null,
  address: null,
  paymentMethod: null,
  lastOrder: null,
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const key = `${a.item.productId}:${a.item.variant}`
      const exists = state.items.find(i => i.key === key)
      const items = exists
        ? state.items.map(i => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { ...a.item, key, qty: 1 }]
      return { ...state, items, cartOpen: true }
    }
    case 'qty':
      return { ...state, items: state.items.map(i => (i.key === a.key ? { ...i, qty: Math.max(1, Math.min(9, a.qty)) } : i)) }
    case 'remove':
      return { ...state, items: state.items.filter(i => i.key !== a.key) }
    case 'open':
      return { ...state, cartOpen: a.open }
    case 'promo': {
      const code = a.code.trim().toUpperCase()
      const discount = PROMO_CODES[code]
      return discount
        ? { ...state, promo: { code: a.code.trim(), status: 'applied', discount } }
        : { ...state, promo: { code: a.code, status: 'error', discount: 0 } }
    }
    case 'promo-clear':
      return { ...state, promo: { code: '', status: 'idle', discount: 0 } }
    case 'delivery-method':
      return { ...state, deliveryMethod: a.id }
    case 'address':
      return { ...state, address: a.address }
    case 'payment-method':
      return { ...state, paymentMethod: a.id }
    case 'place-order': {
      const t = totals(state)
      return {
        ...state,
        lastOrder: { id: `FD-${Math.floor(100000 + Math.random() * 900000)}`, total: t.total },
        items: [],
        promo: { code: '', status: 'idle', discount: 0 },
      }
    }
    case 'reset':
      return { ...initial }
  }
}

export function totals(state: Pick<State, 'items' | 'promo' | 'deliveryMethod'>, deliveryPrice?: number) {
  const count = state.items.reduce((n, i) => n + i.qty, 0)
  const subtotal = state.items.reduce((n, i) => n + i.qty * i.price, 0)
  const freeShipping = subtotal >= FREE_SHIPPING_FROM
  const delivery = count === 0 ? 0 : deliveryPrice ?? (freeShipping ? 0 : 100)
  const discount = state.promo.status === 'applied' ? Math.min(state.promo.discount, subtotal) : 0
  const total = Math.max(0, subtotal - discount + delivery)
  return { count, subtotal, delivery, discount, total, freeShipping, remaining: Math.max(0, FREE_SHIPPING_FROM - subtotal) }
}

type Ctx = { state: State; dispatch: React.Dispatch<Action> }
const StoreContext = createContext<Ctx | null>(null)

const STORAGE_KEY = 'fractal-prototype-v1'

function load(): State {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initial, ...JSON.parse(raw), cartOpen: false }
  } catch {
    /* storage unavailable */
  }
  return initial
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      const { cartOpen: _ignored, ...persist } = state
      void _ignored
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
    } catch {
      /* storage unavailable */
    }
  }, [state])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

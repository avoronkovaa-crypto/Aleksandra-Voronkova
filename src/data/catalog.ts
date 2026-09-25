import { IMG } from '../lib/assets'

export type Swatch = {
  name: string
  /** One colour, or two for a split "double" swatch. */
  color: string | [string, string]
  available?: boolean
}

export type Product = {
  id: string
  name: string
  /** Price in SEK (kr). */
  price: number
  from?: boolean
  image: string
  swatches: Swatch[]
  extraSwatches?: number
}

const black: Swatch = { name: 'Black', color: '#131313' }
const white: Swatch = { name: 'White', color: '#ffffff' }

export const PRODUCTS: Record<string, Product> = {
  'pop-air': {
    id: 'pop-air',
    name: 'Pop Air',
    price: 1399,
    from: true,
    image: IMG.popAir,
    swatches: [
      { name: 'Orange Core', color: '#d1780b' },
      { name: 'Green Core', color: '#7acc00' },
      { name: 'Magenta Core', color: '#c10966' },
    ],
    extraSwatches: 1,
  },
  'pop-silent': {
    id: 'pop-silent',
    name: 'Pop Silent',
    price: 2190,
    from: true,
    image: IMG.popSilent,
    swatches: [white, black, { name: 'Black TG', color: '#131313' }],
  },
  'pop-mini-silent': {
    id: 'pop-mini-silent',
    name: 'Pop Mini Silent',
    price: 1799,
    from: true,
    image: IMG.popMiniSilent,
    swatches: [black, white],
  },
  'pop-xl-silent': {
    id: 'pop-xl-silent',
    name: 'Pop XL Silent',
    price: 1799,
    from: true,
    image: IMG.popXlSilent,
    swatches: [black, white],
  },
  'pop-mini-air': {
    id: 'pop-mini-air',
    name: 'Pop Mini Air',
    price: 1799,
    from: true,
    image: IMG.popMiniAir,
    swatches: [black, white],
  },
  'pop-xl-air': {
    id: 'pop-xl-air',
    name: 'Pop XL Air',
    price: 1799,
    from: true,
    image: IMG.popXlAir,
    swatches: [black, white],
  },
  'usb-c-cable': {
    id: 'usb-c-cable',
    name: 'USB-C 10Gbps Cable',
    price: 1799,
    image: IMG.usbCable,
    swatches: [black, black, black],
  },
  'hdd-tray': {
    id: 'hdd-tray',
    name: 'HDD tray kit – Type D',
    price: 2390,
    image: IMG.hddTray,
    swatches: [black, black, black],
  },
  'usb-c-cable-2': {
    id: 'usb-c-cable-2',
    name: 'USB-C 10Gbps Cable',
    price: 1799,
    image: IMG.usbCable2,
    swatches: [black, black, black],
  },
}

export const SEARCH_RESULTS = ['pop-air', 'pop-silent', 'pop-mini-silent', 'pop-xl-silent', 'pop-mini-air', 'pop-air', 'pop-mini-air', 'pop-xl-air']
export const POP_AIR_FAMILY = ['pop-air', 'pop-mini-air', 'pop-xl-air']
export const POP_SILENT_FAMILY = ['pop-silent', 'pop-mini-silent', 'pop-xl-silent']
export const COMPATIBLE = ['usb-c-cable', 'hdd-tray', 'usb-c-cable-2', 'usb-c-cable-2', 'usb-c-cable-2']

/* ---------- Product page (Pop Air case) ---------- */
export const POP_AIR_PAGE = {
  id: 'pop-air',
  title: 'Pop Air',
  suffix: 'case',
  price: 1399,
  description:
    'Experience a fusion of style and function with Pop Series. Pop Air brings attitude to airflow, melding precision engineering with dynamic design.',
  models: ['Pop Air', 'Pop Mini Air', 'Pop Xl Air'],
  colors: [
    { name: 'Black', color: '#3e3d3d' },
    { name: 'RGB Black', color: ['#131313', '#d1780b'] },
    { name: 'Midnight Blue', color: '#434398' },
    { name: 'Rose', color: '#f4d5ce' },
    { name: 'Sunflower', color: '#f1d489' },
    { name: 'Magenta', color: '#ed92ef', available: false },
    { name: 'Mint', color: '#bfe8b4', available: false },
  ] as Swatch[],
  gallery: [IMG.popAir, IMG.popMiniAir, IMG.popXlAir, IMG.popSilent, IMG.popMiniSilent],
}

/* ---------- Mega menu & categories ---------- */
export type Category = {
  id: string
  title: string
  count: number
  menuImage: string
  sub: string[]
  cards: { title: string; image: string; to?: string }[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'cases',
    title: 'Cases',
    count: 11,
    menuImage: '78c374d2',
    sub: ['Terra', 'North', 'Ridge', 'Pop', 'Torrent', 'Define', 'Meshify', 'Focus', 'Node', 'Core', 'Vector', 'Era'],
    cards: [
      { title: 'Terra', image: '78c374d2' },
      { title: 'North', image: 'fefcbee3' },
      { title: 'Ridge', image: 'cf5bfe47' },
      { title: 'Pop', image: '54049678', to: '/pop-series' },
      { title: 'Torrent', image: 'fd384f51' },
      { title: 'Define', image: '40f80661' },
      { title: 'Meshify', image: '5bda6a49' },
      { title: 'Focus', image: 'b05808d2' },
      { title: 'Node', image: '587d9dd4' },
      { title: 'Core', image: '1077eca0' },
      { title: 'Era', image: '6d45cf96' },
    ],
  },
  {
    id: 'fans',
    title: 'Fans',
    count: 5,
    menuImage: '9ed7e403',
    sub: ['Aspect', 'Prisma', 'Dynamic', 'Silent', 'Venturi'],
    cards: [
      { title: 'Aspect', image: '9ed7e403' },
      { title: 'Prisma', image: 'ca936aee' },
      { title: 'Dynamic', image: '2fae70ec' },
      { title: 'Silent', image: '2334ce50' },
      { title: 'Venturi', image: '639192f8' },
    ],
  },
  {
    id: 'power-supplies',
    title: 'Power Supplies',
    count: 2,
    menuImage: '8e9b46f7',
    sub: ['Ion', 'Anode'],
    cards: [
      { title: 'Ion', image: '8e9b46f7' },
      { title: 'Anode', image: '5a326862' },
    ],
  },
  {
    id: 'water-cooling',
    title: 'Water Cooling',
    count: 2,
    menuImage: '1d248f83',
    sub: ['Lumen', 'Celsius'],
    cards: [
      { title: 'Lumen', image: '1d248f83' },
      { title: 'Celsius', image: '4049e893' },
    ],
  },
  {
    id: 'accessories',
    title: 'Accessories',
    count: 4,
    menuImage: 'd5778330',
    sub: ['Case panels', 'Mounting', 'Hardware', 'Connectivity'],
    cards: [
      { title: 'Case panels', image: 'd5778330' },
      { title: 'Mounting', image: 'afce0841' },
      { title: 'Hardware', image: '74dca0fd' },
      { title: 'Connectivity', image: '91a2cb92' },
    ],
  },
]

export const COMMUNITY_LINKS = ['Creator Programm', 'ModHQ']

/* ---------- Cases listing (Preview cards) ---------- */
export type Preview = {
  title: string
  render?: string
  photo?: string
  /** Looping video shown instead of the photo (large cards). */
  video?: string
  large?: boolean
  to?: string
}

export const CASES_GRID: Preview[] = [
  { title: 'Terra', render: 'a66e79c5', photo: 'a0104ae8' },
  { title: 'North', render: '895e57c9', photo: 'fefcbee3' },
  { title: 'Ridge', photo: 'cf5bfe47', large: true },
  { title: 'Core', render: '260be2e3', photo: '666e2e78' },
  { title: 'Torrent', render: '2c88c94e', photo: '32fd9882' },
  { title: 'Define', render: 'aedd5744', photo: '40f80661' },
  { title: 'Meshify', render: 'c546742d', photo: '5bda6a49' },
  { title: 'Focus', render: '2ae54f11', photo: 'b05808d2' },
  { title: 'Pop', photo: '54049678', large: true, to: '/pop-series' },
  { title: 'Node', render: '493ab0ce', photo: '587d9dd4' },
  { title: 'Vector', render: '7022b16e', photo: '1077eca0' },
  { title: 'Era', render: '8076fc01', photo: '6d45cf96' },
]

/* ---------- Checkout ---------- */
export const DELIVERY_METHODS = [
  { id: 'standard', title: 'Standard', carrier: 'postnord', note: 'Standard delivery 3–4 business days', price: 100 },
  { id: 'pickup', title: 'Pick–Up point', info: true, note: 'Delivery 3–4 business days', price: 100 },
  { id: 'express', title: 'Express', carrier: 'postnord', note: 'Express delivery 1–2 business days', price: 1000 },
] as const

export const PAYMENT_METHODS = [
  { id: 'mastercard', title: 'Mastercard' },
  { id: 'visa', title: 'VISA' },
  { id: 'applepay', title: 'Apple Pay' },
  { id: 'klarna', title: 'Klarna' },
] as const

export const SAVED_ADDRESSES = [
  { id: 'a1', line: 'Stampgatan 46, 1A', city: 'Gothenburg', region: 'Västra Götalands Län', zip: '41101', country: 'Sverige', phone: '0768670231' },
  { id: 'a2', line: 'Norra Agatan, 5 B', city: 'Gothenburg', region: 'Västra Götalands Län', zip: '41101', country: 'Sverige', phone: '0768670231' },
]

export const SAVED_CARDS = [
  { id: 'c1', title: 'Mastercard 1234', expiry: '06/2027' },
  { id: 'c2', title: 'Mastercard 2463', expiry: '06/2027' },
]

export const FREE_SHIPPING_FROM = 3000
export const PROMO_CODES: Record<string, number> = { FRACTAL: 399, POP: 399 }

export const formatKr = (n: number) =>
  `${n < 0 ? '- ' : ''}${Math.abs(n).toLocaleString('sv-SE').replace(/ /g, ' ')} kr`

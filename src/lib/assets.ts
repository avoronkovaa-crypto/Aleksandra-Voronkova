/**
 * Image assets are pulled from the Figma file by `npm run fetch-assets`
 * (see scripts/fetch-figma-assets.mjs) and saved as
 * `public/assets/<first 8 chars of the Figma image hash>.webp`.
 *
 * Components reference images by that short hash so every image stays
 * traceable to the exact fill used in the design.
 */
export type ImgKey = string

export const img = (key: ImgKey) => `${import.meta.env.BASE_URL}assets/${key}.webp`

/** Named aliases for the images reused across screens. */
export const IMG = {
  // Product renders (transparent PNGs in Figma)
  popAir: '305e2e08',
  popSilent: '90737259',
  popMiniSilent: 'dad4f69e',
  popXlSilent: '5a008a72',
  popMiniAir: '3dada376',
  popXlAir: '5a008a72',
  cartPopAir: 'a77ec75f',
  popAirTab: '305e2e08',
  popSilentTab: 'f9299230',
  usbCable: '260be2e3',
  hddTray: '2c88c94e',
  usbCable2: 'aedd5744',

  // Heroes & lifestyle
  casesHero: '3f910473',
  popAirBlock: 'b727f410',
  popSilentBlock: 'f7e34c66',
  storyThumb: '42dd55be',
  workshop: '6f240972',
  designer: '05a35119',
  megaCases: '78c374d2',
  megaCommunity: '7c84e6ce',
  megaFans: '3635e135',
} as const

/** Flags used by the language switcher. */
export const FLAGS = {
  DE: '4db95fd4',
  EN: 'bdb1e8d9',
  RU: '96f06a28',
  CHI: 'de296838',
  JPN: '9114e6fa',
} as const

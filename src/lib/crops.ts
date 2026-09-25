/**
 * Image crops copied from Figma (fills with scale mode "Crop").
 * Each entry is [width %, height %, left %, top %] of the image relative to
 * its frame — i.e. Figma's imageTransform expressed as CSS.
 */
export type Crop = readonly [number, number, number, number]

/** Category cards 688×688 (All Categories carousels, mega menu). */
export const CARD_CROPS: Record<string, Crop> = {
  '78c374d2': [207.2, 146.5, -62.9, -23.9], // Terra
  fefcbee3: [172.7, 122.1, -36.3, -11.0], // North
  '54049678': [168.7, 124.9, -35.3, -21.6], // Pop
  '9ed7e403': [177.8, 100, -10.8, 0], // Aspect
  ca936aee: [177.8, 100, -35.7, 0], // Prisma
  '8e9b46f7': [177.8, 100, -34.7, 0], // Ion
  d5778330: [252.7, 142.2, -34.9, -23.8], // Case panels
  afce0841: [187.5, 187.5, -17.4, -72.4], // Mounting
  '7c84e6ce': [274.1, 100, -166.3, 0], // Community menu
}

/** Preview cards 346×477: lifestyle photos shown on hover. */
export const PREVIEW_PHOTO_CROPS: Record<string, Crop> = {
  a0104ae8: [199.7, 109.4, -20.8, -4.7],
  '666e2e78': [153.9, 74.4, -27.0, 12.8],
  '5bda6a49': [195.0, 100, -74.3, 0],
  '587d9dd4': [245.1, 100, -72.5, 0],
}

/** Preview cards: product renders in the 314×355 slot. */
export const PREVIEW_RENDER_CROPS: Record<string, Crop> = {
  '895e57c9': [114.0, 91.1, -7.0, 4.5],
  '260be2e3': [117.8, 94.1, -8.9, 5.9],
  '2c88c94e': [108.9, 87.0, -4.5, 8.7],
  aedd5744: [116.6, 93.1, -8.3, 6.1],
  c546742d: [117.5, 93.9, -8.8, 6.1],
  '2ae54f11': [117.2, 93.6, -8.6, 6.4],
  '493ab0ce': [98.1, 78.4, 1.0, 15.3],
  '7022b16e': [113.7, 90.8, -8.0, 7.4],
  '8076fc01': [117.8, 94.1, -8.9, 5.9],
}

/** Product cards: render in the 288×216 slot. */
export const PRODUCT_CARD_CROPS: Record<string, Crop> = {
  '305e2e08': [90.8, 112.2, 4.6, -6.1],
  '3dada376': [90.8, 112.2, 4.6, -6.1],
  '5a008a72': [90.8, 112.2, 4.6, -6.1],
  '90737259': [92.4, 114.2, 3.8, -7.7],
  dad4f69e: [92.1, 113.8, 3.9, -6.9],
}

export const CROPS = {
  casesHero: [138.8, 136.5, -19.4, -13.7] as Crop,
  storyThumb: [92.6, 117.8, 13.9, 10.7] as Crop,
  popAirBlock: [100, 182.0, 0, -30.6] as Crop,
  popSilentBlock: [100, 131.5, 0, -7.6] as Crop,
  popXlAirShowcase: [117.0, 127.6, -16.8, -11.5] as Crop,
  gallery: [120.1, 109.8, -10.0, -4.9] as Crop,
  usbC: [117.4, 113.7, -2.9, -5.4] as Crop,
  cartThumb: [87.7, 70.2, 6.1, 14.9] as Crop,
}

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Img } from './Img'
import { Video } from './Video'
import type { Crop } from '../lib/crops'
import s from './Hero.module.css'

type Props = {
  /** Figma image hash. */
  image?: string
  /** Looping video (see VIDEO in src/lib/assets.ts); used instead of `image`. */
  video?: string
  height?: number
  position?: string
  crop?: Crop
  children?: ReactNode
}

/**
 * First-screen media (Figma › Fixed-aspect-ratio-spacer, 1512×821) with a
 * subtle parallax + slow zoom-in on load.
 */
export function Hero({ image, video, height = 821, position, crop, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} className={s.hero} style={{ height }}>
      <motion.div className={s.media} style={{ y }}>
        <motion.div
          className={s.zoom}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {video ? (
            <Video name={video} />
          ) : image ? (
            <Img src={image} tone="dark" eager position={position} crop={crop} />
          ) : (
            <div className={s.ambient} />
          )}
        </motion.div>
      </motion.div>
      <div className={s.shade} />
      {children}
    </section>
  )
}

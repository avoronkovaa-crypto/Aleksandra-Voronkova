import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Img } from './Img'
import s from './Hero.module.css'

type Props = {
  /** Figma image hash; omit for the video heroes (rendered as an ambient scene). */
  image?: string
  height?: number
  position?: string
  children?: ReactNode
}

/**
 * First-screen media (Figma › Fixed-aspect-ratio-spacer, 1512×821) with a
 * subtle parallax + slow zoom-in on load.
 */
export function Hero({ image, height = 821, position, children }: Props) {
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
          {image ? <Img src={image} tone="dark" eager position={position} /> : <div className={s.ambient} />}
        </motion.div>
      </motion.div>
      <div className={s.shade} />
      {children}
    </section>
  )
}

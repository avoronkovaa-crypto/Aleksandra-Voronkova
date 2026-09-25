import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Img } from './Img'
import { ArrowButton } from './Button'
import { Reveal } from './Reveal'
import { IMG } from '../lib/assets'
import s from './Sections.module.css'

/** Full-bleed photograph (Figma › Fixed-aspect-ratio-spacer 1512×851) with gentle parallax. */
export function ImageBand({ image, height = 851 }: { image: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return (
    <div ref={ref} className={s.band} style={{ height }}>
      <motion.div className={s.bandInner} style={{ y }}>
        <Img src={image} />
      </motion.div>
    </div>
  )
}

/** "Keep abreast…" newsletter block (Figma › Image + Subscription). */
export function Subscription() {
  return (
    <section className={s.subscription}>
      <Reveal className={s.subscriptionText}>
        <p className="t-title-1">Keep abreast of what we’re working on, what’s hot and what might be right around the corner.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <ArrowButton>Subscribe to our newsletter</ArrowButton>
      </Reveal>
    </section>
  )
}

/** "We've been thinking inside of the box since 2008" (Figma › Text block). */
export function StoryBlock() {
  return (
    <section className={s.story}>
      <div className={s.storyTop}>
        <Reveal className={s.storyTitle}>
          <h2 className="t-title-1">We've been thinking inside of the box since 2008</h2>
        </Reveal>
        <Reveal className={s.storyThumb} delay={0.1}>
          <Img src={IMG.storyThumb} fit="contain" />
        </Reveal>
      </div>
      <div className={s.storyText}>
        <Reveal>
          <p className="t-title-4">That's when we completed our first PC case (the Define R2) that took the market by storm.</p>
        </Reveal>
        <Reveal className={s.storyCol} delay={0.1}>
          <p className="t-body-1">
            Several models have come and gone since then, but the underlying principles of our creative process remain the
            same: design comes first, built to last, always relevant. Staying true to that allows us to keep putting out
            technical solutions made personal. Because at the end of the day, it’s not about a computer. It’s about your
            computer.
          </p>
          <ArrowButton>Read more</ArrowButton>
        </Reveal>
      </div>
    </section>
  )
}

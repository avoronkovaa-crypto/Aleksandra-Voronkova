import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import s from './ScrollFillText.module.css'

type Props = {
  text: string
  className?: string
}

/** How many letters are mid-fill at once — a soft edge instead of a hard cut. */
const EDGE = 3

/**
 * Text that starts grey and fills in white letter by letter, in reading order,
 * as it scrolls through the screen (so each row completes before the next).
 */
export function ScrollFillText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })

  const words = text.split(' ')
  const total = text.replace(/ /g, '').length
  let index = 0

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} aria-hidden>
          <span className={s.word}>
            {[...word].map(char => {
              const i = index++
              return <Letter key={i} char={char} progress={progress} range={[i / (total + EDGE), (i + EDGE) / (total + EDGE)]} />
            })}
          </span>
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}

function Letter({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.28, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

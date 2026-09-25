import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Category } from '../data/catalog'
import { Img } from './Img'
import { ArrowButton, CaretLink, RoundArrow } from './Button'
import s from './CategoryRow.module.css'

type Props = { category: Category; index: number; total: number }

/** Figma › Categories block › Category (Desktop): title column + horizontal card carousel. */
export function CategoryRow({ category, index, total }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [bar, setBar] = useState({ progress: 0, thumb: 0.3 })

  const update = () => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setBar({ progress: max > 0 ? el.scrollLeft / max : 0, thumb: Math.min(1, el.clientWidth / el.scrollWidth) })
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 })
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const page = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * 704, behavior: 'smooth' })
  const to = category.id === 'cases' ? '/cases' : '/'

  return (
    <section className={s.row} id={category.id}>
      <div className={s.aside}>
        <div className={s.dots} aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`${s.dot} ${i === index ? s.dotActive : ''}`} />
          ))}
        </div>
        <motion.div
          className={s.titleBlock}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="t-title-2">{category.title}</h2>
          <ArrowButton to={to}>Explore all products</ArrowButton>
        </motion.div>
      </div>

      <div className={s.carousel}>
        <div ref={track} className={s.track} onScroll={update}>
          {category.cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={s.cardWrap}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 3) * 0.08 }}
            >
              <Link to={card.to ?? to} className={`${s.card} hover-parent`}>
                <div className={s.cardImg}>
                  <Img src={card.image} tone="dark" />
                </div>
                <div className={s.cardShade} />
                <div className={s.cardText}>
                  <p className="t-title-4">{card.title}</p>
                  <CaretLink tone="light">Learn more</CaretLink>
                </div>
              </Link>
            </motion.div>
          ))}
          <div className={s.trackEnd} />
        </div>

        <RoundArrow dir="left" className={`${s.arrow} ${s.arrowLeft}`} onClick={() => page(-1)} disabled={edges.start} />
        <RoundArrow dir="right" className={`${s.arrow} ${s.arrowRight}`} onClick={() => page(1)} disabled={edges.end} />

        <div className={s.progress} aria-hidden>
          <span
            className={s.progressThumb}
            style={{ width: `${bar.thumb * 100}%`, left: `${bar.progress * (1 - bar.thumb) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}

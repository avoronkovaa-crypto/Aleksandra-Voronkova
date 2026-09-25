import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Page } from '../components/Page'
import { Hero } from '../components/Hero'
import { PageTitle } from '../components/PageTitle'
import { AnchorLinks } from '../components/AnchorLinks'
import { CategoryRow } from '../components/CategoryRow'
import { ImageBand, Subscription } from '../components/Sections'
import { CATEGORIES } from '../data/catalog'
import { IMG, VIDEO } from '../lib/assets'
import s from './Home.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Figma › Categories_ALL (2137:37311).
 * One category carousel is shown at a time; the anchor links and the vertical
 * pagination dots switch between them with a vertical slide.
 */
export function Home() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const select = (i: number) => i !== index && setState([i, i > index ? 1 : -1])
  const category = CATEGORIES[index]

  return (
    <Page>
      <Hero video={VIDEO.home} />
      <div className={s.heading}>
        <PageTitle title="All Categories">
          <AnchorLinks
            items={CATEGORIES.map(c => ({ id: c.id, label: c.title, count: c.count }))}
            active={category.id}
            onSelect={id => select(CATEGORIES.findIndex(c => c.id === id))}
          />
        </PageTitle>
      </div>

      <div className={s.rows}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={category.id}
            custom={dir}
            className={s.row}
            variants={{
              enter: (d: number) => ({ y: d * 120, opacity: 0 }),
              center: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
              exit: (d: number) => ({ y: d * -120, opacity: 0, transition: { duration: 0.35, ease: EASE } }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <CategoryRow category={category} />
          </motion.div>
        </AnimatePresence>

        {/* Figma › Pagination (vertical dot indicator) */}
        <div className={s.dots} role="tablist" aria-label="Categories">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={c.title}
              className={`${s.dot} ${i === index ? s.dotActive : ''}`}
              onClick={() => select(i)}
            />
          ))}
        </div>
      </div>

      <ImageBand image={IMG.designer} />
      <Subscription />
    </Page>
  )
}

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Page } from '../components/Page'
import { Hero } from '../components/Hero'
import { PageTitle } from '../components/PageTitle'
import { PreviewCard } from '../components/PreviewCard'
import { Dropdown } from '../components/Dropdown'
import { Icon } from '../components/Icon'
import { ImageBand, StoryBlock } from '../components/Sections'
import { CASES_GRID } from '../data/catalog'
import { IMG } from '../lib/assets'
import { CROPS } from '../lib/crops'
import s from './Cases.module.css'

const FILTERS = ['Airflow', 'Silent', 'Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX', 'Tempered glass', 'RGB']
const SORTS = ['Featured', 'Newest', 'Price: low to high', 'Price: high to low']
const EASE = [0.22, 1, 0.36, 1] as const

/** Figma › Categories_Cases (2137:37403). */
export function Cases() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [active, setActive] = useState<string[]>([])
  const [sort, setSort] = useState<string>()
  const [layout, setLayout] = useState<'grid' | 'rows'>('grid')

  const toggle = (f: string) => setActive(a => (a.includes(f) ? a.filter(x => x !== f) : [...a, f]))

  return (
    <Page>
      <Hero image={IMG.casesHero} crop={CROPS.casesHero} />
      <PageTitle title="Cases" count={12} size="giant" />

      <div className={s.filters}>
        <button type="button" className={s.filterBtn} onClick={() => setFilterOpen(o => !o)} aria-expanded={filterOpen}>
          <motion.span animate={{ rotate: filterOpen ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} className={s.plus}>
            <Icon name="plus" />
          </motion.span>
          <span className="t-title-5">FILTER</span>
          {active.length > 0 && <span className={`t-foot-2 ${s.badge}`}>{active.length}</span>}
        </button>

        <div className={s.tools}>
          <div className={s.layout} role="group" aria-label="Layout">
            <button type="button" className={`${s.layoutBtn} ${layout === 'grid' ? s.layoutActive : ''}`} onClick={() => setLayout('grid')} aria-label="Modular grid">
              <Icon name="grid" />
            </button>
            <button type="button" className={`${s.layoutBtn} ${layout === 'rows' ? s.layoutActive : ''}`} onClick={() => setLayout('rows')} aria-label="Column grid">
              <Icon name="rows" />
            </button>
          </div>
          <Dropdown label="Sort by" options={SORTS} value={sort} onChange={setSort} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {filterOpen && (
          <motion.div
            className={s.chipsWrap}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className={s.chips}>
              {FILTERS.map(f => (
                <button key={f} type="button" className={`t-foot-1 ${s.chip} ${active.includes(f) ? s.chipOn : ''}`} onClick={() => toggle(f)}>
                  {f}
                  {active.includes(f) && <Icon name="cross" size={16} />}
                </button>
              ))}
              {active.length > 0 && (
                <button type="button" className={`t-foot-1 ${s.clear}`} onClick={() => setActive([])}>
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutGroup>
        <motion.div layout className={`${s.grid} ${layout === 'rows' ? s.gridRows : ''}`}>
          {CASES_GRID.map((item, i) => (
            <motion.div
              layout
              key={item.title + i}
              className={item.large && layout === 'grid' ? s.span2 : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.06 }}
            >
              <PreviewCard item={{ ...item, large: item.large && layout === 'grid' }} />
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>

      <StoryBlock />
      <ImageBand image={IMG.workshop} />
    </Page>
  )
}

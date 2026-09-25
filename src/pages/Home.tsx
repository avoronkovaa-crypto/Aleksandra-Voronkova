import { useEffect, useState } from 'react'
import { Page } from '../components/Page'
import { Hero } from '../components/Hero'
import { PageTitle } from '../components/PageTitle'
import { AnchorLinks } from '../components/AnchorLinks'
import { CategoryRow } from '../components/CategoryRow'
import { ImageBand, Subscription } from '../components/Sections'
import { CATEGORIES } from '../data/catalog'
import { IMG } from '../lib/assets'
import s from './Home.module.css'

/** Figma › Categories_ALL (2137:37311). */
export function Home() {
  const [active, setActive] = useState(CATEGORIES[0].id)

  // Scroll-spy: highlight the anchor of the category row in view
  useEffect(() => {
    const els = CATEGORIES.map(c => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { threshold: [0.35, 0.6], rootMargin: '-140px 0px -20% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <Page>
      <Hero />
      <div className={s.heading}>
        <PageTitle title="All Categories">
          <AnchorLinks
            items={CATEGORIES.map(c => ({ id: c.id, label: c.title, count: c.count }))}
            active={active}
            onSelect={id => {
              setActive(id)
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
        </PageTitle>
      </div>

      <div className={s.rows}>
        {CATEGORIES.map((c, i) => (
          <CategoryRow key={c.id} category={c} index={i} total={CATEGORIES.length} />
        ))}
      </div>

      <ImageBand image={IMG.designer} />
      <Subscription />
    </Page>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Page } from '../components/Page'
import { Hero } from '../components/Hero'
import { PageTitle } from '../components/PageTitle'
import { Img } from '../components/Img'
import { CaretLink } from '../components/Button'
import { ImageBand, StoryBlock } from '../components/Sections'
import { IMG } from '../lib/assets'
import { CROPS } from '../lib/crops'
import s from './CasesPopAir.module.css'

const SHOWCASE = [
  { title: 'Pop XL Air', price: 'From 2 390 kr', image: 'ba0c6557', to: '/product/pop-xl-air' },
  { title: 'Pop Air', price: 'From 2 390 kr', image: '636637b3', to: '/pop-air' },
  { title: 'Pop Mini Air', price: 'From 2 390 kr', image: '662add0a', to: '/product/pop-mini-air' },
]

/** Figma › Categories_Cases "Cases Pop Air" (2137:37438). */
export function CasesPopAir() {
  return (
    <Page>
      <Hero image={IMG.casesHero} crop={CROPS.casesHero} />
      <div className={s.heading}>
        <PageTitle title="Cases Pop Air" count={12} />
      </div>

      <div className={s.cards}>
        {SHOWCASE.map(item => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={item.to} className={`${s.card} hover-parent`}>
              <div className={s.img}>
                <Img src={item.image} tone="dark" crop={item.image === 'ba0c6557' ? CROPS.popXlAirShowcase : undefined} />
              </div>
              <div className={s.text}>
                <p className="t-title-4">{item.title}</p>
                <p className={`t-body-1 ${s.price}`}>{item.price}</p>
              </div>
              <div className={s.more}>
                <CaretLink tone="light">Discover {item.title}</CaretLink>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <StoryBlock />
      <ImageBand image={IMG.workshop} />
    </Page>
  )
}

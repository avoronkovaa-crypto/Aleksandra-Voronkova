import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { Hero } from '../components/Hero'
import { PageTitle } from '../components/PageTitle'
import { Tabs } from '../components/Tabs'
import { Img } from '../components/Img'
import { ButtonLink, CaretLink } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import { Compatible } from '../components/Compatible'
import { useToast, NOT_IN_PROTOTYPE } from '../components/Toast'
import { POP_AIR_FAMILY, POP_SILENT_FAMILY, PRODUCTS } from '../data/catalog'
import { IMG } from '../lib/assets'
import { CROPS } from '../lib/crops'
import s from './PopSeries.module.css'

type Block = {
  id: 'pop-air' | 'pop-silent'
  title: string
  text: string
  price: string
  image: string
  dark: boolean
  family: string[]
}

const BLOCKS: Block[] = [
  {
    id: 'pop-air',
    title: 'Pop Air',
    text: 'Pop Air brings attitude to airflow, melding precision engineering with dynamic design.',
    price: 'From 2 390 kr',
    image: IMG.popAirBlock,
    dark: true,
    family: POP_AIR_FAMILY,
  },
  {
    id: 'pop-silent',
    title: 'Pop Silent',
    text: 'Pop Silent is quietly stylish and ideal for mixed use, productivity, and lighter gaming.',
    price: 'From 2 390 kr',
    image: IMG.popSilentBlock,
    dark: false,
    family: POP_SILENT_FAMILY,
  },
]

/** Figma › Categories_Cases_Pop (2137:37629). */
export function PopSeries() {
  const [tab, setTab] = useState<string>('pop-air')
  const toast = useToast()

  return (
    <Page>
      <Hero />
      <PageTitle title="Pop Series" />

      <div className={s.tabBar}>
        <Tabs
          group="pop-series"
          tall
          className={s.tabs}
          value={tab}
          onChange={id => {
            setTab(id)
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          tabs={[
            {
              id: 'pop-air',
              label: (
                <>
                  <span className={s.tabThumb}>
                    <Img src={IMG.popAirTab} fit="contain" />
                  </span>
                  Pop Air
                </>
              ),
            },
            {
              id: 'pop-silent',
              label: (
                <>
                  <span className={s.tabThumb}>
                    <Img src={IMG.popSilentTab} fit="contain" />
                  </span>
                  Pop Silent
                </>
              ),
            },
          ]}
        />
      </div>

      <div className={s.blocks}>
        {BLOCKS.map(b => (
          <section key={b.id} id={b.id} className={s.block}>
            <div className={`${s.banner} ${b.dark ? s.dark : s.light}`}>
              <div className={s.bannerImg}>
                <Img src={b.image} tone={b.dark ? 'dark' : 'light'} crop={b.dark ? CROPS.popAirBlock : CROPS.popSilentBlock} />
              </div>
              <Reveal className={s.bannerText}>
                <h2 className="t-title-1">{b.title}</h2>
                <p className="t-body-1">{b.text}</p>
                <div className={s.cta}>
                  <p className={`t-body-1 ${s.price}`}>{b.price}</p>
                  <div className={s.ctaRow}>
                    {b.id === 'pop-air' ? (
                      <>
                        <ButtonLink to="/product/pop-air" variant="invert" size="sm">
                          Buy
                        </ButtonLink>
                        <Link to="/cases/pop-air">
                          <CaretLink tone="light">Learn more</CaretLink>
                        </Link>
                      </>
                    ) : (
                      <>
                        <ButtonLink to="/product/pop-silent" variant="secondary" size="sm">
                          Buy
                        </ButtonLink>
                        <CaretLink onClick={() => toast(NOT_IN_PROTOTYPE)}>Learn more</CaretLink>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
            <RevealGroup className={s.cards}>
              {b.family.map(id => (
                <RevealItem key={id} className={s.card}>
                  <ProductCard product={PRODUCTS[id]} to={`/product/${id}`} />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        ))}
      </div>

      <section className={s.statement}>
        <Reveal>
          <p className={`t-title-1 ${s.statementTitle}`}>
            Open up for more airflow with <strong>Pop Air</strong> or cut down on sound with <strong>Pop Silent.</strong>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={`t-body-1 ${s.statementText}`}>
            Whichever path you choose, Pop Series will provide you with a solid build, a straight – forward layout, and will
            serve as a stylish addition to your desk space.
          </p>
        </Reveal>
      </section>

      <Compatible />
    </Page>
  )
}

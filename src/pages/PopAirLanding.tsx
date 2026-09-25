import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { Page } from '../components/Page'
import { Img } from '../components/Img'
import { ButtonLink, CaretLink } from '../components/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import { Reviews } from '../components/Reviews'
import { Accordion, SpecGrid, COMPATIBILITY, SPECIFICATIONS, DIMENSIONS, OTHER } from '../components/Accordion'
import { Compatible } from '../components/Compatible'
import { Dropdown } from '../components/Dropdown'
import { useToast, NOT_IN_PROTOTYPE } from '../components/Toast'
import { IMG } from '../lib/assets'
import { CROPS } from '../lib/crops'
import s from './PopAirLanding.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'compatible', label: 'Compatible products' },
]

const SLIDES = [
  'The vividly colored motherboard plates, drive trays and exterior accents create a fresh, expressive feel',
  'A hidden compartment with two neatly concealed 5.25” bays with storage drawer and magnetic cover',
  'The easy-to-clean front mesh acts as a dust filter while allowing high airflow',
]

const BENEFITS = [
  ['Effortless Cable Management', 'Easy cable management with multiple tie-down points, pre-mounted cable ties and convenient extra-large pass-through holes'],
  ['Tempered Glass Panel', 'Easily mounted tempered glass side panel lets you showcase your components. (TG models only)'],
  ['Honeycomb Pop Series Upgrade', 'The honeycomb patterned front mesh creates a striking visual effect that gives the Pop series a premium feel'],
  ['Versatile Radiator Compatibility', 'Holds radiators up to 280 mm in the front, 240 mm in the top and 120 mm in the rear'],
  ['Dual Drive Storage', 'Two ultra-versatile storage trays each support a 3.5” and a 2.5” drive simultaneously. A dedicated SSD bracket for 2x 2.5” is also included'],
]

const MORE = [
  { title: 'Pop Mini Air', image: '7d3a9ce8', price: 'From 2 390 kr', to: '/product/pop-mini-air' },
  { title: 'Pop XL Air', image: '6a95efb0', price: 'From 2 690 kr', to: '/product/pop-xl-air' },
]

/** Figma › Product Landing (2137:37756). */
export function PopAirLanding() {
  const [active, setActive] = useState('overview')
  const navigate = useNavigate()
  const toast = useToast()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, 180])
  const heroFade = useTransform(scrollY, [0, 600], [1, 0])

  useEffect(() => {
    const els = SECTIONS.map(x => document.getElementById(x.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const go = (id: string) => {
    if (id === 'downloads') return toast(NOT_IN_PROTOTYPE)
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 63, behavior: 'smooth' })
  }

  return (
    <Page>
      {/* Start screen */}
      <section id="overview" className={s.hero}>
        <motion.div className={s.heroImg} style={{ y: heroY }}>
          <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} className={s.fill}>
            <Img src={IMG.popAirBlock} tone="dark" eager />
          </motion.div>
        </motion.div>
        <div className={s.heroShade} />
        <motion.div className={s.heroText} style={{ opacity: heroFade }}>
          <motion.h1
            className={s.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            Pop Air
          </motion.h1>
          <motion.p
            className="t-title-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          >
            Experience a fusion of style and function with Pop Series.
          </motion.p>
        </motion.div>
      </section>

      {/* Landing navigation — sticks to the top once the site header slides away */}
      <nav className={s.landingNav} aria-label="Pop Air sections">
        <div className={s.navModel}>
          <Dropdown
            label="Pop Air"
            value="Pop Air"
            align="left"
            options={['Pop Air', 'Pop Mini Air', 'Pop XL Air']}
            onChange={v => v !== 'Pop Air' && navigate(v === 'Pop Mini Air' ? '/product/pop-mini-air' : '/product/pop-xl-air')}
          />
        </div>
        <div className={s.navTabs}>
          {SECTIONS.map(x => (
            <button key={x.id} type="button" className={`t-foot-1 ${s.navTab} ${active === x.id ? s.navTabActive : ''}`} onClick={() => go(x.id)}>
              {x.label}
              {active === x.id && <motion.span layoutId="landing-nav" className={s.navIndicator} transition={{ duration: 0.4, ease: EASE }} />}
            </button>
          ))}
        </div>
        <ButtonLink to="/product/pop-air" variant="invert" size="sm" className={s.navBuy}>
          Buy
        </ButtonLink>
      </nav>

      {/* Feature slides (video in Figma) */}
      <section id="features">
        {SLIDES.map((text, i) => (
          <div key={i} className={s.slide}>
            <div className={`${s.slideScene} ${s[`scene${i}`]}`} />
            <Reveal className={s.slideText} y={40}>
              <p className="t-title-3">{text}</p>
            </Reveal>
          </div>
        ))}
      </section>

      <section className={s.statement}>
        <Reveal>
          <p className={`t-title-1 ${s.statementText}`}>Pop Air brings attitude to airflow, melding precision engineering with dynamic design.</p>
        </Reveal>
      </section>

      <RevealGroup className={s.benefits}>
        {BENEFITS.map(([title, text], i) => (
          <RevealItem key={title} className={s.benefit}>
            <p className="t-body-1 t-secondary">({String(i + 1).padStart(2, '0')})</p>
            <h3 className="t-title-3">{title}</h3>
            <p className="t-body-1">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <section className={s.media}>
        <Img src="f859dc43" tone="dark" crop={CROPS.usbC} />
        <Reveal className={s.mediaText}>
          <h2 className="t-title-1">USB-C ready I/O panel</h2>
          <p className="t-body-1">
            Features a new ARGB controller and power LEDs
            <br />
            Easily installed USB-C module available separately
          </p>
          <CaretLink tone="light" onClick={() => toast(NOT_IN_PROTOTYPE)}>
            Learn more
          </CaretLink>
        </Reveal>
      </section>
      <section className={s.media}>
        <Img src="22980726" tone="dark" />
        <div className={s.play}>
          <button type="button" className={s.playBtn} onClick={() => toast('Video playback is not part of this prototype.')}>
            Play
          </button>
        </div>
      </section>

      <section id="reviews" className={s.reviews}>
        <div className={s.reviewsInner}>
          <Reviews wide />
        </div>
      </section>

      <section id="specifications" className={s.specs}>
        <Accordion
          size="lg"
          defaultOpen="compatibility"
          items={[
            { id: 'specifications', title: 'Specifications', content: <SpecGrid specs={SPECIFICATIONS} /> },
            { id: 'compatibility', title: 'Compatibility', content: <SpecGrid specs={COMPATIBILITY} /> },
            { id: 'dimensions', title: 'Dimensions', content: <SpecGrid specs={DIMENSIONS} /> },
            { id: 'other', title: 'Other', content: <SpecGrid specs={OTHER} /> },
          ]}
        />
      </section>
      <span id="downloads" />

      <div id="compatible">
        <Compatible />
      </div>

      <section className={s.more}>
        {MORE.map(m => (
          <div key={m.title} className={s.moreCard}>
            <div className={s.moreImg}>
              <Img src={m.image} tone="dark" />
            </div>
            <div className={s.moreText}>
              <h3 className="t-title-2">{m.title}</h3>
              <p className="t-foot-1">Pop Silent is quietly stylish and ideal for mixed use, productivity, and lighter gaming.</p>
              <p className={`t-body-1 ${s.morePrice}`}>{m.price}</p>
              <div className={s.moreCta}>
                <ButtonLink to={m.to} variant="invert" size="sm">
                  Buy
                </ButtonLink>
                <CaretLink tone="light" onClick={() => navigate(m.to)}>
                  Learn more
                </CaretLink>
              </div>
            </div>
          </div>
        ))}
      </section>
    </Page>
  )
}

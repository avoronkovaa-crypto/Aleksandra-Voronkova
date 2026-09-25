import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CATEGORIES, COMMUNITY_LINKS } from '../../data/catalog'
import { IMG } from '../../lib/assets'
import { Img } from '../Img'
import { CARD_CROPS } from '../../lib/crops'
import { ArrowButton } from '../Button'
import s from './MegaMenu.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

export const panelMotion = {
  initial: { clipPath: 'inset(0 0 100% 0)' },
  animate: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.46, ease: EASE } },
  exit: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.28, ease: [0.65, 0, 0.35, 1] as const } },
}

const listMotion = {
  animate: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
}
const itemMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
}

/** Where each category/sub-category leads inside the prototype. */
const routeFor = (cat: string, sub?: string) => {
  if (sub === 'Pop') return '/pop-series'
  if (cat === 'cases') return '/cases'
  return '/'
}

export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const current = CATEGORIES.find(c => c.id === active)
  const image = current?.menuImage ?? IMG.megaFans

  return (
    <motion.div className={s.panel} {...panelMotion}>
      <div className={s.inner}>
        <div className={s.left}>
          <motion.div className={s.col} variants={listMotion} initial="initial" animate="animate">
            <div className={s.categories}>
              {CATEGORIES.map(c => (
                <motion.div key={c.id} variants={itemMotion}>
                  <Link
                    to={routeFor(c.id)}
                    className={`t-title-2 ${s.category} ${active === c.id ? s.categoryActive : ''}`}
                    onMouseEnter={() => setActive(c.id)}
                    onFocus={() => setActive(c.id)}
                    onClick={onNavigate}
                  >
                    {c.title}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemMotion}>
              <ArrowButton to="/" onClick={onNavigate}>
                See All Categories
              </ArrowButton>
            </motion.div>
          </motion.div>

          <div className={s.col}>
            <AnimatePresence mode="wait">
              {current && (
                <motion.ul
                  key={current.id}
                  className={s.subList}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  variants={{ animate: { transition: { staggerChildren: 0.025 } } }}
                >
                  {current.sub.map(sub => (
                    <motion.li key={sub} variants={itemMotion}>
                      <Link to={routeFor(current.id, sub)} className={`t-body-1 ${s.sub}`} onClick={onNavigate}>
                        {sub}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={s.media}>
          <AnimatePresence initial={false}>
            <motion.div
              key={image}
              className={s.mediaLayer}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
            >
              <Img src={image} tone={current ? 'light' : 'dark'} eager crop={CARD_CROPS[image]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export function CommunityMenu() {
  return (
    <motion.div className={s.panel} {...panelMotion}>
      <div className={s.inner}>
        <div className={s.left}>
          <motion.div className={s.col} variants={listMotion} initial="initial" animate="animate">
            <div className={s.categories}>
              {COMMUNITY_LINKS.map(l => (
                <motion.div key={l} variants={itemMotion}>
                  <a href="#community" className={`t-title-2 ${s.category} ${s.nowrap}`} onClick={e => e.preventDefault()}>
                    {l}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className={s.media}>
          <motion.div
            className={s.mediaLayer}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } }}
          >
            <Img src={IMG.megaCommunity} eager crop={CARD_CROPS[IMG.megaCommunity]} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

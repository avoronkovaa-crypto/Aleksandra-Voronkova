import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Tabs } from './Tabs'
import { Img } from './Img'
import { Button } from './Button'
import s from './Reviews.module.css'

const REVIEWS = [
  { source: 'Thinkcomputers', quote: '"Fractal Design is always known for their quality and this case is no different."', awards: ['9233c224', '16f87eee'] },
  { source: 'TweakTown', quote: '"In the end, the Pop Air from Fractal is a fresh look on a tried and true design that just works."', awards: ['edd7ebc5'] },
  { source: 'PC Perspective', quote: '"I’m happy to recommend both these cases and give them the PC Perspective Gold award."', awards: ['2e225c77'] },
  { source: 'Techpowerup', quote: '"... we can recommend it without reservation."', awards: ['108c55a9'] },
  { source: 'Guru3D', quote: '"A well-built, great looking chassis with excellent airflow at a very sharp price."', awards: [] },
  { source: 'KitGuru', quote: '"Pop Air punches well above its price point."', awards: [] },
]

/** Figma › Review block + Tabs (Reviews / Videos). */
export function Reviews({ wide }: { wide?: boolean }) {
  const [tab, setTab] = useState('reviews')
  const [count, setCount] = useState(4)
  const list = REVIEWS.slice(0, count)

  return (
    <div className={`${s.root} ${wide ? s.wide : ''}`}>
      <Tabs
        group={wide ? 'reviews-wide' : 'reviews'}
        tabs={[
          { id: 'reviews', label: 'Reviews' },
          { id: 'videos', label: 'Videos' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <AnimatePresence mode="wait" initial={false}>
        {tab === 'reviews' ? (
          <motion.div
            key="reviews"
            className={s.list}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {list.map((r, i) => (
              <motion.article
                key={r.source}
                className={s.review}
                initial={i >= 4 ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={s.text}>
                  <p className="t-body-1">{r.source}</p>
                  <p className="t-title-4">{r.quote}</p>
                </div>
                {r.awards.length > 0 && (
                  <div className={s.awards}>
                    {r.awards.map(a => (
                      <span key={a} className={s.award}>
                        <Img src={a} fit="contain" />
                      </span>
                    ))}
                  </div>
                )}
                <div>
                  <Button variant="tertiary" size="sm">
                    Read the full review
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            className={s.videos}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {['Pop Air — build guide', 'Airflow test: Pop Air vs Pop Silent'].map(v => (
              <div key={v} className={s.video}>
                <div className={s.videoThumb}>
                  <span className={s.play}>▶</span>
                </div>
                <p className="t-body-2">{v}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {tab === 'reviews' && count < REVIEWS.length && (
        <div>
          <Button variant="secondary" size="lg" onClick={() => setCount(REVIEWS.length)}>
            Show more
          </Button>
        </div>
      )}
    </div>
  )
}

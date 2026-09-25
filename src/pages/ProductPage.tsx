import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Page } from '../components/Page'
import { Img } from '../components/Img'
import { CROPS } from '../lib/crops'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { Swatches } from '../components/Swatches'
import { Accordion, SpecGrid, COMPATIBILITY, SPECIFICATIONS, DIMENSIONS, OTHER } from '../components/Accordion'
import { Reviews } from '../components/Reviews'
import { ProductCard } from '../components/ProductCard'
import { COMPATIBLE, POP_AIR_FAMILY, POP_AIR_PAGE, POP_SILENT_FAMILY, PRODUCTS, formatKr } from '../data/catalog'
import { useStore } from '../state/store'
import s from './ProductPage.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** Lifestyle shots from the Pop Air screens, used as the gallery's extra slides. */
const EXTRA_SHOTS: Record<string, string[]> = {
  air: ['636637b3', 'b727f410', '22980726', 'f859dc43'],
  silent: ['f7e34c66', 'f859dc43', '22980726', 'b727f410'],
}

/** Figma › Product Page (2137:37568). */
export function ProductPage() {
  const { id = 'pop-air' } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useStore()
  const product = PRODUCTS[id] ?? PRODUCTS['pop-air']
  const isSilent = POP_SILENT_FAMILY.includes(product.id)
  const family = isSilent ? POP_SILENT_FAMILY : POP_AIR_FAMILY

  const gallery = [product.image, ...EXTRA_SHOTS[isSilent ? 'silent' : 'air']]
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0])
  const [color, setColor] = useState(0)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  const price = product.id === 'pop-air' ? POP_AIR_PAGE.price : product.price
  const colors = POP_AIR_PAGE.colors
  const paginate = (d: number) => setSlide(([i]) => [(i + d + gallery.length) % gallery.length, d])

  const addToCart = () => {
    dispatch({
      type: 'add',
      item: {
        productId: product.id,
        name: `${product.name} case`,
        variant: colors[color].name,
        price,
        image: product.id === 'pop-air' ? 'a77ec75f' : product.image,
      },
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Page solid>
      <div className={s.layout}>
        {/* Gallery */}
        <div className={s.left}>
          <div className={s.gallery}>
            <button type="button" className={s.galleryArrow} onClick={() => paginate(-1)} aria-label="Previous image">
              <Icon name="arrow-left" />
            </button>
            <div className={s.stage}>
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={slide}
                  className={`${s.slide} ${slide === 0 ? s.render : ''}`}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 80 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } }}
                  exit={{ opacity: 0, x: dir * -80, transition: { duration: 0.3, ease: EASE } }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) paginate(1)
                    else if (info.offset.x > 60) paginate(-1)
                  }}
                >
                  <Img
                    src={gallery[slide]}
                    fit={slide === 0 ? 'contain' : 'cover'}
                    tone={slide === 0 ? 'light' : 'dark'}
                    eager
                    className={slide === 0 ? '' : s.photo}
                    crop={slide === 0 && product.id === 'pop-air' ? CROPS.gallery : undefined}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <button type="button" className={s.galleryArrow} onClick={() => paginate(1)} aria-label="Next image">
              <Icon name="arrow-right" />
            </button>
          </div>
          <div className={s.pagination}>
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                className={`${s.pageDot} ${i === slide ? s.pageDotActive : ''}`}
                onClick={() => setSlide([i, i > slide ? 1 : -1])}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className={s.right}>
          <div className={s.panel}>
            <motion.div className={s.intro} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
              <div className={s.titlePrice}>
                <h1 className="t-title-2">
                  {product.name} <span className="t-secondary">case</span>
                </h1>
                <p className="t-title-4">{formatKr(price)}</p>
              </div>
              <p className="t-body-1">
                {isSilent
                  ? 'Pop Silent is quietly stylish and ideal for mixed use, productivity, and lighter gaming.'
                  : POP_AIR_PAGE.description}
              </p>
            </motion.div>

            <div className={s.group}>
              <p className="t-title-4">
                <span className="t-secondary">Choose your</span> model
              </p>
              <div className={s.models}>
                {family.map(fid => (
                  <button
                    key={fid}
                    type="button"
                    className={`${s.model} ${fid === product.id ? s.modelActive : ''}`}
                    onClick={() => fid !== product.id && navigate(`/product/${fid}`, { replace: true })}
                  >
                    {PRODUCTS[fid].name}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.group}>
              <p className="t-title-4">
                <span className="t-secondary">Pick up your favourite</span> color:{' '}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={colors[color].name}
                    className={s.colorName}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {colors[color].name}
                  </motion.span>
                </AnimatePresence>
              </p>
              <Swatches swatches={colors} active={color} onChange={setColor} size="md" />
            </div>

            <Accordion
              items={[
                { id: 'specifications', title: 'Specifications', content: <SpecGrid specs={SPECIFICATIONS} columns={1} /> },
                { id: 'compatibility', title: 'Compatibility', content: <SpecGrid specs={COMPATIBILITY} columns={1} /> },
                { id: 'dimensions', title: 'Dimensions', content: <SpecGrid specs={DIMENSIONS} columns={1} /> },
                { id: 'other', title: 'Other', content: <SpecGrid specs={OTHER} columns={1} /> },
              ]}
            />

            <div className={s.reviews}>
              <Reviews />
            </div>

            <div className={s.compatible}>
              <p className="t-title-4">
                Compatible models <span className="t-secondary">for your {product.name}</span>
              </p>
              <div className={s.compatibleList}>
                {COMPATIBLE.slice(0, 3).map((cid, i) => (
                  <ProductCard key={i} product={PRODUCTS[cid]} tall />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky purchase bar */}
          <div className={s.buyBar}>
            <Button block onClick={addToCart} className={s.addBtn}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? 'added' : 'add'}
                  className={s.addLabel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {added ? (
                    <>
                      <Icon name="check" size={20} /> Added to cart
                    </>
                  ) : (
                    'Add to cart'
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
            <button type="button" className={`${s.like} ${liked ? s.liked : ''}`} onClick={() => setLiked(l => !l)} aria-pressed={liked} aria-label="Save to wishlist">
              <motion.span key={String(liked)} initial={{ scale: liked ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                <Icon name="heart" />
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}

import { COMPATIBLE, PRODUCTS } from '../data/catalog'
import { ProductCard } from './ProductCard'
import { RevealGroup, RevealItem } from './Reveal'
import s from './Compatible.module.css'

/** Figma › Compatible models: title + horizontally scrolling product cards. */
export function Compatible() {
  return (
    <section className={s.section}>
      <h2 className="t-title-2">Compatible models</h2>
      <RevealGroup className={s.row}>
        {COMPATIBLE.map((id, i) => (
          <RevealItem key={i} className={s.item}>
            <ProductCard product={PRODUCTS[id]} to="/product/pop-air" />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

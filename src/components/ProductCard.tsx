import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/catalog'
import { Img } from './Img'
import { Swatches } from './Swatches'
import s from './ProductCard.module.css'

type Props = { product: Product; to?: string; className?: string; tall?: boolean }

/** Figma › Cards › Product card (Desktop). */
export function ProductCard({ product, to = '/product/pop-air', className, tall }: Props) {
  const [swatch, setSwatch] = useState(0)
  return (
    <Link to={to} className={`${s.card} ${tall ? s.tall : ''} ${className ?? ''}`}>
      <div className={s.title}>
        <h3 className="t-title-4">{product.name}</h3>
        <p className="t-body-1">
          {product.from && <span>From </span>}
          {product.price.toLocaleString('sv-SE').replace(/ /g, ' ')} KR
        </p>
      </div>
      <div className={s.media}>
        <div className={s.image}>
          <Img src={product.image} fit="contain" alt={product.name} />
        </div>
        <Swatches swatches={product.swatches} active={swatch} onChange={setSwatch} extra={product.extraSwatches} />
      </div>
    </Link>
  )
}

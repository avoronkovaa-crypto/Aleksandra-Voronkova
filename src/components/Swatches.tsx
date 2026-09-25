import type { Swatch } from '../data/catalog'
import s from './Swatches.module.css'

type Props = {
  swatches: Swatch[]
  active: number
  onChange?: (i: number) => void
  size?: 'sm' | 'md'
  extra?: number
  className?: string
}

/** Figma › Cards › Color indicator (sm 20px / md 24px; active, default, not available). */
export function Swatches({ swatches, active, onChange, size = 'sm', extra, className }: Props) {
  return (
    <div className={`${s.row} ${s[size]} ${className ?? ''}`} role="radiogroup" aria-label="Colour">
      {swatches.map((sw, i) => {
        const unavailable = sw.available === false
        const bg = Array.isArray(sw.color)
          ? `linear-gradient(135deg, ${sw.color[0]} 0 50%, ${sw.color[1]} 50% 100%)`
          : sw.color
        const light = !Array.isArray(sw.color) && ['#ffffff', '#fff'].includes(sw.color.toLowerCase())
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i === active}
            aria-label={`${sw.name}${unavailable ? ' (sold out)' : ''}`}
            title={sw.name}
            disabled={unavailable}
            className={`${s.swatch} ${i === active ? s.active : ''} ${unavailable ? s.unavailable : ''}`}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onChange?.(i)
            }}
          >
            <span className={`${s.dot} ${light ? s.light : ''}`} style={{ background: bg }} />
          </button>
        )
      })}
      {extra ? <span className={`t-foot-1 ${s.extra}`}>+{extra}</span> : null}
    </div>
  )
}

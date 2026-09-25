import { useState, type CSSProperties } from 'react'
import { img } from '../lib/assets'
import s from './Img.module.css'

type Props = {
  /** Short Figma image hash (see src/lib/assets.ts). */
  src: string
  alt?: string
  className?: string
  /** `cover` for photography, `contain` for product renders. */
  fit?: 'cover' | 'contain'
  position?: string
  /** Placeholder tone used until the asset is fetched from Figma. */
  tone?: 'light' | 'dark'
  style?: CSSProperties
  eager?: boolean
}

/**
 * Image slot. Renders the Figma asset; if it hasn't been downloaded yet
 * (`npm run fetch-assets`), a quiet tonal placeholder keeps the layout intact.
 */
export function Img({ src, alt = '', className, fit = 'cover', position, tone = 'light', style, eager }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading')
  return (
    <span className={`${s.wrap} ${className ?? ''}`} data-tone={tone} data-state={state} style={style}>
      {state !== 'missing' && (
        <img
          src={img(src)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          style={{ objectFit: fit, objectPosition: position }}
          onLoad={() => setState('ok')}
          onError={() => setState('missing')}
        />
      )}
    </span>
  )
}

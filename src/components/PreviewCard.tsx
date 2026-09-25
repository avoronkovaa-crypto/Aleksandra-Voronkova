import { Link } from 'react-router-dom'
import type { Preview } from '../data/catalog'
import { Img } from './Img'
import { CaretLink } from './Button'
import { useToast, NOT_IN_PROTOTYPE } from './Toast'
import s from './PreviewCard.module.css'

/**
 * Figma › Cards › Preview card.
 * Small: product render on grey → hover cross-fades to the lifestyle photo.
 * Large: photo/video always visible → hover reveals "Learn more".
 */
export function PreviewCard({ item }: { item: Preview }) {
  const toast = useToast()
  const cls = `${s.card} ${item.large ? s.large : s.small} hover-parent`
  const body = (
    <>
      {item.photo && (
        <div className={s.photo}>
          <Img src={item.photo} tone="dark" />
        </div>
      )}
      {item.render && (
        <div className={s.render}>
          <Img src={item.render} fit="contain" />
        </div>
      )}
      <div className={s.shade} />
      <div className={s.text}>
        <p className="t-title-4">{item.title}</p>
        <div className={s.more}>
          <CaretLink tone="light">Learn more</CaretLink>
        </div>
      </div>
    </>
  )
  return item.to ? (
    <Link to={item.to} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" className={cls} onClick={() => toast(NOT_IN_PROTOTYPE)}>
      {body}
    </button>
  )
}

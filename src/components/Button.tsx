import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import s from './Button.module.css'

/* ------------------------------------------------------------------ */
/* Solid pill button — Figma › Button › Secondary / Tertiary           */
/* ------------------------------------------------------------------ */
type Variant = 'secondary' | 'tertiary' | 'invert'
type Size = 'lg' | 'md' | 'sm'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: IconName
  block?: boolean
}

export const buttonClass = (variant: Variant = 'secondary', size: Size = 'lg', block?: boolean) =>
  `${s.btn} ${s[variant]} ${s[size]} ${block ? s.block : ''}`

/** Router link that looks like a solid pill button. */
export function ButtonLink({
  variant = 'secondary',
  size = 'lg',
  icon,
  block,
  className,
  children,
  ...rest
}: LinkProps & { variant?: Variant; size?: Size; icon?: IconName; block?: boolean }) {
  return (
    <Link className={`${buttonClass(variant, size, block)} ${className ?? ''}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 24} />}
      <span className={s.label}>{children}</span>
    </Link>
  )
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'secondary', size = 'lg', icon, block, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${buttonClass(variant, size, block)} ${className ?? ''}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 24} />}
      <span className={s.label}>{children}</span>
    </button>
  )
})

/* ------------------------------------------------------------------ */
/* "Text CTA →" — Figma › Button › Primary sm icon (default / hover)   */
/* ------------------------------------------------------------------ */
type ArrowProps = { children: ReactNode; className?: string; invert?: boolean } & (
  | ({ to: LinkProps['to'] } & Omit<LinkProps, 'to' | 'className' | 'children'>)
  | ({ to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
)

export function ArrowButton(props: ArrowProps) {
  const { children, className, invert, ...rest } = props
  const cls = `${s.arrow} ${invert ? s.arrowInvert : ''} ${className ?? ''}`
  const inner = (
    <>
      <span className={s.arrowText}>{children}</span>
      <span className={s.arrowPill}>
        <Icon name="arrow-right" />
      </span>
    </>
  )
  if ('to' in rest && rest.to !== undefined) {
    return (
      <Link className={cls} {...(rest as LinkProps)}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* "Learn more >" — Figma › Button › Link                               */
/* ------------------------------------------------------------------ */
export function CaretLink({
  children,
  className,
  tone = 'dark',
  small,
  ...rest
}: { children: ReactNode; className?: string; tone?: 'dark' | 'light'; small?: boolean } & ButtonHTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`${s.caret} ${tone === 'light' ? s.caretLight : ''} ${small ? s.caretSmall : ''} ${className ?? ''}`} {...rest}>
      <span>{children}</span>
      <Icon name="caret-right" size={16} />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Round arrow — Figma › Carousel arrow (default / hover)              */
/* ------------------------------------------------------------------ */
export function RoundArrow({
  dir,
  className,
  ...rest
}: { dir: 'left' | 'right' } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${s.round} ${className ?? ''}`} aria-label={dir === 'left' ? 'Previous' : 'Next'} {...rest}>
      <Icon name={dir === 'left' ? 'caret-left' : 'caret-right'} />
    </button>
  )
}

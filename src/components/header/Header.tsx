import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from '../Logo'
import { Icon } from '../Icon'
import { useStore, totals } from '../../state/store'
import { MegaMenu, CommunityMenu } from './MegaMenu'
import { SearchField, SearchResults } from './Search'
import { LanguageSwitch } from './LanguageSwitch'
import { PrototypeNav } from '../PrototypeNav'
import { useToast, NOT_IN_PROTOTYPE } from '../Toast'
import s from './Header.module.css'

type Menu = 'products' | 'community' | null

const NAV: { id: string; label: string; menu?: Menu }[] = [
  { id: 'products', label: 'Products', menu: 'products' },
  { id: 'community', label: 'Community', menu: 'community' },
  { id: 'about', label: 'About' },
  { id: 'support', label: 'Support' },
]

/** Pages whose first screen is a full-bleed dark hero → header starts transparent. */
const OVERLAY_ROUTES = ['/', '/cases', '/cases/pop-air', '/pop-series', '/pop-air']

export function Header() {
  const { pathname } = useLocation()
  const { state, dispatch } = useStore()
  const { count } = totals(state)

  const [menu, setMenu] = useState<Menu>(null)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const openTimer = useRef<number | undefined>(undefined)
  /** True when the open menu was opened by a click (a second click closes it). */
  const pinned = useRef(false)
  const toast = useToast()

  const searchOpen = query.trim().length > 0 && (searchFocused || menu === null)
  const overlayRoute = OVERLAY_ROUTES.includes(pathname)
  const solid = !overlayRoute || scrolled || menu !== null || searchOpen
  const dimmed = menu !== null || searchOpen

  // Close everything on navigation
  useEffect(() => {
    setMenu(null)
    setQuery('')
    setSearchFocused(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Lock page scroll while an overlay panel is open
  useEffect(() => {
    document.documentElement.style.overflow = dimmed ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [dimmed])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null)
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openMenu = (m: Menu) => {
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    // small intent delay avoids flicker when the pointer just passes over the nav
    openTimer.current = window.setTimeout(() => {
      setMenu(m)
      if (m) setQuery('')
    }, menu ? 0 : 90)
  }
  const scheduleClose = () => {
    window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => {
      pinned.current = false
      setMenu(null)
    }, 160)
  }
  const cancelClose = () => window.clearTimeout(closeTimer.current)

  return (
    <>
      <header
        className={`${s.header} ${solid ? s.solid : s.transparent}`}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <div className={s.topBar}>
          <PrototypeNav />
          <p className="t-foot-2">Free shipping over 3000kr</p>
          <LanguageSwitch className={s.lang} />
        </div>

        <div className={s.main}>
          <div className={s.brand}>
            <Link to="/" className={s.logo} aria-label="Fractal — home">
              <Logo />
            </Link>
            <p className={`t-foot-1 ${s.tagline}`}>Full functionality and aesthetic appeal</p>
          </div>

          <div className={s.right}>
            <nav className={s.nav} aria-label="Main">
              {NAV.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`${s.tab} ${menu && menu === item.menu ? s.tabActive : ''}`}
                  onMouseEnter={() => (item.menu ? openMenu(item.menu) : openMenu(null))}
                  onFocus={() => item.menu && setMenu(item.menu)}
                  onClick={() => {
                    if (!item.menu) return toast(NOT_IN_PROTOTYPE)
                    window.clearTimeout(openTimer.current)
                    window.clearTimeout(closeTimer.current)
                    if (menu === item.menu && pinned.current) {
                      pinned.current = false
                      setMenu(null)
                    } else {
                      pinned.current = true
                      setMenu(item.menu)
                      setQuery('')
                    }
                  }}
                  aria-expanded={item.menu ? menu === item.menu : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className={s.actions} onMouseEnter={() => openMenu(null)}>
              <SearchField
                value={query}
                onChange={v => {
                  setQuery(v)
                  setMenu(null)
                }}
                onFocusChange={setSearchFocused}
              />
              <button type="button" className={s.iconTab} aria-label="Account">
                <Icon name="user" />
              </button>
              <button
                type="button"
                className={s.iconTab}
                aria-label={`Cart, ${count} items`}
                onClick={() => dispatch({ type: 'open', open: true })}
              >
                <Icon name="bag" />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={count}
                    className={`t-foot-1 ${s.count}`}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    ({count})
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menu === 'products' && <MegaMenu key="products" onNavigate={() => setMenu(null)} />}
          {menu === 'community' && <CommunityMenu key="community" />}
          {searchOpen && menu === null && (
            <SearchResults key="search" query={query} onClear={() => setQuery('')} />
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {dimmed && (
          <motion.div
            className={s.dim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => {
              setMenu(null)
              setQuery('')
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

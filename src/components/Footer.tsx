import { Link } from 'react-router-dom'
import { FooterLogo } from './Logo'
import { Icon } from './Icon'
import { ArrowButton } from './Button'
import { Reveal } from './Reveal'
import s from './Footer.module.css'

const COLUMNS: { title: string; links: { label: string; to?: string }[] }[] = [
  {
    title: 'Products',
    links: [
      { label: 'Cases', to: '/cases' },
      { label: 'Fans' },
      { label: 'Power Supplies' },
      { label: 'Water Cooling' },
      { label: 'Accessories' },
    ],
  },
  { title: 'Community', links: [{ label: 'Creator Programm' }, { label: 'ModHQ' }] },
  {
    title: 'Support',
    links: [
      { label: 'Downloads' },
      { label: 'Knowledge Base' },
      { label: 'Create Support Ticket' },
      { label: 'Warranty Information' },
      { label: 'Contact Us' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story' },
      { label: 'Design Process' },
      { label: 'Timeline' },
      { label: 'Values' },
      { label: 'Careers' },
      { label: 'News' },
      { label: 'Investors' },
    ],
  },
]

/** Figma › Main Navigation › Footer (Breakpoint=Desktop). */
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.top}>
        <div className={s.subscribe}>
          <p className="t-title-4">Don't miss out – subscribe to our email list</p>
          <ArrowButton invert>Subscribe</ArrowButton>
        </div>

        <nav className={s.columns} aria-label="Footer">
          {COLUMNS.map(col => (
            <div key={col.title} className={s.column}>
              <p className={`t-foot-1 ${s.heading}`}>{col.title}</p>
              <ul>
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className={`t-foot-1 ${s.link}`}>
                        {l.label}
                      </Link>
                    ) : (
                      <a href="#" className={`t-foot-1 ${s.link}`} onClick={e => e.preventDefault()}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={s.hq}>
          <p className={`t-foot-1 ${s.heading}`}>Global Headquarters</p>
          <address className="t-foot-1">
            Fractal Gaming AB
            <br />
            Victor Hasselblads gata 16A
            <br />
            421 31 Västra Frölunda
            <br />
            Sweden
          </address>
          <div className={s.social}>
            {(['youtube', 'facebook', 'x', 'instagram'] as const).map(n => (
              <a key={n} href="#" aria-label={n} className={s.socialLink} onClick={e => e.preventDefault()}>
                <Icon name={n} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <Reveal className={s.bigLogo} y={40}>
        <FooterLogo />
      </Reveal>

      <div className={`t-foot-1 ${s.legal}`}>
        <span>Copyright 2024 Fractal Design</span>
        <a href="#" onClick={e => e.preventDefault()}>
          Warranty information
        </a>
        <a href="#" onClick={e => e.preventDefault()}>
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Mail, Menu, Moon, Sun, X } from 'lucide-react'
import { person } from '../data/content'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#thinklounge', label: 'Think Lounge' },
  { href: '#press', label: 'Press' },
  { href: '#beechnut', label: 'Beech-Nut' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => (typeof document === 'undefined' ? 'light' : readTheme()))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the open menu; close on Escape or when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 821px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode etc. */
    }
  }

  return (
    <>
      <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <a href="#top" className="brand" aria-label="Back to top" onClick={() => setOpen(false)}>
            <span className="dot" />
            {person.name}
          </a>
          <nav className="nav-links" aria-label="Sections">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <a className="btn nav-resume" href={person.resumeUrl} target="_blank" rel="noopener">
              Resume <ArrowUpRight />
            </a>
            <button
              className="theme-toggle menu-btn"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.nav
              className="menu-links"
              aria-label="Sections"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              {links.map((l, i) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  <span className="menu-idx">0{i + 1}</span>
                  {l.label}
                </a>
              ))}
            </motion.nav>
            <motion.div
              className="menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <a className="btn primary" href={person.resumeUrl} target="_blank" rel="noopener">
                Resume (PDF) <ArrowUpRight />
              </a>
              <a className="btn" href={`mailto:${person.email}`}>
                <Mail /> Email
              </a>
              <a className="btn" href={person.linkedin} target="_blank" rel="noopener">
                LinkedIn <ArrowUpRight />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

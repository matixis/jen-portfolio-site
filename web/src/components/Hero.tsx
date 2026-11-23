import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { hero, person, portrait } from '../data/content'

export function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 70])
  const yImg = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 30])
  const o = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.2])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden>
        <div className="glow" />
        <div className="glow green" />
      </div>

      <div className="wrap hero-grid">
        <motion.div className="hero-copy" style={{ y, opacity: o }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            {person.name}, {person.credential} · {person.tagline}
          </motion.p>

          <h1 className="display">
            {hero.lines.map((line, i) => (
              <span className="line" key={line}>
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.12 }}
                >
                  {i === hero.lines.length - 1 ? <em>{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.6 }}
          >
            <p className="lede">{hero.lede}</p>
            <div className="hero-meta">
              {hero.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="hero-actions">
              <a className="btn primary" href="#thinklounge">
                See the work <ArrowDown />
              </a>
              <a className="btn" href={person.linkedin} target="_blank" rel="noopener">
                LinkedIn <ArrowUpRight />
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.figure
          className="hero-portrait"
          style={{ y: yImg }}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.35 }}
        >
          <img src={portrait.src} alt={portrait.alt} width={960} height={1440} fetchPriority="high" decoding="async" />
          <figcaption>{portrait.caption}</figcaption>
        </motion.figure>
      </div>

      <div className="scroll-cue" aria-hidden>
        Scroll <i />
      </div>
    </section>
  )
}

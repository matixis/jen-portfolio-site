import { brands, intro, lounge, stats, workIndex } from '../data/content'
import { ArrowDown } from 'lucide-react'
import { Reveal } from './Reveal'

export function Marquee() {
  const items = [...brands, ...brands]
  return (
    <div className="marquee" aria-label="Brands worked on">
      <div className="marquee-track">
        {items.map((b, i) => (
          <span className="marquee-item" key={`${b}-${i}`}>
            {b}
            <i aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Stats() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(56px, 8vw, 110px)' }}>
      <Reveal className="wrap">
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 80}>
              <div className="num">
                {s.value}
                {s.sup && <sup>{s.sup}</sup>}
              </div>
              <div className="label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export function Intro() {
  return (
    <section className="section intro" id="about" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal as="figure" className="lounge">
          <img src={lounge.src} alt={lounge.alt} width={1800} height={650} loading="lazy" decoding="async" />
          <figcaption>{lounge.caption}</figcaption>
        </Reveal>
        <div className="intro-grid">
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 className="h2" style={{ marginTop: 18 }}>
              {intro.heading}
            </h2>
            <div style={{ marginTop: 28 }}>
              {intro.body.map((p) => (
                <p className="body" key={p}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="intro-list">
              {intro.pillars.map((p, i) => (
                <li key={p.title}>
                  <span className="idx">0{i + 1}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function WorkIndex() {
  return (
    <section className="section" id="work" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2 className="h2">
            Three stories, <em>one through-line:</em> insight to outcome.
          </h2>
        </Reveal>
        <Reveal className="work-index">
          {workIndex.map((w) => (
            <a className="work-row" href={`#${w.id}`} key={w.id}>
              <span className="idx">{w.n}</span>
              <span className="title">
                {w.title}
                <small>{w.kicker}</small>
              </span>
              <span className="desc">{w.desc}</span>
              <span className="arrow">
                <ArrowDown size={18} />
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

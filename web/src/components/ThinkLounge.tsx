import { press, thinkLounge as tl } from '../data/content'
import { ArrowUpRight } from 'lucide-react'
import { BrowserFrame, PhoneFrame } from './Frames'
import { Reveal } from './Reveal'

export function ThinkLounge() {
  return (
    <section className="section case tl" id="thinklounge">
      <div className="wrap">
        <Reveal className="case-head">
          <div>
            <p className="eyebrow">{tl.eyebrow}</p>
            <h2 className="h2" style={{ marginTop: 18 }}>
              {tl.title}
            </h2>
          </div>
          <div style={{ display: 'grid', gap: 26 }}>
            <span className="tl-logo-wrap" style={{ justifySelf: 'start' }}>
              <img className="tl-logo" src="/thinklounge/logo.png" alt="Think Lounge: Cowork, Café, Childcare" />
            </span>
            <p className="lede">{tl.summary}</p>
            <dl className="case-facts">
              {tl.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal className="tl-metrics">
          {tl.metrics.map((m) => (
            <div key={m.label}>
              <div className="num">{m.value}</div>
              <div className="label">{m.label}</div>
            </div>
          ))}
        </Reveal>

        <div className="tl-story">
          <div className="sticky">
            <Reveal>
              <p className="eyebrow muted">Concept to buildout</p>
              <h3 className="h3" style={{ marginTop: 14, maxWidth: '20ch' }}>
                Every hat, in roughly the order they went on.
              </h3>
              <div className="hats">
                {tl.hats.map((h) => (
                  <span className="pill" key={h}>
                    {h}
                  </span>
                ))}
              </div>
              <blockquote className="quote" style={{ marginTop: 40 }}>
                “{tl.quote.text}”<cite>{tl.quote.cite}</cite>
              </blockquote>
            </Reveal>
          </div>
          <ol className="steps">
            {tl.steps.map((s, i) => (
              <Reveal as="li" className="step" key={s.title} delay={i * 40}>
                <span className="n">{s.n}</span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Website */}
        <div className="subsection">
          <Reveal className="subsection-head">
            <h3 className="h3">{tl.website.heading}</h3>
            <p className="body">{tl.website.text}</p>
          </Reveal>
          <div className="gallery" style={{ marginTop: 0 }}>
            {tl.website.shots.map((s, i) => (
              <Reveal as="figure" className={`shot ${s.w} ${s.tall ? 'tall' : ''}`} key={s.src} delay={(i % 3) * 80} style={{ margin: 0 }}>
                <BrowserFrame src={s.src} alt={`${s.title} page of mythinklounge.com`} scrolls={s.scrolls} tall={s.tall} />
                <figcaption>
                  <b>{s.title}</b>
                  <span>{s.note}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>

        {/* App */}
        <div className="subsection grid-2" style={{ alignItems: 'center' }}>
          <Reveal>
            <p className="eyebrow muted">iOS & Android</p>
            <h3 className="h3" style={{ marginTop: 14 }}>
              {tl.app.heading}
            </h3>
            <p className="body" style={{ marginTop: 18 }}>
              {tl.app.text}
            </p>
            <div className="pills" style={{ marginTop: 24 }}>
              {['Product requirements', 'Booking flow design', 'Store compliance', 'Support flow'].map((p) => (
                <span className="pill" key={p}>
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal className="phones" delay={120}>
            {tl.app.shots.map((s) => (
              <PhoneFrame key={s.src} src={s.src} alt={`Think Lounge app: ${s.title}`} caption={s.title} />
            ))}
          </Reveal>
        </div>

        {/* Blog */}
        <div className="subsection">
          <Reveal className="subsection-head">
            <h3 className="h3">{tl.blog.heading}</h3>
            <p className="body">{tl.blog.text}</p>
          </Reveal>
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <Reveal>
              <ul className="blog-list" style={{ gridTemplateColumns: '1fr' }}>
                {tl.blog.posts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="phones" style={{ alignItems: 'start' }}>
                {tl.website.mobile.map((m) => (
                  <PhoneFrame key={m.src} src={m.src} alt={`mythinklounge.com on mobile: ${m.title}`} caption={m.title} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Press */}
        <div className="subsection" id="press">
          <Reveal className="subsection-head">
            <h3 className="h3">{press.heading}</h3>
            <p className="body">{press.text}</p>
          </Reveal>
          <div className="press">
            {press.items.map((p, i) => (
              <Reveal as="article" className="press-card" key={p.url} delay={i * 100}>
                <a href={p.url} target="_blank" rel="noopener">
                  <div className="press-meta">
                    <span className="outlet">{p.outlet}</span>
                    <span>
                      {p.kind} · {p.date}
                    </span>
                  </div>
                  <h4>{p.title}</h4>
                  <p className="press-quote">“{p.quote}”</p>
                  <span className="press-link">
                    Read <ArrowUpRight size={16} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

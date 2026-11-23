import { beechNut as bn, moreWork } from '../data/content'
import { Reveal } from './Reveal'

export function BeechNut() {
  return (
    <section className="section case" id="beechnut">
      <div className="wrap">
        <Reveal className="case-head">
          <div>
            <p className="eyebrow">{bn.eyebrow}</p>
            <h2 className="h2" style={{ marginTop: 18 }}>
              {bn.title}
            </h2>
          </div>
          <div style={{ display: 'grid', gap: 26 }}>
            <p className="lede">{bn.summary}</p>
            <dl className="case-facts">
              {bn.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="bn-cards">
          {bn.initiatives.map((c, i) => (
            <Reveal as="article" className="card" key={c.title} delay={(i % 2) * 100}>
              <span className="idx">{c.n}</span>
              <span className="tag">{c.tag}</span>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal style={{ marginTop: 40 }}>
          <div className="pills">
            {bn.extras.map((e) => (
              <span className="pill" key={e}>
                {e}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function MoreWork() {
  return (
    <section className="section" id="more" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Case study 03 · Range</p>
          <h2 className="h2">
            Global launches, local events, <em>and</em> regulated categories.
          </h2>
        </Reveal>
        <div className="more">
          {moreWork.map((w, i) => (
            <Reveal as="article" className="card" key={w.company} delay={i * 100}>
              <h4>{w.company}</h4>
              <div className="meta">
                <span>{w.role}</span>
                <span>·</span>
                <span>{w.when}</span>
              </div>
              <ul>
                {w.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

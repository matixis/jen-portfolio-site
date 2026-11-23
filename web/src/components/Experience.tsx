import { ArrowUpRight, Mail } from 'lucide-react'
import { contact, education, experience, person, toolbox } from '../data/content'
import { Reveal } from './Reveal'

export function Experience() {
  return (
    <section className="section" id="experience" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="h2">
            A decade across CPG, consumer tech, <em>pharma,</em> and a startup of her own.
          </h2>
        </Reveal>
        <Reveal className="timeline">
          {experience.map((e) => (
            <div className={`tl-row ${e.quiet ? 'quiet' : ''}`} key={`${e.org}-${e.when}`}>
              <div className="when">{e.when}</div>
              <div className="who">
                <strong>{e.org}</strong>
                <span>{e.role}</span>
              </div>
              <div className="what">{e.what}</div>
            </div>
          ))}
          {education.map((e) => (
            <div className="tl-row quiet" key={e.school}>
              <div className="when">{e.year}</div>
              <div className="who">
                <strong>{e.school}</strong>
                <span>{e.degree}</span>
              </div>
              <div className="what" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function Toolbox() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head" style={{ marginBottom: 40 }}>
          <p className="eyebrow">Toolbox</p>
        </Reveal>
        <div className="toolbox">
          {toolbox.map((g, i) => (
            <Reveal className="group" key={g.title} delay={i * 80}>
              <h4>{g.title}</h4>
              <div className="pills">
                {g.items.map((it) => (
                  <span className="pill" key={it}>
                    {it}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="glow" aria-hidden />
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="display big" style={{ marginTop: 20 }}>
            {contact.heading[0]}
            <br />
            <em>{contact.heading[1]}</em>
          </h2>
          <p className="lede" style={{ marginTop: 28 }}>
            {contact.text}
          </p>
          <div className="contact-links">
            <a className="btn primary" href={`mailto:${person.email}`}>
              <Mail /> {person.email}
            </a>
            <a className="btn" href={person.linkedin} target="_blank" rel="noopener">
              LinkedIn <ArrowUpRight />
            </a>
            <a className="btn" href={person.resumeUrl} target="_blank" rel="noopener">
              Resume (PDF) <ArrowUpRight />
            </a>
          </div>
        </Reveal>
        <footer className="footer" style={{ marginTop: 'clamp(64px, 9vw, 120px)' }}>
          <span>
            © {new Date().getFullYear()} {person.name}. {person.location}.
          </span>
          <span>Think Lounge® materials shown are Jen’s own work.</span>
        </footer>
      </div>
    </section>
  )
}

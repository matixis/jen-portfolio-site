type BrowserProps = {
  src: string
  alt: string
  url?: string
  scrolls?: boolean
  tall?: boolean
}

/** A macOS-style browser chrome around a screenshot. `scrolls` makes a tall capture pan on hover. */
export function BrowserFrame({ src, alt, url = 'mythinklounge.com', scrolls, tall }: BrowserProps) {
  return (
    <div className={`browser ${scrolls || tall ? 'scrolls' : ''}`}>
      <div className="browser-bar" aria-hidden>
        <i /> <i /> <i />
        <span className="url">https://{url}</span>
      </div>
      <div className="browser-view">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}

type PhoneProps = { src: string; alt: string; caption?: string }

export function PhoneFrame({ src, alt, caption }: PhoneProps) {
  return (
    <figure className="phone" style={{ margin: 0 }}>
      <div className="screen">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

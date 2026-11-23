import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: keyof HTMLElementTagNameMap
  className?: string
  delay?: number
  style?: CSSProperties
  id?: string
}

/** Fades content up once it scrolls into view. CSS-only transition, IntersectionObserver trigger. */
export function Reveal({ children, as = 'div', className = '', delay = 0, style, id }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('in')
            io.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  )
}

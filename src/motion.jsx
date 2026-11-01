import { useEffect, useRef } from 'react'

const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One reveal for the whole page: anything marked data-reveal fades up once as it enters.
// Hidden only under the .js class main.jsx sets, so the page reads without scripting.
export function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    if (prefersStill() || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// A measured figure that counts up from zero the first time it is seen.
// The server renders the final value, so the number is right before any script runs.
export function CountUp({ value, unit }) {
  const ref = useRef(null)
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value)

  useEffect(() => {
    const el = ref.current
    if (!el || !match || prefersStill()) return
    const target = parseFloat(match[1])
    const decimals = (match[1].split('.')[1] || '').length
    if (target === 0) return
    let raf = 0
    el.textContent = (0).toFixed(decimals)
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 1100)
          const eased = 1 - Math.pow(1 - p, 4)
          el.textContent = (target * eased).toFixed(decimals)
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!match) return <>{value}</>
  return (
    <>
      <span ref={ref}>{match[1]}</span>
      {match[2]}
      {unit && <span className="u">&thinsp;{unit}</span>}
    </>
  )
}

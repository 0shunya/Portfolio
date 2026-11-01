import { useEffect, useRef, useState } from 'react'

// The hero's argument drawn in points: each cycle the points scatter into noise
// (the model proposes), then snap into the shape of one of the five products
// (code decides). Lime marks the part the check verified.

const N = 2600

// Each shape is a list of strokes: [x1, y1, x2, y2, found] lines, or
// { rect: [x, y, w, h], found } fills. Coordinates are in a 2 by 1.4 box centred on 0.
const zigzag = (x0, x1, y, teeth) => {
  const out = []
  const step = (x1 - x0) / teeth
  for (let i = 0; i < teeth; i++) {
    const a = x0 + i * step
    out.push([a, y, a + step / 2, y + 0.05], [a + step / 2, y + 0.05, a + step, y])
  }
  return out
}

const shapes = [
  {
    name: 'AI Expense Tracker',
    short: 'Expenses',
    proof: '99.7% of key fields right',
    strokes: [
      [-0.42, -0.62, 0.42, -0.62], [-0.42, -0.62, -0.42, 0.56], [0.42, -0.62, 0.42, 0.56],
      ...zigzag(-0.42, 0.42, 0.56, 9),
      [-0.22, -0.48, 0.22, -0.48],
      [-0.32, -0.3, 0.1, -0.3], [-0.32, -0.18, 0.18, -0.18], [-0.32, -0.06, 0.04, -0.06], [-0.32, 0.06, 0.14, 0.06],
      [0.22, -0.3, 0.32, -0.3], [0.22, -0.18, 0.32, -0.18], [0.22, -0.06, 0.32, -0.06], [0.22, 0.06, 0.32, 0.06],
      [-0.32, 0.2, 0.32, 0.2],
      { rect: [-0.32, 0.28, 0.64, 0.1], found: true },
    ],
  },
  {
    name: 'AI Phone Receptionist',
    short: 'Receptionist',
    proof: '0 double bookings in 104 calls',
    strokes: [
      ...Array.from({ length: 15 }, (_, i) => {
        const x = -0.86 + i * 0.05
        const hgt = 0.08 + 0.42 * Math.abs(Math.sin(i * 0.9 + 0.4)) * Math.sin((i / 14) * Math.PI)
        return [x, -hgt, x, hgt]
      }),
      ...Array.from({ length: 5 }, (_, r) => [0.06, -0.5 + r * 0.25, 0.86, -0.5 + r * 0.25]),
      ...Array.from({ length: 6 }, (_, c) => [0.06 + c * 0.16, -0.5, 0.06 + c * 0.16, 0.5]),
      { rect: [0.4, -0.23, 0.12, 0.2], found: true },
    ],
  },
  {
    name: 'Deep Research Agent',
    short: 'Research',
    proof: '21 of 22 answers correct',
    strokes: (() => {
      const root = [0, -0.58]
      const mids = [[-0.56, -0.08], [0, -0.08], [0.56, -0.08]]
      const out = [{ rect: [-0.06, -0.64, 0.12, 0.12] }]
      for (const m of mids) {
        out.push([root[0], root[1], m[0], m[1]], { rect: [m[0] - 0.05, m[1] - 0.05, 0.1, 0.1] })
        for (const dx of [-0.17, 0.17]) {
          const leaf = [m[0] + dx, 0.46]
          out.push([m[0], m[1], leaf[0], leaf[1]], { rect: [leaf[0] - 0.05, leaf[1] - 0.05, 0.1, 0.1], found: true })
        }
      }
      return out
    })(),
  },
  {
    name: 'DMI',
    short: 'DMI',
    proof: 'Explainable skill matching',
    strokes: [
      [-0.72, 0.52, 0.72, 0.52], [-0.72, -0.6, -0.72, 0.52],
      ...[0.28, 0.42, 0.36, 0.6, 0.48].map((h, i) => ({ rect: [-0.6 + i * 0.26, 0.52 - h * 1.6, 0.16, h * 1.6], found: i === 3 })),
    ],
  },
  {
    name: 'NotebookLLM Lite',
    short: 'NotebookLLM',
    proof: 'Every answer cites its page',
    strokes: [
      [-0.38, -0.64, 0.24, -0.64], [0.24, -0.64, 0.38, -0.5], [0.38, -0.5, 0.38, 0.64], [0.38, 0.64, -0.38, 0.64], [-0.38, 0.64, -0.38, -0.64],
      ...[-0.46, -0.34, -0.22, 0.34, 0.46].map((y, i) => [-0.26, y, i % 2 ? 0.18 : 0.26, y]),
      { rect: [-0.28, -0.12, 0.56, 0.36], found: true },
    ],
  },
]

// Spread N points over a shape's strokes in proportion to their length or area.
function sample(strokes, seed) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const sizes = strokes.map((k) => (k.rect ? k.rect[2] * k.rect[3] * 9 : Math.hypot(k[2] - k[0], k[3] - k[1])))
  const total = sizes.reduce((a, b) => a + b, 0)
  const pts = []
  strokes.forEach((k, i) => {
    const n = i === strokes.length - 1 ? N - pts.length : Math.round((sizes[i] / total) * N)
    for (let j = 0; j < n && pts.length < N; j++) {
      if (k.rect) {
        const [x, y, w, h] = k.rect
        pts.push([x + rand() * w, y + rand() * h, !!k.found])
      } else {
        const t = rand()
        pts.push([k[0] + (k[2] - k[0]) * t, k[1] + (k[3] - k[1]) * t, !!k[4]])
      }
    }
  })
  return pts
}

const targets = shapes.map((sh, i) => sample(sh.strokes, 1234 + i * 977))
const HOLD = 3600
const SCATTER = 650
const SETTLE = 1000
const CYCLE = SCATTER + SETTLE + HOLD

export function ProofField() {
  const canvas = useRef(null)
  const jump = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const c = canvas.current
    const ctx = c.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Colours come from the theme's tokens, resolved by the browser.
    const probe = document.createElement('i')
    probe.style.display = 'none'
    document.body.append(probe)
    const resolve = (expr) => {
      probe.style.color = expr
      return getComputedStyle(probe).color
    }
    const ink = resolve('var(--point-mid)')
    const bright = resolve('var(--point-hi)')
    const found = resolve('var(--color-accent)')
    probe.remove()

    let w = 0
    let h = 0
    let dpr = 1
    const size = () => {
      const r = c.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
    }
    size()

    let seed = 99
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const noise = Array.from({ length: N }, () => [(rand() * 2 - 1) * 1.1, (rand() * 2 - 1) * 0.8])
    const cur = targets[0].map((p) => [p[0], p[1]])
    const from = cur.map((p) => [...p])
    let shape = 0
    let cycleStart = performance.now() - SCATTER - SETTLE

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    const go = (next, now) => {
      for (let i = 0; i < N; i++) from[i] = [cur[i][0], cur[i][1]]
      shape = next
      cycleStart = now
      setActive(next)
    }
    jump.current = (i) => {
      if (still) {
        shape = i
        for (let k = 0; k < N; k++) cur[k] = [targets[i][k][0], targets[i][k][1]]
        setActive(i)
        draw(performance.now(), true)
      } else go(i, performance.now())
    }

    function draw(now, settled) {
      const t = now - cycleStart
      const tgt = targets[shape]
      const scale = Math.min(w / 2.1, h / 1.55)
      const ox = w / 2
      const oy = h / 2
      // A slow tilt so the shape reads as a measured object, not a flat icon.
      const yaw = Math.sin(now / 5200) * 0.16
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const sweep = settled ? 9 : -1.2 + ((t - SCATTER) / SETTLE) * 2.6
      for (let i = 0; i < N; i++) {
        if (!settled) {
          // Stagger by index so the shape assembles rather than blinks into place.
          const lag = (i % 97) / 97 * 0.25
          if (t < SCATTER) {
            const k = ease(Math.min(1, t / SCATTER))
            cur[i][0] = from[i][0] + (noise[i][0] - from[i][0]) * k + Math.sin(now / 90 + i) * 0.004
            cur[i][1] = from[i][1] + (noise[i][1] - from[i][1]) * k + Math.cos(now / 110 + i) * 0.004
          } else {
            const k = ease(Math.max(0, Math.min(1, ((t - SCATTER) / SETTLE - lag) / (1 - lag))))
            cur[i][0] = noise[i][0] + (tgt[i][0] - noise[i][0]) * k
            cur[i][1] = noise[i][1] + (tgt[i][1] - noise[i][1]) * k
          }
        }
        const x = cur[i][0] * Math.cos(yaw)
        const z = cur[i][0] * Math.sin(yaw)
        const persp = 1 / (1 + z * 0.35)
        const sx = ox + x * scale * persp
        const sy = oy + cur[i][1] * scale * persp
        const lit = Math.max(0, 1 - Math.abs(cur[i][0] - sweep) / 0.1)
        const isFound = tgt[i][2] && (settled || t > SCATTER + SETTLE * 0.7)
        ctx.globalAlpha = isFound ? 0.95 : 0.55 + lit * 0.45
        ctx.fillStyle = isFound ? found : lit > 0.4 ? bright : ink
        const r = isFound ? 2 : 1.6
        ctx.fillRect(sx - r / 2, sy - r / 2, r, r)
      }
      ctx.globalAlpha = 1
    }

    if (still) {
      draw(performance.now(), true)
      const onResize = () => { size(); draw(performance.now(), true) }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    let raf = 0
    let last = 0
    let visible = true
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden || now - last < 30) return
      last = now
      if (now - cycleStart > CYCLE) go((shape + 1) % shapes.length, now)
      draw(now, false)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(c)
    const onResize = () => size()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <figure className="proof ticks">
      <canvas ref={canvas} className="proof__canvas" aria-hidden="true" />
      <figcaption className="proof__caption">
        <span className="proof__name">{shapes[active].name}</span>
        <span className="proof__fact">{shapes[active].proof}</span>
      </figcaption>
      <div className="proof__picker" role="group" aria-label="Show a product">
        {shapes.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className="proof__pick"
            aria-pressed={i === active}
            aria-label={`Show ${s.name}`}
            onClick={() => jump.current?.(i)}
          >
            {s.short}
          </button>
        ))}
      </div>
    </figure>
  )
}

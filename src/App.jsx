import { useEffect, useRef, useState } from 'react'
import { contact, experience, pipeline, projects, receptionistFacts, services } from './content.js'
import { CountUp, useReveal } from './motion.jsx'
import { ProofField } from './proof.jsx'

const mail = `mailto:${contact.email}`

// Public files live under the site's base path (/Portfolio/ on GitHub Pages).
const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')

// The poster is a real link to the file, so the film plays without scripting too;
// with scripting it swaps to the player in place and starts with sound.
function IntroFilm() {
  const [playing, setPlaying] = useState(false)
  const film = useRef(null)
  // Starts only after the visitor's own click, so sound is allowed.
  useEffect(() => {
    if (playing) film.current?.play()
  }, [playing])
  if (playing) {
    return (
      <video ref={film} controls playsInline poster={asset('/intro-poster.jpg')} width="1920" height="1080">
        <source src={asset('/intro.mp4')} type="video/mp4" />
      </video>
    )
  }
  return (
    <a
      className="film-play"
      href={asset('/intro.mp4')}
      onClick={(e) => {
        e.preventDefault()
        setPlaying(true)
      }}
    >
      <img src={asset('/intro-poster.jpg')} width="1920" height="1080" alt="" loading="lazy" />
      <span className="visually-hidden">Play the 78-second intro video</span>
    </a>
  )
}

// The project list with a pinned preview: the row under the pointer or focus shows its app.
function Work() {
  const [active, setActive] = useState(0)
  return (
    <div className="work__grid">
      <table className="work__table">
        <caption className="visually-hidden">Projects, their measured results and links</caption>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">What it proved</th>
            <th scope="col"><span className="visually-hidden">Links</span></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr
              key={p.name}
              data-reveal
              style={{ '--i': i }}
              data-active={i === active || undefined}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <th scope="row">{p.name}</th>
              <td>{p.result}</td>
              <td className="work__links">
                <a href={p.live} aria-label={`${p.name}, live demo`}>Live</a>
                <a href={p.code} aria-label={`${p.name}, source code`}>Code</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="work__preview ticks" aria-hidden="true">
        <div className="work__screens">
          {projects.map((p, i) => (
            <img
              key={p.name}
              src={asset(p.preview)}
              alt=""
              loading={i === 0 ? undefined : 'lazy'}
              width="1200"
              height="750"
              className={i === active ? 'is-active' : undefined}
            />
          ))}
        </div>
        <p className="caption">{projects[active].name}, as it runs today.</p>
      </div>
    </div>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#work">Skip to the work</a>

      <header className="nav">
        <div className="container nav__bar">
          <a className="nav__mark" href={import.meta.env.BASE_URL} aria-label="Shlok Singh, home">Shlok Singh</a>
          <nav className="nav__links" aria-label="Primary">
            <a className="nav__link" href="#work">Work</a>
            <a className="btn btn--line" href={mail}>Email me</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div className="hero__text">
              <h1 id="hero-title">I build LLM products, then measure them.</h1>
              <p className="lead">AI and full-stack engineer in Mumbai, shipping five live products.</p>
              <div className="hero__actions">
                <a className="btn" href={mail}>Email me</a>
                <a className="btn btn--line" href="#intro">Watch the intro</a>
              </div>
            </div>
            <ProofField />
          </div>
        </section>

        <section className="film" id="intro" aria-labelledby="film-title">
          <div className="container">
            <div className="split-head" data-reveal>
              <h2 id="film-title">The work, in 78 seconds.</h2>
              <p className="lead">Five products and the numbers behind them, in my own voice.</p>
            </div>
            <figure className="hero__film ticks" data-reveal style={{ '--i': 1 }}>
              <div className="hero__frame" data-slot="intro" data-kind="product" data-alt="Shlok's 78-second intro video">
                <IntroFilm />
              </div>
            </figure>
          </div>
        </section>

        <section className="map" aria-labelledby="map-title">
          <div className="container">
            <div className="split-head" data-reveal>
              <h2 id="map-title">The model proposes. Code decides.</h2>
              <p className="lead">Five products, one rule: nothing a model says ships unchecked.</p>
            </div>
            <div className="map__panel ticks">
              <table className="map__table">
                <caption className="visually-hidden">How each product moves from input to a checked result</caption>
                <thead>
                  <tr>
                    <th scope="col"><span className="visually-hidden">Product</span></th>
                    <th scope="col">In</th>
                    <th scope="col">Model</th>
                    <th scope="col">Check</th>
                    <th scope="col">Out</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((row, i) => (
                    <tr key={row.name} data-reveal style={{ '--i': i }}>
                      <th scope="row">{row.name}</th>
                      <td><span className="node">{row.input}</span></td>
                      <td><span className="node">{row.model}</span></td>
                      <td><span className="node node--check">{row.check}</span></td>
                      <td><span className="node">{row.result}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="work" id="work" aria-labelledby="work-title">
          <div className="container">
            <h2 id="work-title" data-reveal>Five products, all live.</h2>
            <Work />
          </div>
        </section>

        <section className="case" aria-labelledby="case-title">
          <div className="container case__grid">
            <div className="case__frame ticks" data-reveal>
            <figure className="case__shot" data-slot="receptionist" data-kind="product" data-alt="The AI Phone Receptionist call screen">
              <img
                src={asset('/receptionist-call.png')}
                width="1260"
                height="600"
                loading="lazy"
                alt="The AI Phone Receptionist call screen, with caller ID, voice mode and a Start call button"
              />
            </figure>
            </div>
            <div className="case__text" data-reveal style={{ '--i': 2 }}>
              <h2 id="case-title">Ten callers, one slot, one booking.</h2>
              <p className="lead">The agent can only book slots its search returned. Postgres blocks any overlap.</p>
              <dl className="facts">
                {receptionistFacts.map((f) => (
                  <div key={f.term}>
                    <dt>{f.term}</dt>
                    <dd><CountUp value={f.value} unit={f.unit} /></dd>
                  </div>
                ))}
              </dl>
              <p className="case__links">
                <a href={projects[1].live}>Call the receptionist</a>
                <a href={projects[1].code}>Read the code</a>
              </p>
            </div>
          </div>
        </section>

        <section className="services" aria-labelledby="services-title">
          <div className="container services__grid">
            <h2 id="services-title">What I can own for you</h2>
            <ul className="rows">
              {services.map((s, i) => (
                <li key={s.title} data-reveal style={{ '--i': i }}>
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band" aria-labelledby="exp-title">
          <div className="container about__grid">
            <figure className="about__photo" data-slot="portrait" data-reveal data-alt="Portrait of Shlok">
              <img src={asset('/shlok.jpg')} width="1080" height="1440" loading="lazy" alt="Shlok Singh, in a dark hoodie, looking off to the side" />
            </figure>
            <div className="about__text" data-reveal style={{ '--i': 1 }}>
              <h2 id="exp-title">Where I’ve worked</h2>
              <ul className="roles">
                {experience.map((e) => (
                  <li key={e.role}>
                    <h3>{e.role}</h3>
                    <p>{e.where}</p>
                    <p className="roles__when">{e.when}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="close" aria-labelledby="close-title">
          <div className="container">
            <h2 id="close-title" className="close__head" data-reveal>Building with AI? Let’s talk.</h2>
            <dl className="close__details" data-reveal style={{ '--i': 2 }}>
              <div>
                <dt>Email</dt>
                <dd><a className="close__email" href={mail}>{contact.email}</a></dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>Mumbai, India</dd>
              </div>
              <div>
                <dt>Elsewhere</dt>
                <dd className="close__links">
                  <a href={contact.linkedin}>LinkedIn</a>
                  <a href={contact.github}>GitHub</a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="container foot__bar">
          <p>Thanks for reading. Shlok Singh, Mumbai.</p>
          <p><time dateTime="2026-11">November 2026</time></p>
        </div>
      </footer>
    </>
  )
}

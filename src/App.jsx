import { useCallback, useEffect, useRef, useState } from 'react'
import brands from './brands.json'

const shuffle = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function App() {
  const [deck, setDeck] = useState(() => shuffle(brands))
  const [position, setPosition] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStart = useRef(null)
  const card = deck[position]

  const next = useCallback(() => {
    setPosition((current) => Math.min(current + 1, deck.length - 1))
    setOffset(0)
  }, [deck.length])
  const previous = useCallback(() => {
    setPosition((current) => Math.max(current - 1, 0))
    setOffset(0)
  }, [])
  const reshuffle = () => {
    setDeck(shuffle(brands))
    setPosition(0)
    setOffset(0)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
      if (event.key === 'ArrowRight') { event.preventDefault(); next() }
      if (event.key === 'ArrowLeft') { event.preventDefault(); previous() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, previous])

  const startDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    touchStart.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
    try { event.currentTarget.setPointerCapture?.(event.pointerId) } catch { /* synthetic pointer events have no capture target */ }
  }
  const moveDrag = (event) => {
    if (!touchStart.current) return
    const dx = event.clientX - touchStart.current.x
    const dy = event.clientY - touchStart.current.y
    if (Math.abs(dx) > Math.abs(dy)) setOffset(Math.max(-130, Math.min(130, dx)))
  }
  const endDrag = (event) => {
    if (!touchStart.current) return
    const distance = event && touchStart.current ? event.clientX - touchStart.current.x : offset
    if (distance > 70) previous()
    else if (distance < -70) next()
    else setOffset(0)
    touchStart.current = null
    setDragging(false)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand-mark" href="#home" aria-label="Vroom Room home">
          <span className="brand-icon" aria-hidden="true">🚗</span>
          <span>Vroom Room</span>
        </a>
        <div className="mode-pill"><span aria-hidden="true">✦</span> BRAND QUEST</div>
      </header>

      <section className="learning-area" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow"><span aria-hidden="true">🏁</span> READY, SET, LEARN!</p>
          <h1 id="page-title">Meet the <span>car brands</span></h1>
          <p className="subtitle">One logo at a time. You’ve got this!</p>
        </div>

        <div className="progress-row" aria-live="polite">
          <span className="progress-label">YOUR GARAGE</span>
          <span className="progress-count">{position + 1}<span> / {deck.length}</span></span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Brands explored" aria-valuemin="1" aria-valuemax={deck.length} aria-valuenow={position + 1}>
          <span style={{ width: `${((position + 1) / deck.length) * 100}%` }} />
        </div>

        <div className="card-stage">
          <div className="peek-card peek-back" aria-hidden="true" />
          <div className="peek-card peek-front" aria-hidden="true" />
          <article
            className={`brand-card${dragging ? ' is-dragging' : ''}`}
            style={{ transform: `translateX(${offset}px) rotate(${offset / 24}deg)` }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            aria-label={`Car brand card: ${card.name}`}
          >
            <div className="card-topline"><span className="sparkle" aria-hidden="true">✦</span><span>BRAND #{String(position + 1).padStart(2, '0')}</span><span className="sparkle" aria-hidden="true">✦</span></div>
            <div className="logo-well">
              <img key={card.logo} src={`/logos/${card.logo}`} alt={`${card.name} logo`} draggable="false" />
            </div>
            <div className="card-name">{card.name}</div>
            <div className="card-hint"><span aria-hidden="true">👆</span> SWIPE TO EXPLORE</div>
            {offset < -24 && <span className="swipe-stamp stamp-next" aria-hidden="true">NEXT!</span>}
            {offset > 24 && <span className="swipe-stamp stamp-back" aria-hidden="true">BACK!</span>}
          </article>
        </div>

        <div className="controls" aria-label="Brand navigation">
          <button className="nav-button back-button" onClick={previous} disabled={position === 0} aria-label="Previous car brand">
            <span aria-hidden="true">←</span><span className="button-word">BACK</span>
          </button>
          <button className="shuffle-button" onClick={reshuffle} aria-label="Shuffle brands and start over">
            <span aria-hidden="true">⤨</span><span className="sr-only">Shuffle brands and start over</span>
          </button>
          <button className="nav-button next-button" onClick={next} disabled={position === deck.length - 1} aria-label="Next car brand">
            <span className="button-word">NEXT</span><span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="keyboard-hint">TIP: USE THE <kbd>←</kbd> <kbd>→</kbd> ARROW KEYS TOO</p>
      </section>
      <footer className="footer-note"><span aria-hidden="true">⭐</span> Every great driver starts curious <span aria-hidden="true">⭐</span></footer>
    </main>
  )
}

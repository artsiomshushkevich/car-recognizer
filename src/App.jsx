import { useCallback, useEffect, useState } from 'react'
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
  const card = deck[position]

  const next = useCallback(() => {
    setPosition((current) => Math.min(current + 1, deck.length - 1))
  }, [deck.length])
  const previous = useCallback(() => {
    setPosition((current) => Math.max(current - 1, 0))
  }, [])
  const reshuffle = () => {
    setDeck(shuffle(brands))
    setPosition(0)
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

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand-mark" href="#home" aria-label="Главная — Врум Рум">
          <span className="brand-icon" aria-hidden="true">🚗</span>
          <span>Врум Рум</span>
        </a>
      </header>

      <section className="learning-area" aria-labelledby="page-title">
        <div className="intro">
          <h1 id="page-title">Знакомься: <span>марки автомобилей</span>!</h1>
          <p className="eyebrow"><span aria-hidden="true">🏁</span> НА СТАРТ, ВНИМАНИЕ, УЧИМСЯ!</p>
        </div>

        <div className="progress-row" aria-live="polite">
          <span className="progress-label">ТВОЙ ГАРАЖ</span>
          <span className="progress-count">{position + 1}<span> / {deck.length}</span></span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Просмотренные марки" aria-valuemin="1" aria-valuemax={deck.length} aria-valuenow={position + 1}>
          <span style={{ width: `${((position + 1) / deck.length) * 100}%` }} />
        </div>

        <div className="card-stage">
          <article
            className="brand-card"
            onClick={next}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                next()
              }
            }}
            aria-label={`Карточка марки автомобиля: ${card.name}`}
          >
            <div className="logo-well">
              <img key={card.logo} src={`${import.meta.env.BASE_URL}logos/${card.logo}`} alt={`Логотип марки ${card.name}`} draggable="false" />
            </div>
            <div className="card-name">{card.name}</div>
          </article>
        </div>

        <div className="controls" aria-label="Навигация по маркам">
          <button className="nav-button back-button" onClick={previous} disabled={position === 0} aria-label="Предыдущая марка автомобиля">
            <span aria-hidden="true">←</span><span className="button-word">НАЗАД</span>
          </button>
          <button className="shuffle-button" onClick={reshuffle} aria-label="Перемешать марки и начать заново">
            <span aria-hidden="true">⤨</span><span className="sr-only">Перемешать марки и начать заново</span>
          </button>
          <button className="nav-button next-button" onClick={next} disabled={position === deck.length - 1} aria-label="Следующая марка автомобиля">
            <span className="button-word">ДАЛЕЕ</span><span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="keyboard-hint">СОВЕТ: ИСПОЛЬЗУЙ КЛАВИШИ-СТРЕЛКИ <kbd>←</kbd> <kbd>→</kbd></p>
      </section>
      <footer className="footer-note"><span aria-hidden="true">⭐</span> Любой отличный водитель начинает с любопытства <span aria-hidden="true">⭐</span></footer>
    </main>
  )
}

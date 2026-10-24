import { useCallback, useEffect, useState } from 'react'
import brands from './brands.json'
import PhotoCard from './PhotoCard'
import { getCarPhotos } from './carPhotos'

const shuffle = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const buildPhotoDeck = (brandDeck) => {
  const groups = brandDeck
    .map((brand) => getCarPhotos(brand.name).map((photo) => ({ brand, photo })))
    .filter((photos) => photos.length > 0)
  const photoDeck = []
  let previousBrand = null
  let remaining = groups.reduce((total, group) => total + group.length, 0)

  while (remaining > 0) {
    const nextGroup = groups
      .filter((group) => group.length > 0 && group[0].brand.name !== previousBrand)
      .reduce((largest, group) => group.length > largest.length ? group : largest, [])

    if (nextGroup.length === 0) break

    const nextPhoto = nextGroup.shift()
    photoDeck.push(nextPhoto)
    previousBrand = nextPhoto.brand.name
    remaining -= 1
  }

  return photoDeck
}

export default function App() {
  const [deck, setDeck] = useState(() => shuffle(brands))
  const [position, setPosition] = useState(0)
  const [mode, setMode] = useState('logos')
  const photoDeck = buildPhotoDeck(deck)
  const activeDeck = mode === 'photos' ? photoDeck : deck
  const activePosition = Math.min(position, activeDeck.length - 1)
  const card = activeDeck[activePosition]

  const next = useCallback(() => {
    setPosition((current) => Math.min(current + 1, activeDeck.length - 1))
  }, [activeDeck.length])
  const previous = useCallback(() => {
    setPosition((current) => Math.max(current - 1, 0))
  }, [])
  const reshuffle = () => {
    const nextDeck = shuffle(brands)
    setDeck(nextDeck)
    setPosition(0)
  }
  const switchMode = (nextMode) => {
    if (nextMode === mode) return
    setPosition(0)
    setMode(nextMode)
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

      <section className={mode === 'photos' ? 'learning-area photos-mode' : 'learning-area'} aria-labelledby="page-title">
        <div className="intro">
          <h1 id="page-title"><span className="title-flag" aria-hidden="true">🏁</span> Знакомься: <span>автомобили!</span></h1>
        </div>

        <div className="mode-switch" role="group" aria-label="Режим обучения">
          <button className={mode === 'logos' ? 'mode-button selected' : 'mode-button'} onClick={() => switchMode('logos')}>ЛОГОТИПЫ</button>
          <button className={mode === 'photos' ? 'mode-button selected' : 'mode-button'} onClick={() => switchMode('photos')}>РЕАЛЬНЫЕ ФОТО</button>
        </div>

        <div className="progress-row" aria-live="polite">
          <span className="progress-label">ТВОЙ ГАРАЖ</span>
          <span className="progress-count">{activePosition + 1}<span> / {activeDeck.length}</span></span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Просмотренные марки" aria-valuemin="1" aria-valuemax={activeDeck.length} aria-valuenow={activePosition + 1}>
          <span style={{ width: `${((activePosition + 1) / activeDeck.length) * 100}%` }} />
        </div>

        <div className={mode === 'photos' ? 'card-stage photo-stage' : 'card-stage'}>
          {mode === 'photos' ? <PhotoCard brand={card.brand} photo={card.photo} onNext={next} /> : <article
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
          </article>}
        </div>

        <div className="controls" aria-label="Навигация по маркам">
          <button className="nav-button back-button" onClick={previous} disabled={activePosition === 0} aria-label="Предыдущая марка автомобиля">
            <span aria-hidden="true">←</span><span className="button-word">НАЗАД</span>
          </button>
          <button className="shuffle-button" onClick={reshuffle} aria-label="Перемешать марки и начать заново">
            <span aria-hidden="true">⤨</span><span className="sr-only">Перемешать марки и начать заново</span>
          </button>
          <button className="nav-button next-button" onClick={next} disabled={activePosition === activeDeck.length - 1} aria-label="Следующая марка автомобиля">
            <span className="button-word">ДАЛЕЕ</span><span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="keyboard-hint">СОВЕТ: ИСПОЛЬЗУЙ КЛАВИШИ-СТРЕЛКИ <kbd>←</kbd> <kbd>→</kbd></p>
      </section>
      <footer className="footer-note"><span aria-hidden="true">⭐</span> Любой отличный водитель начинает с любопытства <span aria-hidden="true">⭐</span></footer>
    </main>
  )
}

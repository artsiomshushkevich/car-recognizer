export default function PhotoCard({ brand, photo, onNext }) {
  return (
    <article
      className="photo-card"
      role="button"
      tabIndex={0}
      aria-label={`Фото автомобиля марки ${brand.name}. Нажмите, чтобы перейти дальше`}
      onClick={onNext}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onNext()
        }
      }}
    >
      <div className="photo-frame">
        <img src={photo.src} alt={`Автомобиль марки ${brand.name}; эмблема может быть видна на кузове`} />
      </div>
      <div className="photo-caption"><div className="card-name">{brand.name}</div></div>
    </article>
  )
}

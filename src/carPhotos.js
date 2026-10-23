import catalog from './carPhotoCatalog.json'

const localImages = import.meta.glob('./assets/car-photos/**/*.{jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const normalizedBrand = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

export function getCarPhotos(brand) {
  const key = normalizedBrand(brand)
  return catalog
    .filter((photo) => normalizedBrand(photo.name) === key)
    .map((photo) => ({
      name: photo.name,
      src: localImages[photo.image],
    }))
    .filter((photo) => photo.src)
}

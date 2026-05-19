import { useState } from 'react'
import { galleryItems, type GalleryItem } from '../data/gallery'

type Filter = 'all' | GalleryItem['type']

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered =
    filter === 'all' ? galleryItems : galleryItems.filter((item) => item.type === filter)

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Gallery</p>
        <h1>Yarn &amp; light</h1>
        <p>A peek at our crochet work and photography — replace these with your own images anytime.</p>
      </section>

      <section className="section">
        <div className="filter-bar" role="tablist" aria-label="Gallery filter">
          {(['all', 'crochet', 'photo'] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={filter === key ? 'active' : undefined}
              onClick={() => setFilter(key)}
            >
              {key === 'all' ? 'All' : key === 'crochet' ? 'Crochet' : 'Photography'}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filtered.map((item) => (
            <figure key={item.id} className="gallery-item">
              <img src={item.image} alt={item.title} loading="lazy" />
              <figcaption>
                <span className="badge">{item.type === 'crochet' ? 'Crochet' : 'Photo'}</span>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

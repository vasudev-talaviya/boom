const galleryItems = [
  {
    id: 1,
    image: '/images/street-bazaar.jpg',
    titleHi: 'शापित गलियाँ',
    titleEn: 'Cursed Streets & Alleys',
    alt: 'Dark haunted street with fog and shadows',
  },
  {
    id: 2,
    image: '/images/classical-dance.jpg',
    titleHi: 'भूतिया नृत्य',
    titleEn: 'Dance of the Dead',
    alt: 'Ghostly dancer in darkness',
  },
  {
    id: 3,
    image: '/images/holi-festival.jpg',
    titleHi: 'खून का रंग',
    titleEn: 'Festival of Blood',
    alt: 'Dark crimson ritual celebration',
  },
  {
    id: 4,
    image: '/images/desi-food.jpg',
    titleHi: 'ज़हरीला ज़ायका',
    titleEn: 'Poison Flavors',
    alt: 'Eerie dark feast on haunted table',
  },
  {
    id: 5,
    image: '/images/vintage-bollywood.jpg',
    titleHi: 'भूली यादें',
    titleEn: 'Forgotten Memories',
    alt: 'Haunted vintage scene with ghostly figures',
  },
  {
    id: 6,
    image: '/images/mehndi-art.jpg',
    titleHi: 'शापित कला',
    titleEn: 'Cursed Art & Symbols',
    alt: 'Dark mystical symbols and cursed patterns',
  },
]

export default function GallerySection({ onDownload }) {
  return (
    <section className="gallery-section" id="gallery">
      <div className="section-header">
        <h2 className="section-title blood-text-glow" data-text="शापित गैलरी">
          शापित गैलरी
        </h2>
        <p className="section-subtitle">The Cursed Collection — Do Not Look Away</p>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div className="gallery-card" key={item.id} id={`gallery-card-${item.id}`}>
            <div className="gallery-card-image">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
              />
            </div>
            <div className="gallery-card-overlay"></div>
            <div className="gallery-card-info">
              <div className="gallery-card-text">
                <h3>{item.titleHi}</h3>
                <p>{item.titleEn}</p>
              </div>
              <div className="gallery-card-download">
                <button
                  className="btn-claim"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload()
                  }}
                  id={`download-btn-${item.id}`}
                  aria-label={`Claim ${item.titleEn}`}
                >
                  ☠️ CLAIM... IF YOU DARE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

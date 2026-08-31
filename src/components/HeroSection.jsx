import { useEffect, useState } from 'react'

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [lightningActive, setLightningActive] = useState(false)

  useEffect(() => {
    setLoaded(true)

    // Random lightning flashes
    const triggerLightning = () => {
      setLightningActive(true)
      setTimeout(() => setLightningActive(false), 200)

      // Schedule next lightning
      const nextDelay = 5000 + Math.random() * 15000
      setTimeout(triggerLightning, nextDelay)
    }

    const initialDelay = setTimeout(triggerLightning, 3000)
    return () => clearTimeout(initialDelay)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img
          src="/images/hero-culture.jpg"
          alt="Dark haunted landscape"
          loading="eager"
        />
      </div>
      <div className="hero-vignette"></div>

      {/* Lightning flash overlay */}
      {lightningActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.15)',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'lightningFlash 0.3s ease',
        }} />
      )}

      <div className="hero-content">
        <p className="hero-subtitle-top">
          ⚠️ WARNING: YOU ARE ENTERING THE UNKNOWN ⚠️
        </p>

        <h1 className="hero-title blood-text-glow">
          यह कुछ नहीं मिलता
        </h1>

        <p className="hero-subtitle">
          <span className={loaded ? 'typewriter' : ''} style={{ borderRightColor: '#DC143C' }}>
            जो यहाँ आया... वो कभी वापस नहीं गया 💀
          </span>
        </p>

        <div className="hero-cta">
          <a href="#gallery" className="btn-horror shaking" id="explore-btn">
            ☠️ Explore The Darkness
          </a>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-mouse"></div>
        <span className="scroll-text">Descend Deeper</span>
      </div>
    </section>
  )
}

import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const glitchTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // Random brand text glitch
    const triggerGlitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 300)

      glitchTimerRef.current = setTimeout(triggerGlitch, 4000 + Math.random() * 8000)
    }
    glitchTimerRef.current = setTimeout(triggerGlitch, 3000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current)
    }
  }, [])

  const chainLinks = Array.from({ length: 20 }, (_, i) => (
    <span
      key={i}
      className="chain-link"
      style={{ '--delay': `${i * 0.15}s` }}
    >
      {i % 2 === 0 ? '⛓' : '🔗'}
    </span>
  ))

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand">
          <span
            className="blood-text-glow"
            style={{
              display: 'inline-block',
              animation: glitchActive
                ? 'glitch-1 0.2s steps(3) infinite'
                : 'none',
            }}
          >
            यह कुछ नहीं मिलता
          </span>
          {scrolled && <div className="chain-decoration">{chainLinks}</div>}
        </a>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          id="nav-toggle-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
          <li><a href="#home" onClick={() => setMenuOpen(false)}>🏚️ Haunt</a></li>
          <li><a href="#gallery" onClick={() => setMenuOpen(false)}>🖼️ Gallery</a></li>
          <li><a href="#quotes" onClick={() => setMenuOpen(false)}>📜 Prophecy</a></li>
          <li><a href="#footer" onClick={() => setMenuOpen(false)}>⚰️ Grave</a></li>
        </ul>
      </div>
    </nav>
  )
}

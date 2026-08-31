import { useState, useCallback } from 'react'
import HorrorIntro from './components/HorrorIntro'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GallerySection from './components/GallerySection'
import QuoteSection from './components/QuoteSection'
import MusicPlayer from './components/MusicPlayer'
import Footer from './components/Footer'
import FloatingGhosts from './components/FloatingGhosts'
import RevealOverlay from './components/RevealOverlay'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [introExiting, setIntroExiting] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  const handleEnterSite = useCallback(() => {
    setIntroExiting(true)
    // Wait for exit animation to complete
    setTimeout(() => {
      setShowIntro(false)
    }, 1500)
  }, [])

  const triggerReveal = useCallback(() => {
    setShowReveal(true)
  }, [])

  const closeReveal = useCallback(() => {
    setShowReveal(false)
  }, [])

  return (
    <div className="app">
      {/* Horror Intro Gate */}
      {showIntro && (
        <div className={introExiting ? 'horror-intro exiting' : ''}>
          <HorrorIntro onEnter={handleEnterSite} />
        </div>
      )}

      {/* Main site content — hidden behind intro */}
      {!showIntro && (
        <>
          <FloatingGhosts />
          <div className="lightning-overlay"></div>
          <div className="fog-layer"></div>
          <Navbar />
          <main>
            <HeroSection />
            <div className="section-divider"><span>💀</span></div>
            <GallerySection onDownload={triggerReveal} />
            <div className="section-divider"><span>☠️</span></div>
            <QuoteSection />
          </main>
          <Footer />
          <MusicPlayer />
          <RevealOverlay show={showReveal} onClose={closeReveal} />
        </>
      )}
    </div>
  )
}

export default App

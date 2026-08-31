import { useState, useEffect, useCallback } from 'react'

const quotes = [
  {
    hindi: 'अंधेरे में जो चमकता है, वो सोना नहीं... खतरा है।',
    english: 'What glows in the dark isn\'t gold... it\'s danger.',
  },
  {
    hindi: 'यहाँ से कोई खाली हाथ नहीं गया... कुछ तो छोड़ कर गया।',
    english: 'Nobody left here empty-handed... they left something behind.',
  },
  {
    hindi: 'जो दिखता है वो सच नहीं, जो सच है वो दिखता नहीं।',
    english: 'What you see isn\'t real, what\'s real you cannot see.',
  },
  {
    hindi: 'हर राज़ की एक कीमत होती है... क्या तुम चुकाने को तैयार हो?',
    english: 'Every secret has a price... are you ready to pay?',
  },
  {
    hindi: 'यहाँ कुछ नहीं मिलता... सिवाय डर के।',
    english: 'You won\'t find anything here... except fear.',
  },
]

export default function QuoteSection() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [flashActive, setFlashActive] = useState(false)

  const goToQuote = useCallback((index) => {
    if (isAnimating || index === currentQuote) return
    setIsAnimating(true)
    setFlashActive(true)

    setTimeout(() => {
      setFlashActive(false)
      setCurrentQuote(index)
      setIsAnimating(false)
    }, 400)
  }, [isAnimating, currentQuote])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setFlashActive(true)

      setTimeout(() => {
        setFlashActive(false)
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
        setIsAnimating(false)
      }, 400)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="quote-section" id="quotes">
      {/* Lightning flash on transition */}
      {flashActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(139, 0, 0, 0.15)',
          zIndex: 10,
          pointerEvents: 'none',
          borderRadius: 'var(--radius-sm)',
        }} />
      )}

      <div className="quote-card">
        <div className="rangoli-corner top-left"></div>
        <div className="rangoli-corner top-right"></div>
        <div className="rangoli-corner bottom-left"></div>
        <div className="rangoli-corner bottom-right"></div>

        <div
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(10px) scale(0.98)' : 'translateY(0) scale(1)',
            transition: 'all 0.4s ease',
          }}
        >
          <p className="quote-hindi">{quotes[currentQuote].hindi}</p>
          <p className="quote-english">— {quotes[currentQuote].english}</p>
        </div>

        <div className="quote-dots">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={`quote-dot ${index === currentQuote ? 'active' : ''}`}
              onClick={() => goToQuote(index)}
              aria-label={`Go to prophecy ${index + 1}`}
              id={`quote-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

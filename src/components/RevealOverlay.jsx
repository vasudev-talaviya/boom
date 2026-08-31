import { useState, useEffect, useCallback, useRef } from 'react'

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    tx: `${(Math.random() - 0.5) * 600}px`,
    ty: `${(Math.random() - 0.5) * 600}px`,
    size: 3 + Math.random() * 8,
    delay: Math.random() * 0.5,
    color: ['#DC143C', '#8B0000', '#FF0000', '#FF4444', '#CC0000'][Math.floor(Math.random() * 5)],
  }))
}

function generateCrackLines() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`,
    width: `${50 + Math.random() * 200}px`,
    height: '1px',
    rotation: `${Math.random() * 360}deg`,
  }))
}

// Horror thunder crack sound
function playThunderCrack() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // Deep thunder rumble
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(40, now)
    osc1.frequency.exponentialRampToValueAtTime(15, now + 0.8)
    gain1.gain.setValueAtTime(0.5, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 1.5)

    // Sharp crack
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(800, now)
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.3)
    gain2.gain.setValueAtTime(0.4, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.5)

    // White noise burst (rain/static)
    const bufferSize = ctx.sampleRate * 1
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.3))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.15, now)
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)

    // Dissonant horror chord
    const chordFreqs = [185, 207.65, 277.18, 369.99]
    chordFreqs.forEach(freq => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now + 0.05)
      g.gain.setValueAtTime(0.08, now + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(now + 0.05)
      osc.stop(now + 2)
    })

    setTimeout(() => ctx.close(), 3000)
  } catch (e) {
    // Audio not available
  }
}

// Jumpscare screech sound
function playScreech() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // High-pitched screech
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(2000, now)
    osc.frequency.linearRampToValueAtTime(800, now + 0.3)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)

    setTimeout(() => ctx.close(), 1000)
  } catch (e) {
    // Audio not available
  }
}

export default function RevealOverlay({ show, onClose }) {
  const [phase, setPhase] = useState('idle')
  // phases: idle, blackout, static, jumpscare, crack, reveal, shake, fadeout
  const [countNum, setCountNum] = useState(3)
  const [particles] = useState(() => generateParticles(60))
  const [cracks] = useState(() => generateCrackLines())
  const [revealedChars, setRevealedChars] = useState(0)
  const timeoutRef = useRef(null)

  const fullText = 'यह कुछ नहीं मिलता!'

  const reset = useCallback(() => {
    setPhase('idle')
    setCountNum(3)
    setRevealedChars(0)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // Character-by-character reveal
  useEffect(() => {
    if (phase !== 'reveal') return
    if (revealedChars >= fullText.length) return

    const timer = setTimeout(() => {
      setRevealedChars(prev => prev + 1)
    }, 150)

    return () => clearTimeout(timer)
  }, [phase, revealedChars, fullText.length])

  useEffect(() => {
    if (!show) {
      reset()
      return
    }

    // Multi-stage horror sequence
    setPhase('blackout')

    // Stage 1: Static noise (1s)
    const t1 = setTimeout(() => setPhase('static'), 800)

    // Stage 2: Jumpscare flash (0.5s)
    const t2 = setTimeout(() => {
      setPhase('jumpscare')
      playScreech()
    }, 1800)

    // Stage 3: Screen crack (0.5s)
    const t3 = setTimeout(() => setPhase('crack'), 2300)

    // Stage 4: Blood text reveal with thunder
    const t4 = setTimeout(() => {
      setPhase('reveal')
      playThunderCrack()
    }, 2800)

    // Stage 5: Screen shake
    const t5 = setTimeout(() => setPhase('shake'), 5500)

    // Stage 6: Fadeout
    const t6 = setTimeout(() => setPhase('fadeout'), 6200)

    // Close
    const t7 = setTimeout(() => {
      onClose()
      reset()
    }, 7200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      clearTimeout(t7)
    }
  }, [show, onClose, reset])

  if (!show && phase === 'idle') return null

  return (
    <div
      className={`reveal-overlay ${show ? 'active' : ''} ${phase === 'shake' ? 'screen-shake' : ''}`}
      onClick={() => {
        onClose()
        reset()
      }}
      id="reveal-overlay"
      style={{
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 1s ease',
      }}
    >
      <div className="reveal-backdrop"></div>

      {/* Static noise overlay */}
      {(phase === 'static' || phase === 'jumpscare' || phase === 'crack') && (
        <div className="reveal-static"></div>
      )}

      {/* PHASE: Blackout — just darkness with heartbeat text */}
      {phase === 'blackout' && (
        <div className="reveal-content">
          <span style={{
            fontFamily: 'var(--font-horror)',
            fontSize: '1.5rem',
            color: '#8B0000',
            opacity: 0.5,
            animation: 'heartbeat 0.8s ease-in-out infinite',
          }}>
            . . .
          </span>
        </div>
      )}

      {/* PHASE: Static — screen filled with noise */}
      {phase === 'static' && (
        <div className="reveal-content">
          <span style={{
            fontFamily: 'var(--font-horror)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: '#333',
            opacity: 0.3,
            animation: 'glitch-1 0.2s steps(3) infinite',
          }}>
            ██████████
          </span>
        </div>
      )}

      {/* PHASE: Jumpscare — ghost face flash */}
      {phase === 'jumpscare' && (
        <div className="jumpscare-flash">
          👹
        </div>
      )}

      {/* PHASE: Crack — screen cracks */}
      {phase === 'crack' && (
        <div className="screen-crack">
          {cracks.map(crack => (
            <div
              key={crack.id}
              className="crack-line"
              style={{
                top: crack.top,
                left: crack.left,
                width: crack.width,
                height: crack.height,
                transform: `rotate(${crack.rotation})`,
              }}
            />
          ))}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-horror)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#DC143C',
            textShadow: '0 0 30px rgba(255,0,0,0.6)',
            animation: 'heartbeat 0.5s ease-in-out infinite',
          }}>
            💀 BEWARE 💀
          </div>
        </div>
      )}

      {/* PHASE: Reveal — blood text character by character */}
      {(phase === 'reveal' || phase === 'shake') && (
        <div className="reveal-content">
          {/* Blood particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="reveal-particle"
              style={{
                '--tx': p.tx,
                '--ty': p.ty,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          <div className="reveal-hindi" style={{ position: 'relative', zIndex: 2 }}>
            {fullText.split('').map((char, i) => (
              <span
                key={i}
                style={{
                  opacity: i < revealedChars ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  display: 'inline-block',
                  transform: i < revealedChars ? 'translateY(0)' : 'translateY(20px)',
                  transitionProperty: 'opacity, transform',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          <div className="reveal-english">
            YOU WON'T FIND THIS ANYWHERE
          </div>

          <div className="reveal-emoji">
            💀🩸⚡🩸💀
          </div>

          <p
            style={{
              fontFamily: 'var(--font-english)',
              fontSize: '0.8rem',
              color: '#666',
              opacity: 0,
              animation: 'revealSubtitle 0.5s ease 1.5s forwards',
              marginTop: '1.5rem',
              letterSpacing: '2px',
            }}
          >
            TAP ANYWHERE TO ESCAPE... IF YOU CAN
          </p>
        </div>
      )}
    </div>
  )
}

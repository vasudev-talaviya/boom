import { useState, useEffect, useRef, useCallback } from 'react'

// Heartbeat sound using Web Audio API
function playHeartbeat(ctx, gainNode) {
  const now = ctx.currentTime

  for (let i = 0; i < 6; i++) {
    const beatTime = now + i * 1.2

    // First thump (lub)
    const osc1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(60, beatTime)
    osc1.frequency.exponentialRampToValueAtTime(30, beatTime + 0.15)
    g1.gain.setValueAtTime(0, beatTime)
    g1.gain.linearRampToValueAtTime(0.4, beatTime + 0.02)
    g1.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.2)
    osc1.connect(g1)
    g1.connect(gainNode)
    osc1.start(beatTime)
    osc1.stop(beatTime + 0.3)

    // Second thump (dub) — slightly delayed, higher
    const osc2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(50, beatTime + 0.25)
    osc2.frequency.exponentialRampToValueAtTime(25, beatTime + 0.4)
    g2.gain.setValueAtTime(0, beatTime + 0.25)
    g2.gain.linearRampToValueAtTime(0.3, beatTime + 0.27)
    g2.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.45)
    osc2.connect(g2)
    g2.connect(gainNode)
    osc2.start(beatTime + 0.25)
    osc2.stop(beatTime + 0.5)
  }
}

// Eerie whisper wind
function playWhisperWind(ctx, gainNode) {
  const bufferSize = ctx.sampleRate * 3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(400, ctx.currentTime)
  filter.Q.setValueAtTime(2, ctx.currentTime)

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.setValueAtTime(0.5, ctx.currentTime)
  lfoGain.gain.setValueAtTime(200, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0, ctx.currentTime)
  noiseGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1)
  noiseGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 3)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(gainNode)
  noise.start()
}

export default function HorrorIntro({ onEnter }) {
  const [phase, setPhase] = useState('darkness') // darkness, whisper, ready
  const [letterIndex, setLetterIndex] = useState(0)
  const audioCtxRef = useRef(null)
  const whisperText = 'कुछ ढूंढ रहे हो?'

  useEffect(() => {
    // Phase transitions
    const t1 = setTimeout(() => setPhase('whisper'), 1500)
    const t2 = setTimeout(() => setPhase('ready'), 4000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Letter-by-letter reveal
  useEffect(() => {
    if (phase !== 'whisper' && phase !== 'ready') return
    if (letterIndex >= whisperText.length) return

    const timer = setTimeout(() => {
      setLetterIndex(prev => prev + 1)
    }, 120)

    return () => clearTimeout(timer)
  }, [phase, letterIndex, whisperText.length])

  const handleEnter = useCallback(() => {
    // Play heartbeat on enter
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.connect(ctx.destination)

      playHeartbeat(ctx, gain)
      playWhisperWind(ctx, gain)

      setTimeout(() => ctx.close(), 8000)
    } catch (e) {
      // Audio not available
    }

    onEnter()
  }, [onEnter])

  return (
    <div className="horror-intro" id="horror-intro">
      <div className="intro-static"></div>

      {/* Blinking cursor in darkness */}
      {phase === 'darkness' && (
        <div className="intro-cursor"></div>
      )}

      {/* Whisper text appears letter by letter */}
      {(phase === 'whisper' || phase === 'ready') && (
        <>
          <div className="intro-whisper" style={{ opacity: 1, animation: 'none' }}>
            {whisperText.slice(0, letterIndex)}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              background: '#DC143C',
              marginLeft: '4px',
              verticalAlign: 'text-bottom',
              animation: 'cursorBlink 0.8s step-end infinite',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            }}></span>
          </div>

          <p className="intro-subtitle" style={
            phase === 'ready' ? { opacity: 1, animation: 'none' } : {}
          }>
            ... something lurks in the darkness ...
          </p>
        </>
      )}

      {/* Enter button */}
      {phase === 'ready' && (
        <button
          className="intro-enter-btn"
          onClick={handleEnter}
          id="enter-btn"
          style={{ opacity: 1, animation: 'none' }}
        >
          💀 अंदर आओ... अगर हिम्मत है 💀
          <br />
          <span style={{
            fontSize: '0.7em',
            letterSpacing: '4px',
            opacity: 0.6,
          }}>
            ENTER IF YOU DARE
          </span>
        </button>
      )}

      {/* Heartbeat line at bottom */}
      <svg
        className="intro-heartbeat-line"
        viewBox="0 0 1200 60"
        style={{
          opacity: phase === 'ready' ? 0.4 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <polyline
          points="0,30 200,30 250,30 270,10 290,50 310,30 330,5 350,55 370,30 400,30 600,30 650,30 670,10 690,50 710,30 730,5 750,55 770,30 800,30 1000,30 1050,30 1070,10 1090,50 1110,30 1130,5 1150,55 1170,30 1200,30"
          fill="none"
          stroke="#8B0000"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(255,0,0,0.5))',
          }}
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 2000"
            to="2000 0"
            dur="4s"
            fill="freeze"
          />
        </polyline>
      </svg>
    </div>
  )
}

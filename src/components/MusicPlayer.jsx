import { useState, useRef, useCallback, useEffect } from 'react'

// Horror scale — diminished/chromatic for maximum unease
const HORROR_NOTES = [
  130.81, // C3
  138.59, // C#3 (minor second — extremely dissonant)
  155.56, // Eb3
  185.00, // F#3 (tritone — "Devil's interval")
  196.00, // G3
  207.65, // Ab3
  246.94, // B3
  261.63, // C4
]

function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)()
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.25)
  const [panelOpen, setPanelOpen] = useState(false)
  const [eqHeights, setEqHeights] = useState([4, 4, 4, 4, 4, 4, 4, 4])

  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const nodesRef = useRef([])
  const intervalsRef = useRef([])
  const eqIntervalRef = useRef(null)

  const cleanup = useCallback(() => {
    nodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop()
        if (node.disconnect) node.disconnect()
      } catch (e) { /* already stopped */ }
    })
    nodesRef.current = []
    intervalsRef.current.forEach(id => clearInterval(id))
    intervalsRef.current = []
  }, [])

  // === HORROR DRONE — low rumbling ominous hum ===
  const createHorrorDrone = useCallback((ctx, gain) => {
    const droneFreqs = [32.7, 34.65, 65.41, 36.71] // Very low detuned
    const droneGains = [0.12, 0.08, 0.06, 0.05]

    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()

      osc.type = i === 0 ? 'sawtooth' : 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      oscGain.gain.setValueAtTime(droneGains[i], ctx.currentTime)

      // Slow detuning LFO for unsettling effect
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.2, ctx.currentTime)
      lfoGain.gain.setValueAtTime(2 + Math.random() * 3, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      osc.connect(oscGain)
      oscGain.connect(gain)
      osc.start()

      nodesRef.current.push(osc, lfo)
    })
  }, [])

  // === WHISPER WIND — filtered white noise ===
  const createWhisperWind = useCallback((ctx, gain) => {
    const bufferSize = ctx.sampleRate * 10
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1)
      }
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    // Bandpass filter to make it sound like wind/breathing
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(300, ctx.currentTime)
    filter.Q.setValueAtTime(3, ctx.currentTime)

    // LFO to modulate filter — creates breathing/whispering effect
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime)
    lfoGain.gain.setValueAtTime(250, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    // Volume LFO — swells in and out
    const volLfo = ctx.createOscillator()
    const volLfoGain = ctx.createGain()
    volLfo.frequency.setValueAtTime(0.08, ctx.currentTime)
    volLfoGain.gain.setValueAtTime(0.03, ctx.currentTime)
    volLfo.connect(volLfoGain)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime)
    volLfoGain.connect(noiseGain.gain)
    volLfo.start()

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(gain)
    noise.start()

    nodesRef.current.push(noise, lfo, volLfo)
  }, [])

  // === DISSONANT MELODY — tritones and minor seconds ===
  const playHorrorNote = useCallback((ctx, gain) => {
    const noteIdx = Math.floor(Math.random() * HORROR_NOTES.length)
    const freq = HORROR_NOTES[noteIdx]
    const octave = Math.random() > 0.7 ? 2 : 1

    const osc = ctx.createOscillator()
    const noteGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Use harsh waveforms
    osc.type = Math.random() > 0.5 ? 'sawtooth' : 'triangle'
    osc.frequency.setValueAtTime(freq * octave, ctx.currentTime)

    // Resonant filter for metallic quality
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(freq * octave * 1.5, ctx.currentTime)
    filter.Q.setValueAtTime(8, ctx.currentTime)

    const now = ctx.currentTime
    const duration = 2 + Math.random() * 3

    // Reverse-attack envelope (eerie swell)
    noteGain.gain.setValueAtTime(0, now)
    noteGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.6)
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    // Pitch bend down (creepy)
    if (Math.random() > 0.5) {
      osc.frequency.linearRampToValueAtTime(freq * octave * 0.9, now + duration)
    }

    osc.connect(filter)
    filter.connect(noteGain)
    noteGain.connect(gain)
    osc.start(now)
    osc.stop(now + duration)

    nodesRef.current.push(osc)
  }, [])

  // === HEARTBEAT RHYTHM ===
  const createHeartbeat = useCallback((ctx, gain) => {
    const playBeat = () => {
      const now = ctx.currentTime

      // Lub
      const osc1 = ctx.createOscillator()
      const g1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(55, now)
      osc1.frequency.exponentialRampToValueAtTime(25, now + 0.15)
      g1.gain.setValueAtTime(0.15, now)
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc1.connect(g1)
      g1.connect(gain)
      osc1.start(now)
      osc1.stop(now + 0.3)

      // Dub
      const osc2 = ctx.createOscillator()
      const g2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(45, now + 0.3)
      osc2.frequency.exponentialRampToValueAtTime(20, now + 0.45)
      g2.gain.setValueAtTime(0.1, now + 0.3)
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc2.connect(g2)
      g2.connect(gain)
      osc2.start(now + 0.3)
      osc2.stop(now + 0.55)

      nodesRef.current.push(osc1, osc2)
    }

    playBeat()
    const id = setInterval(playBeat, 2000)
    intervalsRef.current.push(id)
  }, [])

  // === RANDOM STINGER (jumpscare sounds) ===
  const playStinger = useCallback((ctx, gain) => {
    const schedule = () => {
      const now = ctx.currentTime

      // Dissonant chord burst
      const freqs = [277.18, 311.13, 369.99, 440, 523.25] // diminished chord
      freqs.forEach(freq => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, now)
        g.gain.setValueAtTime(0.06, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.connect(g)
        g.connect(gain)
        osc.start(now)
        osc.stop(now + 0.5)
        nodesRef.current.push(osc)
      })
    }

    // Random stingers at unpredictable intervals
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 20000
      const id = setTimeout(() => {
        schedule()
        scheduleNext()
      }, delay)
      intervalsRef.current.push(id)
    }
    scheduleNext()
  }, [])

  const startMusic = useCallback(() => {
    const ctx = createAudioContext()
    audioCtxRef.current = ctx

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.connect(ctx.destination)
    gainNodeRef.current = gainNode

    // Start all horror layers
    createHorrorDrone(ctx, gainNode)
    createWhisperWind(ctx, gainNode)
    createHeartbeat(ctx, gainNode)

    // Melody notes at random intervals
    const melodyId = setInterval(() => {
      playHorrorNote(ctx, gainNode)
    }, 1500 + Math.random() * 3000)
    intervalsRef.current.push(melodyId)

    // Random stingers
    playStinger(ctx, gainNode)

    // Animate equalizer
    eqIntervalRef.current = setInterval(() => {
      setEqHeights(Array.from({ length: 8 }, () => 4 + Math.random() * 26))
    }, 150)

    setIsPlaying(true)
  }, [volume, createHorrorDrone, createWhisperWind, createHeartbeat, playHorrorNote, playStinger])

  const stopMusic = useCallback(() => {
    cleanup()

    if (eqIntervalRef.current) {
      clearInterval(eqIntervalRef.current)
      eqIntervalRef.current = null
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }

    setEqHeights([4, 4, 4, 4, 4, 4, 4, 4])
    setIsPlaying(false)
  }, [cleanup])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic()
    } else {
      startMusic()
    }
  }, [isPlaying, startMusic, stopMusic])

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioCtxRef.current.currentTime)
    }
  }, [])

  useEffect(() => {
    return () => {
      stopMusic()
    }
  }, [stopMusic])

  return (
    <div className="music-player" id="music-player">
      <div className={`player-panel ${panelOpen ? '' : 'collapsed'}`}>
        <span className="player-label">💀 Horror Soundscape</span>

        <div className="equalizer">
          {eqHeights.map((height, i) => (
            <div
              key={i}
              className={`eq-bar ${isPlaying ? 'active' : ''}`}
              style={{
                height: `${height}px`,
                '--max-height': `${10 + Math.random() * 20}px`,
                '--delay': `${i * 0.08}s`,
              }}
            />
          ))}
        </div>

        <div className="volume-control">
          <span className="volume-icon" onClick={() => setVolume(volume > 0 ? 0 : 0.25)}>
            {volume === 0 ? '🔇' : volume < 0.3 ? '🔈' : '🔊'}
          </span>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            id="volume-slider"
            aria-label="Volume control"
          />
        </div>
      </div>

      <button
        className={`player-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={() => {
          toggleMusic()
          if (!panelOpen) setPanelOpen(true)
        }}
        onMouseEnter={() => setPanelOpen(true)}
        id="music-toggle-btn"
        aria-label={isPlaying ? 'Pause horror music' : 'Play horror music'}
        title={isPlaying ? 'Silence the Darkness' : 'Awaken the Horror'}
      >
        <span className="vinyl-icon">
          {isPlaying ? '☠️' : '💀'}
        </span>
      </button>
    </div>
  )
}

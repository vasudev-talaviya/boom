import { useEffect, useState } from 'react'

const GHOST_EMOJIS = ['👻', '💀', '🦇', '🕷️', '👁️', '🕸️', '☠️', '🫥', '🌑']

function createGhost(id) {
  const isJerky = Math.random() > 0.6
  return {
    id,
    emoji: GHOST_EMOJIS[Math.floor(Math.random() * GHOST_EMOJIS.length)],
    left: Math.random() * 100,
    size: 0.8 + Math.random() * 1.4,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 10,
    opacity: 0.2 + Math.random() * 0.4,
    movement: isJerky ? 'jerky' : 'smooth',
  }
}

export default function FloatingGhosts() {
  const [ghosts, setGhosts] = useState([])

  useEffect(() => {
    const initialGhosts = Array.from({ length: 12 }, (_, i) => createGhost(i))
    setGhosts(initialGhosts)

    let ghostId = 12
    const interval = setInterval(() => {
      setGhosts((prev) => {
        const newGhosts = prev.length > 20
          ? prev.slice(4)
          : prev
        return [...newGhosts, createGhost(ghostId++)]
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {ghosts.map((ghost) => (
        <span
          key={ghost.id}
          className={`ghost-particle ${ghost.movement}`}
          style={{
            left: `${ghost.left}%`,
            fontSize: `${ghost.size}rem`,
            animationDuration: `${ghost.duration}s`,
            animationDelay: `${ghost.delay}s`,
            opacity: ghost.opacity,
          }}
        >
          {ghost.emoji}
        </span>
      ))}
    </>
  )
}

import { useEffect, useState } from 'react'

const PETAL_EMOJIS = ['🌸', '🌺', '🌼', '🪷', '🌻', '💐', '🏵️']

function createPetal(id) {
  return {
    id,
    emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
    left: Math.random() * 100,
    size: 0.6 + Math.random() * 1,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 15,
    opacity: 0.3 + Math.random() * 0.5,
  }
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    const initialPetals = Array.from({ length: 15 }, (_, i) => createPetal(i))
    setPetals(initialPetals)

    // Continuously add new petals
    let petalId = 15
    const interval = setInterval(() => {
      setPetals((prev) => {
        const newPetals = prev.length > 25
          ? prev.slice(5)
          : prev
        return [...newPetals, createPetal(petalId++)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            fontSize: `${petal.size}rem`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
          }}
        >
          {petal.emoji}
        </span>
      ))}
    </>
  )
}

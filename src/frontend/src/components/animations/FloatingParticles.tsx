import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Floating particles animation for visual interest
 * Creates gentle, organic motion in the background
 */
export default function FloatingParticles() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return null
  }

  const particles = [
    { size: 60, delay: 0, top: '10%', left: '10%', opacity: 0.1 },
    { size: 80, delay: 2, top: '20%', left: '80%', opacity: 0.15 },
    { size: 100, delay: 4, top: '60%', left: '15%', opacity: 0.08 },
    { size: 70, delay: 1, top: '70%', left: '75%', opacity: 0.12 },
    { size: 90, delay: 3, top: '40%', left: '50%', opacity: 0.1 },
    { size: 50, delay: 5, top: '85%', left: '40%', opacity: 0.15 },
    { size: 75, delay: 1.5, top: '15%', left: '60%', opacity: 0.09 },
    { size: 85, delay: 3.5, top: '55%', left: '85%', opacity: 0.11 },
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white animate-float"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${20 + index * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

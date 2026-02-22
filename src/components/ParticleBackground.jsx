import React from 'react'

/**
 * Very light particle-style background animation (AvadaCRM-inspired).
 * Non-distracting: low opacity, slow motion, few particles.
 * Use variant="light" for steps/sidebar; default for dashboard.
 */
const PARTICLE_COUNT = { default: 12, light: 6 }
const PARTICLE_SIZE = { default: 3, light: 2 }

export default function ParticleBackground({ variant = 'default', className = '' }) {
  const count = PARTICLE_COUNT[variant] ?? PARTICLE_COUNT.default
  const size = PARTICLE_SIZE[variant] ?? PARTICLE_SIZE.default
  const isLight = variant === 'light'

  return (
    <div
      className={`particle-bg absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="particle-dot absolute rounded-full bg-primary-500 animate-particle-float"
          style={{
            width: size,
            height: size,
            left: `${(i * 17 + 5) % 92}%`,
            top: `${(i * 23 + 10) % 85}%`,
            opacity: isLight ? 0.04 : 0.06,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${14 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  )
}

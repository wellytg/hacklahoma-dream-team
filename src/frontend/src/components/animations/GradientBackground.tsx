import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Animated gradient background component
 * Creates a smooth, eye-catching color transition
 */
export default function GradientBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={`fixed inset-0 -z-10 bg-gradient-to-br from-primary-400 via-purple-500 to-accent-400 bg-[length:200%_200%] ${
        prefersReducedMotion ? '' : 'animate-gradient'
      }`}
      aria-hidden="true"
    />
  )
}

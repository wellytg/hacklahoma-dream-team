import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Sparkles } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import GradientBackground from '../animations/GradientBackground'
import FloatingParticles from '../animations/FloatingParticles'
import Button from '../ui/Button'
import Card from '../ui/Card'

/**
 * Welcome Screen - First impression after signup
 * Features attractive animations and catchy messaging
 */
export default function WelcomeScreen() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const handleGetStarted = () => {
    navigate('/onboarding/question/1')
  }

  // Animation durations - 0 if reduced motion is preferred
  const duration = prefersReducedMotion ? 0 : 0.6
  const staggerDelay = prefersReducedMotion ? 0 : 0.3

  // Motion variants for entrance animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing curve
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: duration * 1.2,
        ease: [0.34, 1.56, 0.64, 1], // Bounce effect
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <GradientBackground />
      <FloatingParticles />

      {/* Main content container */}
      <motion.div
        className="max-w-2xl w-full z-10"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: staggerDelay }}
      >
        {/* Logo/Icon */}
        <motion.div
          className="flex justify-center mb-8"
          variants={iconVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50" />
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <Brain className="w-16 h-16 text-primary-600" strokeWidth={1.5} />
              <Sparkles className="w-6 h-6 text-accent-500 absolute -top-2 -right-2" />
            </div>
          </div>
        </motion.div>

        {/* Welcome heading */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white text-center mb-4 text-balance"
          variants={itemVariants}
        >
          Welcome to Sensei
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 text-center mb-12 text-balance"
          variants={itemVariants}
        >
          Your AI-powered life management assistant
        </motion.p>

        {/* Message bubble card */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="p-8 mb-8 backdrop-blur-sm bg-white/95">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Hi, how can I help you?
                </h2>
                <p className="text-gray-600 text-lg">
                  I'm here to help you manage your time, organize your tasks, and guide your career path.
                  Let's get to know each other with a few quick questions.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA button */}
        <motion.div
          className="flex justify-center"
          variants={itemVariants}
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="min-w-64 shadow-2xl"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Subtle helper text */}
        <motion.p
          className="text-center text-white/70 mt-6 text-sm"
          variants={itemVariants}
        >
          Only takes 2 minutes
        </motion.p>
      </motion.div>
    </div>
  )
}

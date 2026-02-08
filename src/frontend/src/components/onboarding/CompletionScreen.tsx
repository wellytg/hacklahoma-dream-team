import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, Target, Zap } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import GradientBackground from '../animations/GradientBackground'
import FloatingParticles from '../animations/FloatingParticles'
import Button from '../ui/Button'
import Card from '../ui/Card'

/**
 * Completion Screen - Shown after onboarding is complete
 * Provides positive reinforcement and transitions to dashboard
 */
export default function CompletionScreen() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const handleGetStarted = () => {
    // Navigate to main dashboard (to be implemented)
    navigate('/dashboard')
  }

  const duration = prefersReducedMotion ? 0 : 0.5
  const staggerDelay = prefersReducedMotion ? 0 : 0.15

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Plans that fit your energy and realistic schedule',
    },
    {
      icon: Target,
      title: 'Stress Reduction',
      description: 'Break down overwhelming tasks into manageable steps',
    },
    {
      icon: Zap,
      title: 'Focus Reminders',
      description: 'Stay on track with gentle nudges before distractions',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GradientBackground />
      <FloatingParticles />

      <motion.div
        className="max-w-3xl w-full z-10"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: staggerDelay }}
      >
        {/* Success icon */}
        <motion.div
          className="flex justify-center mb-8"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: duration * 1.5,
                ease: [0.34, 1.56, 0.64, 1],
              },
            },
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <Sparkles className="w-20 h-20 text-accent-500" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Success message */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white text-center mb-4 text-balance"
          variants={itemVariants}
        >
          Thanks for sharing! 🙂
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 text-center mb-12 text-balance"
          variants={itemVariants}
        >
          Based on this, I'll help you plan your day in a way that fits your energy, reduces stress, and keeps things realistic.
        </motion.p>

        {/* Features */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-12"
          variants={itemVariants}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/95 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary-600 mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="p-8 mb-6 bg-white/95 backdrop-blur-sm">
            <p className="text-center text-xl text-gray-700 mb-6">
              Let's start building your first calm and focused day 🌱
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full shadow-xl"
            >
              Start My Day
            </Button>
          </Card>
        </motion.div>

        <motion.p
          className="text-center text-white/70 text-sm"
          variants={itemVariants}
        >
          You can always adjust your preferences later
        </motion.p>
      </motion.div>
    </div>
  )
}

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GradientBackground from '../animations/GradientBackground'
import Button from '../ui/Button'

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  onBack?: () => void
  showBack?: boolean
}

/**
 * Layout wrapper for all onboarding screens
 * Provides consistent structure with progress indicator
 */
export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
}: OnboardingLayoutProps) {
  const navigate = useNavigate()
  const progress = (currentStep / totalSteps) * 100

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (currentStep === 1) {
      navigate('/welcome')
    } else {
      navigate(`/onboarding/question/${currentStep - 1}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <GradientBackground />

      {/* Header with progress */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            {showBack && currentStep >= 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

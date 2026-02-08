import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import OnboardingLayout from './OnboardingLayout'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface Question {
  id: number
  question: string
  subtitle?: string
  type: 'text' | 'select' | 'multiselect' | 'textarea'
  options?: string[]
  placeholder?: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "First, what should I call you?",
    type: 'text',
    placeholder: 'Enter your name',
  },
  {
    id: 2,
    question: "Which best describes you right now?",
    type: 'select',
    options: ['Student', 'Working Professional', 'Other'],
  },
  {
    id: 3,
    question: "Tell me a bit about your typical day.",
    subtitle: "You can answer briefly:\n• When do you usually start your day?\n• When does your main work or classes end?",
    type: 'textarea',
    placeholder: 'No worries — even an approximate schedule is perfect.',
  },
  {
    id: 4,
    question: "What's the biggest challenge you're facing right now?",
    subtitle: 'You can choose one or more:',
    type: 'multiselect',
    options: [
      'Managing my time',
      'Feeling stressed or overwhelmed',
      'Lack of focus or distractions',
      'Not sure about my goals',
    ],
  },
]

/**
 * Question Screen Component
 * Handles each step of the onboarding flow
 */
export default function QuestionScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const questionId = parseInt(id || '1', 10)
  const question = questions.find(q => q.id === questionId)

  const [textAnswer, setTextAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())

  if (!question) {
    return null
  }

  const handleContinue = () => {
    // Store answer (you can expand this with context/state management)
    if (questionId < 4) {
      navigate(`/onboarding/question/${questionId + 1}`)
    } else {
      // Navigate to summary or dashboard
      navigate('/onboarding/complete')
    }
  }

  const toggleMultiOption = (option: string) => {
    const newSelected = new Set(selectedOptions)
    if (newSelected.has(option)) {
      newSelected.delete(option)
    } else {
      newSelected.add(option)
    }
    setSelectedOptions(newSelected)
  }

  const isAnswered = () => {
    if (question.type === 'text' || question.type === 'textarea') {
      return textAnswer.trim().length > 0
    }
    if (question.type === 'select') {
      return selectedOption.length > 0
    }
    if (question.type === 'multiselect') {
      return selectedOptions.size > 0
    }
    return false
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <OnboardingLayout currentStep={questionId} totalSteps={4}>
      <Card variant="elevated" className="p-8 md:p-12 bg-white/95 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {/* Question heading */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance"
            variants={itemVariants}
          >
            {question.question}
          </motion.h2>

          {/* Subtitle if present */}
          {question.subtitle && (
            <motion.p
              className="text-lg text-gray-600 mb-8 whitespace-pre-line"
              variants={itemVariants}
            >
              {question.subtitle}
            </motion.p>
          )}

          {/* Answer input based on type */}
          <motion.div className="mb-8" variants={itemVariants}>
            {/* Text input */}
            {question.type === 'text' && (
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder={question.placeholder}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all"
                autoFocus
              />
            )}

            {/* Textarea input */}
            {question.type === 'textarea' && (
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder={question.placeholder}
                rows={6}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all resize-none"
                autoFocus
              />
            )}

            {/* Single select options */}
            {question.type === 'select' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full px-6 py-4 text-left text-lg rounded-xl border-2 transition-all ${
                      selectedOption === option
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedOption === option && (
                        <CheckCircle2 className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multi-select options */}
            {question.type === 'multiselect' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => toggleMultiOption(option)}
                    className={`w-full px-6 py-4 text-left text-lg rounded-xl border-2 transition-all ${
                      selectedOptions.has(option)
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedOptions.has(option) && (
                        <CheckCircle2 className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Continue button */}
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!isAnswered()}
              className="w-full"
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </OnboardingLayout>
  )
}

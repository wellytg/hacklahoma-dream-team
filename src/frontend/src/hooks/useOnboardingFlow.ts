import { useState } from 'react'

export interface OnboardingAnswer {
  questionId: number
  answer: string
}

/**
 * Hook to manage onboarding flow state
 * Tracks user's progress through the 5-question flow
 */
export function useOnboardingFlow() {
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([])
  const totalQuestions = 5

  const addAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId)
      return [...filtered, { questionId, answer }]
    })
  }

  const getAnswer = (questionId: number): string | undefined => {
    return answers.find(a => a.questionId === questionId)?.answer
  }

  const isComplete = (): boolean => {
    return answers.length === totalQuestions
  }

  const getProgress = (): number => {
    return (answers.length / totalQuestions) * 100
  }

  return {
    answers,
    addAnswer,
    getAnswer,
    isComplete,
    getProgress,
    totalQuestions,
  }
}

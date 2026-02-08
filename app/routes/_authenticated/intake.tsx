import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { IntakeProvider } from '~/context/IntakeContext'
import { IntakeFlow } from '~/components/IntakeFlow'
import { getProfile } from '../../../server/routes/profile'

export const Route = createFileRoute('/_authenticated/intake')({
  component: IntakePage,
})

function IntakePage() {
  const [isRetake, setIsRetake] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.profile?.intakeCompletedAt) {
          setIsRetake(true)
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <IntakeProvider>
      {isRetake && (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 text-center">
          <p className="text-amber-700 text-sm font-light">
            Your answers will be updated.
          </p>
        </div>
      )}
      <IntakeFlow isRetake={isRetake} />
    </IntakeProvider>
  )
}

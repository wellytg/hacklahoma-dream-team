import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProfile } from '../../../server/routes/profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

interface ProfileData {
  intent: string[]
  mode: string | null
  drains: string | null
  capabilities: string | null
  avoidanceRoot: string | null
  structurePref: string | null
  valueAlignment: string | null
  focusTime: string | null
  workBurst: string | null
  recovery: string | null
  learnStyle: string | null
  feedbackPref: string | null
  reminderPref: string | null
  intakeCompletedAt: string | null
}

const FIELD_LABELS: Array<{ key: keyof ProfileData; label: string }> = [
  { key: 'intent', label: 'Goals' },
  { key: 'mode', label: 'Conversation style' },
  { key: 'drains', label: 'What drains you' },
  { key: 'capabilities', label: 'Strengths' },
  { key: 'avoidanceRoot', label: 'Avoidance pattern' },
  { key: 'structurePref', label: 'Structure preference' },
  { key: 'valueAlignment', label: 'Values' },
  { key: 'focusTime', label: 'Best focus time' },
  { key: 'workBurst', label: 'Work burst style' },
  { key: 'recovery', label: 'Recovery method' },
  { key: 'learnStyle', label: 'Learning style' },
  { key: 'feedbackPref', label: 'Feedback preference' },
  { key: 'reminderPref', label: 'Reminder preference' },
]

function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.profile))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-500 font-light">No profile yet.</p>
        <Link to="/intake" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
          Complete intake
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/dashboard"
            className="p-1.5 -ml-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-stone-800">
            Your Profile
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100"
        >
          {FIELD_LABELS.map(({ key, label }) => {
            const value = profile[key]
            if (!value || (Array.isArray(value) && value.length === 0)) return null
            return (
              <div key={key} className="px-5 py-4">
                <dt className="text-xs text-stone-400 uppercase tracking-wide mb-1">{label}</dt>
                <dd className="text-sm text-stone-700">
                  {Array.isArray(value) ? value.join(', ') : value}
                </dd>
              </div>
            )
          })}
        </motion.div>

        <div className="mt-6 text-center">
          <Link
            to="/intake"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retake intake
          </Link>
        </div>
      </div>
    </div>
  )
}

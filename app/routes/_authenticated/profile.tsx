import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Brain,
  Clock,
  Heart,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { getProfile } from '../../../server/routes/profile'
import { label, resolveState } from '../../../shared/resolve'
import type { PersonaMode, ResolvedStateModel, StudentStateModel } from '../../../shared/types'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

const SummaryItem: React.FC<{
  icon: React.ReactNode
  title: string
  value: string
  sub?: string
}> = ({ icon, title, value, sub }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
      {icon}
    </div>
    <div>
      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
        {title}
      </h4>
      <p className="text-stone-800 font-medium">{value}</p>
      {sub && <p className="text-stone-500 text-sm font-light mt-0.5">{sub}</p>}
    </div>
  </div>
)

function ProfilePage() {
  const navigate = useNavigate()
  const [resolved, setResolved] = useState<ResolvedStateModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.profile) {
          const raw: StudentStateModel = {
            intent: res.profile.intent ?? [],
            mode: (res.profile.mode ?? 'ADAPTIVE') as PersonaMode,
            drains: res.profile.drains ?? '',
            capabilities: res.profile.capabilities ?? '',
            avoidanceRoot: res.profile.avoidanceRoot ?? '',
            structurePref: res.profile.structurePref ?? '',
            valueAlignment: res.profile.valueAlignment ?? '',
            focusTime: res.profile.focusTime ?? '',
            workBurst: res.profile.workBurst ?? '',
            recovery: res.profile.recovery ?? '',
            learnStyle: res.profile.learnStyle ?? '',
            feedbackPref: res.profile.feedbackPref ?? '',
            reminderPref: res.profile.reminderPref ?? '',
            accessNeeds: res.profile.accessNeeds ?? [],
          }
          setResolved(resolveState(raw))
        }
      })
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

  if (!resolved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-500 font-light">No profile yet.</p>
        <Link to="/intake" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
          Complete intake
        </Link>
      </div>
    )
  }

  const hasOverrides = Object.keys(resolved.overrides).length > 0

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back nav */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 p-1.5 -ml-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-stone-200/50 border border-stone-100 mb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={30} />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-stone-800">Here's how I'll support you</h3>
                <p className="text-stone-400 font-light">You can change any of this later.</p>
              </div>
            </div>

            {/* Core sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <SummaryItem icon={<Zap size={20} />} title="Mode" value={resolved.mode} />
                <SummaryItem
                  icon={<Brain size={20} />}
                  title="Primary Friction"
                  value={label(resolved.friction.primary)}
                  sub={
                    resolved.friction.strategy !== 'observe_and_adapt'
                      ? `Strategy: ${label(resolved.friction.strategy)}`
                      : undefined
                  }
                />
                <SummaryItem
                  icon={<Heart size={20} />}
                  title="Confidence Loop"
                  value={label(resolved.confidence.builder)}
                  sub={`Feedback: ${label(resolved.confidence.feedback_style)}`}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <SummaryItem
                  icon={<RefreshCw size={20} />}
                  title="Avoidance Reframe"
                  value={label(resolved.avoidance.root_cause)}
                  sub={label(resolved.avoidance.reframe)}
                />
                <SummaryItem
                  icon={<ShieldCheck size={20} />}
                  title="Scaffolding"
                  value={label(resolved.scaffolding.preference)}
                  sub={label(resolved.scaffolding.approach)}
                />
                <SummaryItem
                  icon={<Sparkles size={20} />}
                  title="Value Alignment"
                  value={label(resolved.values.meaningful_day)}
                  sub={label(resolved.values.productivity_framing)}
                />
              </div>
            </div>

            {/* Optional modules */}
            {(resolved.rhythm || resolved.learning || resolved.accessibility) && (
              <div className="mt-8 pt-8 border-t border-stone-100 space-y-6">
                {resolved.rhythm && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
                        Rhythm
                      </h4>
                      <p className="text-stone-700 text-sm">
                        Focus: {label(resolved.rhythm.focus_time)} &middot; Burst:{' '}
                        {label(resolved.rhythm.work_burst)} &middot; Recovery:{' '}
                        {label(resolved.rhythm.recovery)}
                      </p>
                    </div>
                  </div>
                )}
                {resolved.learning && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
                        Learning
                      </h4>
                      <p className="text-stone-700 text-sm">
                        Style: {label(resolved.learning.style)} &middot; Feedback:{' '}
                        {label(resolved.learning.feedback)} &middot; Reminders:{' '}
                        {label(resolved.learning.reminders)}
                      </p>
                    </div>
                  </div>
                )}
                {resolved.accessibility && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                      <Accessibility size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
                        Accessibility
                      </h4>
                      <p className="text-stone-700 text-sm">
                        {resolved.accessibility.needs.map((n) => label(n)).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conflict overrides */}
            {hasOverrides && (
              <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <h4 className="text-sm font-semibold text-amber-800">
                    Adjustments based on your answers
                  </h4>
                </div>
                <div className="space-y-2">
                  {(
                    Object.entries(resolved.overrides) as [
                      string,
                      { active: boolean; note: string },
                    ][]
                  )
                    .filter(([, o]) => o.active)
                    .map(([key, override]) => (
                      <p key={key} className="text-amber-700 text-sm font-light">
                        {override.note}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {/* Summary paragraph */}
            <div className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-stone-600 font-light italic leading-relaxed">
                "I'll adapt our interaction to focus on{' '}
                {resolved.intent.length > 0
                  ? resolved.intent.map((i) => label(i)).join(' and ')
                  : 'finding your rhythm'}
                . We'll start by reducing {label(resolved.friction.primary).toLowerCase()} pressure
                and focusing on {label(resolved.confidence.builder).toLowerCase()} to build
                momentum."
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => navigate({ to: '/intake' })}
              className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium tracking-wide"
            >
              Reset and restart flow
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: '/dashboard' })}
              className="px-10 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
            >
              Confirm & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

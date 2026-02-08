import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageCircle, RefreshCw, Clock } from 'lucide-react'
import { getScheduledActions } from '../../server/routes/chat'
import type { ScheduledAction } from '../../shared/types'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [actions, setActions] = useState<ScheduledAction[]>([])
  const [loadingActions, setLoadingActions] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getScheduledActions()
        setActions(result.actions)
      } catch {
        // If not authenticated, actions will just be empty
      } finally {
        setLoadingActions(false)
      }
    }
    load()
  }, [])

  const statusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50'
      case 'missed':
        return 'text-amber-600 bg-amber-50'
      case 'cancelled':
        return 'text-stone-400 bg-stone-100'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-light text-stone-800 mb-6">Dashboard</h1>
        <p className="text-stone-500 mb-8">Welcome back. Your journey continues here.</p>

        <div className="grid gap-4 mb-10">
          <Link
            to="/chat"
            className="block p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-1">
              <MessageCircle className="w-5 h-5 text-stone-600" />
              <h3 className="font-medium text-stone-800">Talk to Sensei</h3>
            </div>
            <p className="text-stone-400 text-sm font-light ml-8">
              Start a conversation about what you want to improve.
            </p>
          </Link>

          <Link
            to="/intake"
            className="block p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-1">
              <RefreshCw className="w-5 h-5 text-stone-600" />
              <h3 className="font-medium text-stone-800">Retake Intake</h3>
            </div>
            <p className="text-stone-400 text-sm font-light ml-8">
              Update your preferences and profile.
            </p>
          </Link>
        </div>

        {/* Scheduled Actions */}
        <div>
          <h2 className="text-lg font-serif font-light text-stone-700 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Scheduled Actions
          </h2>

          {loadingActions ? (
            <p className="text-stone-400 text-sm">Loading...</p>
          ) : actions.length === 0 ? (
            <p className="text-stone-400 text-sm font-light">
              No scheduled actions yet. Talk to Sensei to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {actions.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-stone-800 text-sm">{action.title}</h3>
                      {action.description && (
                        <p className="text-stone-400 text-xs mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(action.scheduledAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        {action.goalArea && (
                          <span className="text-stone-400">{action.goalArea}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(action.status)}`}
                      >
                        {action.status ?? 'pending'}
                      </span>
                      {action.status === 'pending' && action.reflectionScheduledAt && (
                        <Link
                          to="/chat"
                          search={{ mode: 'reflection', action: action.id }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                        >
                          Reflect
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

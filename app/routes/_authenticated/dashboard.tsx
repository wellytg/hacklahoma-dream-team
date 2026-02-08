import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  ListChecks,
  LogOut,
  MessageCircle,
  Trash2,
  User,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '~/context/AuthContext'
import { deleteScheduledAction, getScheduledActions } from '../../../server/routes/chat'
import { getProfile } from '../../../server/routes/profile'
import type { ScheduledAction } from '../../../shared/types'
import { ActionCardSkeleton } from '../../components/ActionCardSkeleton'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [actions, setActions] = useState<ScheduledAction[]>([])
  const [loadingActions, setLoadingActions] = useState(true)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [viewFilter, setViewFilter] = useState<'completed' | 'missed' | null>(null)

  // Guard: redirect to intake if no profile
  useEffect(() => {
    getProfile()
      .then((res) => {
        if (!res.profile?.intakeCompletedAt) {
          navigate({ to: '/intake' })
        }
      })
      .catch(() => {
        // If profile check fails, let them stay (auth guard handles unauthed)
      })
      .finally(() => setCheckingProfile(false))
  }, [navigate])

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

  const statusInfo = (status: string | null) => {
    switch (status) {
      case 'completed':
        return { color: 'text-emerald-600 bg-emerald-50', Icon: CheckCircle }
      case 'missed':
        return { color: 'text-amber-600 bg-amber-50', Icon: AlertCircle }
      case 'cancelled':
        return { color: 'text-stone-400 bg-stone-100', Icon: XCircle }
      default:
        return { color: 'text-blue-600 bg-blue-50', Icon: Clock }
    }
  }

  const stats = !loadingActions
    ? {
        total: actions.length,
        completed: actions.filter((a) => a.status === 'completed').length,
        missed: actions.filter((a) => a.status === 'missed').length,
        pending: actions.filter((a) => !a.status || a.status === 'pending').length,
      }
    : null

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-stone-800">Dashboard</h1>
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
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
            to="/profile"
            className="block p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-1">
              <User className="w-5 h-5 text-stone-600" />
              <h3 className="font-medium text-stone-800">Your Profile</h3>
            </div>
            <p className="text-stone-400 text-sm font-light ml-8">
              View your preferences and conversation style.
            </p>
          </Link>
        </div>

        {/* Stat Cards */}
        {stats && actions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              {
                label: 'Total',
                value: stats.total,
                Icon: ListChecks,
                accent: 'text-stone-600',
                filter: null as 'completed' | 'missed' | null,
              },
              {
                label: 'Completed',
                value: stats.completed,
                Icon: CheckCircle,
                accent: 'text-emerald-600',
                filter: 'completed' as const,
              },
              {
                label: 'Missed',
                value: stats.missed,
                Icon: AlertCircle,
                accent: 'text-amber-600',
                filter: 'missed' as const,
              },
              {
                label: 'Pending',
                value: stats.pending,
                Icon: Clock,
                accent: 'text-blue-600',
                filter: null as 'completed' | 'missed' | null,
              },
            ].map((stat) => {
              const isPending = stat.label === 'Pending'
              const isClickable = stat.filter !== null || (isPending && viewFilter !== null)
              const isActive =
                stat.filter !== null ? viewFilter === stat.filter : isPending && viewFilter === null
              return (
                <button
                  type="button"
                  key={stat.label}
                  onClick={
                    isClickable
                      ? () => setViewFilter((prev) => (prev === stat.filter ? null : stat.filter))
                      : undefined
                  }
                  className={`bg-white rounded-2xl border p-4 flex flex-col items-center gap-1 transition-all ${
                    isActive ? 'border-stone-400 ring-2 ring-stone-300' : 'border-stone-200'
                  } ${isClickable ? 'cursor-pointer hover:border-stone-300 hover:shadow-sm' : 'cursor-default'}`}
                >
                  <stat.Icon className={`w-4 h-4 ${stat.accent}`} />
                  <span className="text-2xl font-serif font-light text-stone-800">
                    {stat.value}
                  </span>
                  <span className="text-xs text-stone-400">{stat.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Actions List */}
        <div>
          <h2 className="text-lg font-serif font-light text-stone-700 mb-4 flex items-center gap-2">
            {viewFilter === 'completed' ? (
              <>
                <CheckCircle className="w-5 h-5" /> Completed Actions
              </>
            ) : viewFilter === 'missed' ? (
              <>
                <AlertCircle className="w-5 h-5" /> Missed Actions
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" /> Scheduled Actions
              </>
            )}
          </h2>

          {(() => {
            const filteredActions = actions.filter((a) => {
              if (viewFilter === 'completed') return a.status === 'completed'
              if (viewFilter === 'missed') return a.status === 'missed'
              return !a.status || a.status === 'pending'
            })
            return loadingActions ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <ActionCardSkeleton key={i} index={i} />
                ))}
              </div>
            ) : actions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
                <CalendarDays className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-light mb-4">
                  No scheduled actions yet. Start a conversation to set your first goal.
                </p>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 bg-stone-800 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Talk to Sensei
                </Link>
              </div>
            ) : filteredActions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
                <CalendarDays className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-light">
                  {viewFilter === 'completed'
                    ? 'No completed actions yet.'
                    : viewFilter === 'missed'
                      ? 'No missed actions.'
                      : 'No pending actions. Start a conversation to set your next goal.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActions.map((action, i) => {
                  const { color, Icon: StatusIcon } = statusInfo(action.status)
                  return (
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
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {action.status ?? 'pending'}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await deleteScheduledAction({ data: { actionId: action.id } })
                                  setActions((prev) => prev.filter((a) => a.id !== action.id))
                                } catch {
                                  // Silently fail — action may already be deleted
                                }
                              }}
                              className="p-1 rounded text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete action"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {action.status === 'pending' &&
                            action.reflectionScheduledAt &&
                            (new Date(action.reflectionScheduledAt) <= new Date() ? (
                              <Link
                                to="/chat"
                                search={{ mode: 'reflection', action: action.id }}
                                className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full hover:bg-emerald-700 transition-colors"
                              >
                                Reflect now
                              </Link>
                            ) : (
                              <span className="text-xs text-stone-400">
                                Reflect{' '}
                                {formatDistanceToNow(new Date(action.reflectionScheduledAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useAuth } from '~/context/AuthContext'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600">
          <Sparkles size={40} />
        </div>

        <h1 className="text-5xl font-serif font-light text-stone-800 mb-4">Sensei</h1>
        <p className="text-stone-500 text-lg leading-relaxed font-light mb-12">
          Your personal guide to building better habits, managing energy, and making progress that
          sticks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={login}
            className="px-10 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
          >
            Help me help you
          </button>
          <button
            type="button"
            onClick={login}
            className="px-10 py-4 bg-white text-stone-700 rounded-full font-medium border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            Log in
          </button>
        </div>
      </motion.div>
    </div>
  )
}

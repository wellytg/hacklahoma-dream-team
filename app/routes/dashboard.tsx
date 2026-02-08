import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-light text-stone-800 mb-6">Dashboard</h1>
        <p className="text-stone-500 mb-8">Welcome back. Your journey continues here.</p>

        <div className="grid gap-4">
          <Link
            to="/chat"
            className="block p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            <h3 className="font-medium text-stone-800 mb-1">Talk to Sensei</h3>
            <p className="text-stone-400 text-sm font-light">Start a conversation about what you want to improve.</p>
          </Link>

          <Link
            to="/intake"
            className="block p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
          >
            <h3 className="font-medium text-stone-800 mb-1">Retake Intake</h3>
            <p className="text-stone-400 text-sm font-light">Update your preferences and profile.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

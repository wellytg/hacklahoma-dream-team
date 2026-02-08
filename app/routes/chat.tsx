import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-light text-stone-800 mb-6">Sensei</h1>
        <p className="text-stone-500">Chat interface will be implemented in Phase 2 (WS-D).</p>
      </div>
    </div>
  )
}

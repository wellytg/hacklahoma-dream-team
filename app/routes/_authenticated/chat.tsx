import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarCheck, LogOut, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { useAuth } from '~/context/AuthContext'
import { sendMessage, startSession } from '../../../server/routes/chat'
import type { ChatMessage } from '../../../shared/types'
import { TypingIndicator } from '../../components/TypingIndicator'

interface ChatSearch {
  mode?: 'reflection'
  action?: string
}

export const Route = createFileRoute('/_authenticated/chat')({
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>): ChatSearch => ({
    mode: search.mode === 'reflection' ? 'reflection' : undefined,
    action: typeof search.action === 'string' ? search.action : undefined,
  }),
})

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return 'Just now'
  return formatDistanceToNow(new Date(iso), { addSuffix: true })
}

const mdComponents = {
  p: (props: React.ComponentProps<'p'>) => <p className="mb-2 last:mb-0" {...props} />,
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong className="font-semibold text-stone-800" {...props} />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="list-disc list-inside space-y-1 my-2" {...props} />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
  ),
}

interface ScheduledActionUI {
  actionId: string
  title: string
  calendarHtmlLink?: string
}

function ChatPage() {
  const search = useSearch({ from: '/_authenticated/chat' })
  const { logout } = useAuth()
  const isReflection = search.mode === 'reflection'
  const actionId = search.action

  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [interactionId, setInteractionId] = useState<string | null>(null)
  const [scheduledActions, setScheduledActions] = useState<ScheduledActionUI[]>([])

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Initialize session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const mode = isReflection ? 'reflection' : 'sensei_session'
        const result = await startSession({ data: { mode, actionId } })
        setInteractionId(result.interactionId)
      } catch {
        console.error('Failed to start session')
      }
    }
    init()
  }, [isReflection, actionId])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || !interactionId || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    setMsgs((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const result = await sendMessage({
        data: { interactionId, content: text, actionId },
      })
      setMsgs((prev) => [...prev, result.message])

      if (result.actions && result.actions.length > 0) {
        setScheduledActions((prev) => {
          const existing = new Set(prev.map((a) => a.actionId))
          const newActions = result.actions.filter(
            (a: ScheduledActionUI) => !existing.has(a.actionId),
          )
          return [...prev, ...newActions]
        })
      }
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: 'Something went wrong. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, interactionId, loading, actionId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 -ml-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-serif font-light text-stone-800">
                {isReflection ? 'Reflection' : 'Sensei'}
              </h1>
              {isReflection && (
                <p className="text-xs text-stone-400 mt-0.5">Reflecting on your action</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          {msgs.length === 0 && !loading && (
            <p className="text-stone-400 text-center py-12 font-light">
              {interactionId ? 'Send a message to begin.' : 'Starting session...'}
            </p>
          )}

          <AnimatePresence mode="popLayout">
            {msgs.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-stone-800 text-white'
                      : msg.role === 'system'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <Markdown components={mdComponents}>{msg.content}</Markdown>
                  )}
                </div>
                <span className="text-xs text-stone-400 mt-1 px-1">
                  {formatTimestamp(msg.createdAt)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Scheduled action confirmations */}
          <AnimatePresence>
            {scheduledActions.map((action) => (
              <motion.div
                key={action.actionId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                {action.calendarHtmlLink ? (
                  <a
                    href={action.calendarHtmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl px-4 py-3 text-sm hover:bg-emerald-100 transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4 shrink-0" />
                    <span>Scheduled: {action.title}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl px-4 py-3 text-sm">
                    <CalendarCheck className="w-4 h-4 shrink-0" />
                    <span>Scheduled: {action.title}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 bg-white/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              disabled={!interactionId || loading}
              className="flex-1 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:opacity-50"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !interactionId || loading}
              className="shrink-0 rounded-xl bg-stone-800 p-3 text-white hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Client-side auth context.
 *
 * Checks the session on mount via the `getMe` server function and exposes
 * `user`, `loading`, `login`, and `logout` to the component tree.
 */

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { getLoginUrl, getMe, logout as logoutFn } from '../../server/routes/auth'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface User {
  id: string
  email: string
  name: string | null
}

interface AuthContextValue {
  /** The authenticated user, or `null` when logged out / unknown. */
  user: User | null
  /** True while the initial session check is in-flight. */
  loading: boolean
  /** Redirect to Google OAuth. */
  login: () => void
  /** Clear the session and reset local state. */
  logout: () => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    let cancelled = false

    getMe()
      .then((res) => {
        if (!cancelled) setUser(res.user)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(() => {
    getLoginUrl()
      .then((res) => {
        window.location.href = res.url
      })
      .catch((err) => {
        console.error('Failed to get login URL:', err)
      })
  }, [])

  const logout = useCallback(() => {
    logoutFn()
      .then((_res) => {
        // The server function returns the clear-cookie header value.
        // TanStack Start should apply it via the server response.
        // On the client, we just reset state and redirect.
        setUser(null)
        window.location.href = '/'
      })
      .catch((err) => {
        console.error('Logout failed:', err)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

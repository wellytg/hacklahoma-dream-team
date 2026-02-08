/**
 * /auth/login route.
 *
 * Redirects the browser to the Google OAuth authorization URL.
 * Shows a brief loading state while the server function resolves.
 */

import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getLoginUrl } from '../../../server/routes/auth'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  useEffect(() => {
    getLoginUrl()
      .then((res) => {
        window.location.href = res.url
      })
      .catch((err) => {
        console.error('Failed to initiate login:', err)
      })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <p>Redirecting to Google&hellip;</p>
    </div>
  )
}

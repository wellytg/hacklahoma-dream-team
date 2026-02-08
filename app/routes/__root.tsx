/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type * as React from 'react'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { AuthProvider } from '~/context/AuthContext'
import globalsCss from '~/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Sensei' },
    ],
    links: [{ rel: 'stylesheet', href: globalsCss }],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-stone-50 text-stone-900">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
          <Outlet />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

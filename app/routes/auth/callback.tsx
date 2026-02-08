/**
 * /auth/callback route.
 *
 * Google redirects here after the user authorizes. We extract the `code`
 * query parameter, exchange it for tokens via the server function, and
 * redirect to the dashboard.
 */

import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { handleAuthCallback } from '../../../server/routes/auth';

interface CallbackSearch {
  code?: string;
  error?: string;
}

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: CallbackPage,
});

function CallbackPage() {
  const { code, error } = useSearch({ from: '/auth/callback' });
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setStatus('error');
      setErrorMessage(`Google authorization failed: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('Missing authorization code.');
      return;
    }

    handleAuthCallback({ data: { code } })
      .then(() => {
        // Session cookie is set by the server response.
        // Navigate to the dashboard.
        navigate({ to: '/' });
      })
      .catch((err: unknown) => {
        console.error('Auth callback failed:', err);
        setStatus('error');
        setErrorMessage('Login failed. Please try again.');
      });
  }, [code, error, navigate]);

  if (status === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '1rem' }}>
        <p style={{ color: '#dc2626' }}>{errorMessage}</p>
        <a href="/auth/login">Try again</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <p>Completing sign-in&hellip;</p>
    </div>
  );
}

/**
 * /auth/callback route.
 *
 * Google redirects here after the user authorizes. We extract the `code`
 * query parameter, exchange it for tokens via the server function, and
 * redirect based on profile state.
 */

import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { handleAuthCallback } from '../../../server/routes/auth';
import { getProfile } from '../../../server/routes/profile';

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
      .then(async () => {
        // Session cookie is set by the server response.
        // Check profile to decide where to send the user.
        try {
          const { profile } = await getProfile();
          if (profile?.intakeCompletedAt) {
            navigate({ to: '/dashboard' });
          } else {
            navigate({ to: '/intake' });
          }
        } catch {
          // Profile check failed — default to intake
          navigate({ to: '/intake' });
        }
      })
      .catch((err: unknown) => {
        console.error('Auth callback failed:', err);
        setStatus('error');
        setErrorMessage('Login failed. Please try again.');
      });
  }, [code, error, navigate]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{errorMessage}</p>
        <a href="/" className="text-stone-500 hover:text-stone-700 underline">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-stone-500">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        <p>Completing sign-in&hellip;</p>
      </div>
    </div>
  );
}

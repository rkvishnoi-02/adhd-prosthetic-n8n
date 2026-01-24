/**
 * Global Error Boundary (Next.js App Router)
 * Catches errors in any component and displays graceful fallback
 */

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600">
            Don't worry, it's not your fault.
          </p>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-mono">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Try again"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = '/chat')}
            className="w-full px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Go to chat"
          >
            Go to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

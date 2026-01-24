/**
 * 404 Not Found Page
 * Displayed when user navigates to non-existent route
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600">
            This page doesn't exist.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-block px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Go to Chat
        </Link>
      </div>
    </div>
  );
}

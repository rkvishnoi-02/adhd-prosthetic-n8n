'use client';

import { useState, useTransition } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Use startTransition for non-urgent UI update (vercel-react: rerender-transitions)
    startTransition(async () => {
      try {
        if (mode === 'signup') {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) throw signUpError;
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
        }

        // Success - redirect handled by middleware
        onSuccess?.();
        window.location.href = '/chat';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
          disabled={isPending}
          autoComplete="email"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
          disabled={isPending}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
}

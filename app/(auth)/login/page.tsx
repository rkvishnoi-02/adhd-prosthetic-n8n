import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Sign in to continue to Anchor
        </p>
      </div>

      {/* Form */}
      <AuthForm mode="login" />

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

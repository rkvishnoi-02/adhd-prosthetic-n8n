import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-600">
          Your external executive brain
        </p>
      </div>

      {/* Form */}
      <AuthForm mode="signup" />

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

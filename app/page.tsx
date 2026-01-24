import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Anchor</h1>
          <p className="text-xl text-gray-600 mb-2">ADHD Cognitive Prosthetic</p>
          <p className="text-sm text-gray-500">Your external executive brain</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 text-base font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Global Loading State
 * Shown during page transitions
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200" />
        </div>
        <p className="text-gray-600">Loading…</p>
      </div>
    </div>
  );
}

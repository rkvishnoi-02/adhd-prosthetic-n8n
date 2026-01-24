/**
 * Onboarding Flow (as @frontend-builder)
 * ADHD-friendly progressive disclosure: one question per screen
 *
 * Applies:
 * - Web Guidelines: Proper labels, focus management, inline errors
 * - React Best Practices: useTransition, hoist static JSX
 * - ADHD Design: Single column, large text, generous spacing
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

// Hoist static content (vercel: rendering-hoist-jsx)
const STEPS = {
  WELCOME: 0,
  NAME: 1,
  ROLE: 2,
  PROJECT: 3,
  WHY: 4,
  TUTORIAL: 5,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.WELCOME);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [currentProject, setCurrentProject] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    // Validate current step (web-guidelines: inline error display)
    if (step === STEPS.NAME && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleSkip = () => {
    setError('');
    setStep((prev) => prev + 1);
  };

  const handleFinish = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Use startTransition (vercel: rerender-transitions)
    startTransition(async () => {
      try {
        // Get user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('Not authenticated');
        }

        // Save identity
        const response = await fetch('/api/memory/identity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            role: role.trim(),
            currentProject: currentProject.trim(),
            whyItMatters: whyItMatters.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save identity');
        }

        // Redirect to chat
        router.push('/chat');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Welcome Step */}
        {step === STEPS.WELCOME && (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome to Anchor
              </h1>
              <p className="text-xl text-gray-600">
                Your ADHD cognitive prosthetic
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-left space-y-3">
              <p className="text-gray-700">
                I'm here to reduce overwhelm and help you think clearly.
              </p>
              <p className="text-gray-700">
                Not a productivity app. A brain extension.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Get started with onboarding"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Name Step */}
        {step === STEPS.NAME && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What's your name?
              </h2>
              <p className="text-gray-600">So I can personalize your experience</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder="e.g., Alex…"
                autoFocus
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-describedby={error ? 'name-error' : undefined}
                spellCheck={false}
              />
              {/* Inline error (web-guidelines) */}
              {error && (
                <p
                  id="name-error"
                  className="mt-2 text-sm text-red-700"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Continue to next step"
            >
              Continue
            </button>
          </div>
        )}

        {/* Role Step */}
        {step === STEPS.ROLE && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What do you do?
              </h2>
              <p className="text-gray-600">Your role or profession</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role (optional)
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder="e.g., Designer, Developer, Student…"
                autoFocus
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Project Step */}
        {step === STEPS.PROJECT && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What are you working on?
              </h2>
              <p className="text-gray-600">Your main focus right now</p>
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Current Project (optional)
              </label>
              <input
                id="project"
                type="text"
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder="e.g., Thesis, Portfolio, Side project…"
                autoFocus
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Why It Matters Step */}
        {step === STEPS.WHY && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Why does it matter?
              </h2>
              <p className="text-gray-600">What makes this important to you?</p>
            </div>

            <div>
              <label htmlFor="why" className="block text-sm font-medium text-gray-700 mb-2">
                Why It Matters (optional)
              </label>
              <textarea
                id="why"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="e.g., Career growth, Graduate on time…"
                rows={4}
                autoFocus
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                spellCheck={false}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Tutorial Step */}
        {step === STEPS.TUTORIAL && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quick Tutorial
              </h2>
              <p className="text-gray-600">Learn the 4 modes</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <code className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded font-mono text-sm mb-2">
                  @dump
                </code>
                <p className="text-gray-700">Mental offload—just unload thoughts</p>
              </div>

              <div>
                <code className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm mb-2">
                  @do
                </code>
                <p className="text-gray-700">Break task into tiny steps</p>
              </div>

              <div>
                <code className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm mb-2">
                  @clarity
                </code>
                <p className="text-gray-700">Get clarifying questions</p>
              </div>

              <div>
                <code className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded font-mono text-sm mb-2">
                  @ground
                </code>
                <p className="text-gray-700">Overwhelm rescue</p>
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={isPending}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={isPending ? 'Finishing setup…' : 'Finish setup and start chatting'}
            >
              {isPending ? 'Finishing Setup…' : 'Start Chatting'}
            </button>

            {error && (
              <p className="text-sm text-red-700 text-center" role="alert" aria-live="polite">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        {step > STEPS.WELCOME && (
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Step {step} of 5
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

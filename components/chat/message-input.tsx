/**
 * Message Input Component
 * Text area with mode detection and accessibility
 */

'use client';

import { useState, useTransition, useRef, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = isPending || disabled;

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;

    const messageToSend = message;
    setMessage(''); // Clear immediately for better UX

    // Use startTransition for non-urgent UI update (vercel: rerender-transitions)
    startTransition(async () => {
      try {
        await onSend(messageToSend);
      } catch (error) {
        // Restore message on error
        setMessage(messageToSend);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (Shift+Enter for newline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Reset height to auto to get correct scrollHeight
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="flex gap-3 items-end">
        {/* Text input */}
        <div className="flex-1">
          <label htmlFor="message-input" className="sr-only">
            Message
          </label>
          <textarea
            ref={textareaRef}
            id="message-input"
            rows={1}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type a message… (try @dump, @do, @clarity, @ground)"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              maxHeight: '200px',
              minHeight: '52px',
            }}
            // Accessibility
            aria-label="Type your message"
            aria-describedby="message-hint"
          />
          <p id="message-hint" className="sr-only">
            Press Enter to send, Shift+Enter for new line. Use mode triggers like @dump or @do for specific AI modes.
          </p>
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          // Accessibility (web-guidelines: semantic button with aria-label)
          aria-label={isLoading ? 'Sending message…' : 'Send message'}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending…</span>
            </span>
          ) : (
            'Send'
          )}
        </button>
      </div>

      {/* Mode hint */}
      {message.startsWith('@') && (
        <div
          className="mt-2 text-sm text-gray-600"
          role="status"
          aria-live="polite"
        >
          Mode detected:{' '}
          <span className="font-medium">
            {message.split(' ')[0]}
          </span>
        </div>
      )}
    </div>
  );
}

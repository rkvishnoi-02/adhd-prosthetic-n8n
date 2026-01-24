/**
 * Message Bubble Component
 * Displays user or assistant messages with proper accessibility
 */

import { ModeType } from '@/types';
import { ModeBadge } from './mode-badge';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  mode?: ModeType | null;
  timestamp: Date;
}

export function MessageBubble({ role, content, mode, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      // Accessibility: identify message role
      role="article"
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
        style={{
          // ADHD-friendly: Ensure min-width for truncation (vercel: rerender-memo)
          minWidth: 0,
        }}
      >
        {/* Mode badge for assistant messages */}
        {!isUser && mode && (
          <div className="mb-2">
            <ModeBadge mode={mode} />
          </div>
        )}

        {/* Message content with proper text wrapping */}
        <div
          className="text-base leading-relaxed break-words whitespace-pre-wrap"
          // Accessibility: mark as main content
          role="region"
          aria-label="Message content"
        >
          {content}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <time dateTime={timestamp.toISOString()}>
            {timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </time>
        </div>
      </div>
    </div>
  );
}

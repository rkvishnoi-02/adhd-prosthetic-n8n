/**
 * Message List Component
 * Displays chat messages with auto-scroll and virtualization
 */

'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageBubble } from './message-bubble';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  // (vercel: rerender-move-effect-to-event - this is actual effect use case)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6"
      // Accessibility: scrollable region
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      // Performance: enable content-visibility for long lists (vercel: rendering-content-visibility)
      style={{
        contentVisibility: messages.length > 50 ? 'auto' : 'visible',
      }}
    >
      {/* Empty state */}
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-full text-center">
          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-900">
              Welcome to Anchor
            </p>
            <p className="text-gray-600">
              Start typing to chat, or use a mode:
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p><code className="bg-gray-100 px-2 py-1 rounded">@dump</code> - Mental offload</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">@do</code> - Break into steps</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">@clarity</code> - Ask questions</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">@ground</code> - Overwhelm rescue</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              mode={message.mode as any}
              timestamp={new Date(message.created_at)}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div
              className="flex justify-start mb-4"
              // Accessibility: announce loading state
              role="status"
              aria-live="polite"
              aria-label="Assistant is typing"
            >
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

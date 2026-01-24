/**
 * Chat Page - Main chat interface
 * Integrates message list, input, and API communication
 */

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Message } from '@/types';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Load user and messages on mount
  // (vercel: rerender-lazy-state-init - expensive initial state)
  useEffect(() => {
    const initializeChat = async () => {
      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      // Check if user has completed onboarding
      const identityResponse = await fetch('/api/memory/identity');
      if (identityResponse.ok) {
        const { identity } = await identityResponse.json();

        // Redirect to onboarding if no identity exists
        if (!identity) {
          window.location.href = '/onboarding';
          return;
        }
      }

      // Load recent messages
      const { data: recentMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (recentMessages) {
        setMessages(recentMessages);
      }

      setIsLoading(false);
    };

    initializeChat();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        window.location.href = '/login';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    setIsSending(true);

    try {
      // Optimistically add user message to UI
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        role: 'user',
        content,
        mode: null,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: `temp-${Date.now()}-assistant`,
        user_id: user.id,
        role: 'assistant',
        content: data.reply,
        mode: data.mode,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reload messages from database to get real IDs
      const { data: updatedMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (updatedMessages) {
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.slice(0, -1));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Anchor</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isSending} />

      {/* Input */}
      <MessageInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  );
}

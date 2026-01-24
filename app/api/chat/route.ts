/**
 * API Route: Chat Endpoint (Clean Architecture)
 * Controller layer - handles HTTP concerns only
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProcessChatMessageUseCase } from '@/lib/use-cases/process-chat-message';
import { OpenAIProvider } from '@/lib/adapters/openai-provider';
import { SupabaseMessageRepository } from '@/lib/adapters/supabase-message-repository';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 3. Dependency injection (adapters)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const aiProvider = new OpenAIProvider(apiKey);
    const messageRepository = new SupabaseMessageRepository();

    // 4. Execute use case
    const useCase = new ProcessChatMessageUseCase(
      aiProvider,
      messageRepository
    );

    const response = await useCase.execute({
      userId: user.id,
      message,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to process message' },
        { status: 500 }
      );
    }

    // 5. Return response
    return NextResponse.json({
      reply: response.reply,
      mode: response.mode,
      suggestedMode: response.suggestedMode,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

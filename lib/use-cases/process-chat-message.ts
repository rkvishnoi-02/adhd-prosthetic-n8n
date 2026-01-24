/**
 * Use Case: Process Chat Message (Clean Architecture)
 * Application business logic - orchestrates domain services
 *
 * Now includes session tracking for cognitive state
 */

import { detectMode, stripModeTrigger } from '@/lib/ai/modes';
import { buildPrompt } from '@/lib/ai/orchestrator';
import { validateTone, fixTone } from '@/lib/ai/validator';
import { getIdentity } from '@/lib/memory/identity';
import {
  getCurrentSession,
  updateCognitiveState,
  detectCognitiveState,
  startSession,
} from '@/lib/memory/session';
import { IAIProvider } from '@/lib/domain/interfaces/ai-provider';
import { IMessageRepository } from '@/lib/domain/interfaces/message-repository';
import { ModeType } from '@/types';

export interface ProcessChatMessageRequest {
  userId: string;
  message: string;
}

export interface ProcessChatMessageResponse {
  reply: string;
  mode: ModeType | null;
  suggestedMode?: ModeType;
  success: boolean;
  error?: string;
}

export class ProcessChatMessageUseCase {
  constructor(
    private aiProvider: IAIProvider,
    private messageRepository: IMessageRepository
  ) {}

  async execute(
    request: ProcessChatMessageRequest
  ): Promise<ProcessChatMessageResponse> {
    try {
      const { userId, message } = request;

      // 1. Detect mode and cognitive state
      const mode = detectMode(message);
      const cleanMessage = stripModeTrigger(message);
      const cognitiveState = detectCognitiveState(message);

      // 2. Update session tracking
      let session = await getCurrentSession(userId);
      if (!session) {
        session = await startSession(userId, cognitiveState);
      } else {
        await updateCognitiveState(userId, cognitiveState);
      }

      // 3. Load user identity
      const identity = await getIdentity(userId);

      // 4. Build layered prompt (with session context)
      const systemPrompt = await buildPrompt(cleanMessage, mode, {
        name: identity?.name,
        role: identity?.role,
        currentProject: identity?.currentProject,
        whyItMatters: identity?.whyItMatters,
      });

      // 5. Call AI provider (adapter)
      const aiResponse = await this.aiProvider.generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: cleanMessage },
      ]);

      let reply = aiResponse.content;

      // 6. Validate tone
      const maxLines = mode?.maxLines || 5;
      const validation = validateTone(reply, maxLines);

      if (!validation.valid) {
        // Attempt auto-fix
        reply = fixTone(reply, validation.issues);
      }

      // 7. Save messages to database (repository)
      await this.messageRepository.save({
        user_id: userId,
        role: 'user',
        content: message,
        mode: mode?.trigger || null,
      });

      await this.messageRepository.save({
        user_id: userId,
        role: 'assistant',
        content: reply,
        mode: mode?.trigger || null,
      });

      return {
        reply,
        mode: mode?.trigger || null,
        success: true,
      };
    } catch (error) {
      return {
        reply: '',
        mode: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

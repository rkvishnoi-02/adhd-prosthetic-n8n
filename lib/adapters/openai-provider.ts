/**
 * Adapter: OpenAI Provider Implementation (Clean Architecture)
 * Infrastructure layer - concrete implementation
 */

import OpenAI from 'openai';
import { IAIProvider, AIMessage, AIResponse } from '@/lib/domain/interfaces/ai-provider';

export class OpenAIProvider implements IAIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: AIMessage[],
    maxTokens: number = 150
  ): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      const choice = completion.choices[0];

      return {
        content: choice.message?.content || '',
        finishReason: choice.finish_reason === 'stop' ? 'stop' : 'length',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      throw new Error(
        `OpenAI API error: ${error instanceof Error ? error.message : 'Unknown'}`
      );
    }
  }
}

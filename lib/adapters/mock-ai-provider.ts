/**
 * Adapter: Mock AI Provider (for testing)
 * Test double - no external dependencies
 */

import { IAIProvider, AIMessage, AIResponse } from '@/lib/domain/interfaces/ai-provider';

export class MockAIProvider implements IAIProvider {
  constructor(private mockResponse: string = 'Mock AI response') {}

  async generateCompletion(
    messages: AIMessage[],
    maxTokens?: number
  ): Promise<AIResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      content: this.mockResponse,
      finishReason: 'stop',
      usage: {
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
      },
    };
  }
}

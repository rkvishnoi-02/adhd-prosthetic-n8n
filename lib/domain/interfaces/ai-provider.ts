/**
 * Port: AI Provider Interface (Clean Architecture)
 * Domain layer - no implementation details
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'error';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIProvider {
  /**
   * Generate AI completion from messages
   */
  generateCompletion(messages: AIMessage[], maxTokens?: number): Promise<AIResponse>;
}

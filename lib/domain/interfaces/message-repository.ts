/**
 * Port: Message Repository Interface (Clean Architecture)
 * Domain layer - abstracts data access
 */

import { Message } from '@/types';

export interface IMessageRepository {
  /**
   * Save a message
   */
  save(message: Omit<Message, 'id' | 'created_at'>): Promise<Message>;

  /**
   * Get recent messages for user
   */
  getRecent(userId: string, limit?: number): Promise<Message[]>;

  /**
   * Get messages by mode
   */
  getByMode(userId: string, mode: string): Promise<Message[]>;
}

/**
 * Adapter: Supabase Message Repository (Clean Architecture)
 * Infrastructure layer - database implementation
 */

import { supabase } from '@/lib/supabase/client';
import { IMessageRepository } from '@/lib/domain/interfaces/message-repository';
import { Message } from '@/types';

export class SupabaseMessageRepository implements IMessageRepository {
  async save(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: message.user_id,
        role: message.role,
        content: message.content,
        mode: message.mode,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }

    return data;
  }

  async getRecent(userId: string, limit: number = 20): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  }

  async getByMode(userId: string, mode: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .eq('mode', mode)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch messages by mode: ${error.message}`);
    }

    return data || [];
  }
}

/**
 * Session Context Tracking (as @backend-api)
 * Manages user sessions and cognitive state
 *
 * Applies Supabase best practices:
 * - Efficient upserts (data-upsert)
 * - Proper indexing on user_id
 */

import { supabase } from '@/lib/supabase/client';

export type CognitiveState =
  | 'focused'
  | 'overwhelmed'
  | 'stuck'
  | 'neutral'
  | null;

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  cognitive_state: CognitiveState;
}

/**
 * Get user's current active session
 * Uses index on user_id and started_at (Supabase: query-missing-indexes)
 */
export async function getCurrentSession(userId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .is('ended_at', null) // Active session
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // No active session found is not an error
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data;
}

/**
 * Start a new session for user
 */
export async function startSession(
  userId: string,
  cognitiveState: CognitiveState = 'neutral'
): Promise<Session> {
  // End any existing active sessions first
  await endCurrentSession(userId);

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      started_at: new Date().toISOString(),
      cognitive_state: cognitiveState,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to start session: ${error.message}`);
  }

  return data;
}

/**
 * End user's current active session
 */
export async function endCurrentSession(userId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('ended_at', null);

  if (error) {
    throw new Error(`Failed to end session: ${error.message}`);
  }
}

/**
 * Update cognitive state of current session
 * Uses efficient upsert pattern (Supabase: data-upsert)
 */
export async function updateCognitiveState(
  userId: string,
  cognitiveState: CognitiveState
): Promise<void> {
  // Get current session
  const session = await getCurrentSession(userId);

  if (!session) {
    // No active session, start one
    await startSession(userId, cognitiveState);
    return;
  }

  // Update existing session
  const { error } = await supabase
    .from('sessions')
    .update({ cognitive_state: cognitiveState })
    .eq('id', session.id);

  if (error) {
    throw new Error(`Failed to update cognitive state: ${error.message}`);
  }
}

/**
 * Detect cognitive state from message content
 * Uses pattern matching to infer user's mental state
 */
export function detectCognitiveState(message: string): CognitiveState {
  const lowerMessage = message.toLowerCase();

  // Overwhelm patterns
  const overwhelmPatterns = [
    'overwhelmed',
    'too much',
    'can\'t handle',
    'drowning',
    'paralyzed',
    'shut down',
  ];

  if (overwhelmPatterns.some((pattern) => lowerMessage.includes(pattern))) {
    return 'overwhelmed';
  }

  // Stuck patterns
  const stuckPatterns = [
    'stuck',
    'don\'t know where to start',
    'blocked',
    'can\'t decide',
    'frozen',
  ];

  if (stuckPatterns.some((pattern) => lowerMessage.includes(pattern))) {
    return 'stuck';
  }

  // Focused patterns
  const focusedPatterns = [
    'working on',
    'getting things done',
    'productive',
    'in the zone',
  ];

  if (focusedPatterns.some((pattern) => lowerMessage.includes(pattern))) {
    return 'focused';
  }

  return 'neutral';
}

/**
 * Get user's recent sessions
 * Useful for analyzing patterns over time
 */
export async function getRecentSessions(
  userId: string,
  limit: number = 10
): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent sessions: ${error.message}`);
  }

  return data || [];
}

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserMemory {
  user_id: string;
  name: string | null;
  role: string | null;
  current_project: string | null;
  why_it_matters: string | null;
  updated_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  cognitive_state: string | null;
}

// AI Mode types
export type ModeType = '@dump' | '@do' | '@clarity' | '@ground';

export interface Mode {
  trigger: ModeType;
  purpose: string;
  rules: string[];
  maxLines: number;
  responseFormat: 'conversation' | 'steps' | 'questions' | 'single_action';
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: ModeType;
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
  mode: ModeType | null;
  suggestedMode?: ModeType;
}

// Identity types
export interface UserIdentity {
  name: string;
  role: string;
  currentProject: string;
  whyItMatters: string;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'too_long' | 'fluff' | 'robotic' | 'guilt';
  fix: string;
}

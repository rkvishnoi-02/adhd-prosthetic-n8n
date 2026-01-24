import { Mode, ModeType } from '@/types';

// MVP: 4 Core Modes
export const MODES: Record<ModeType, Mode> = {
  '@dump': {
    trigger: '@dump',
    purpose: 'Mental offload - unload mental clutter',
    rules: [
      'Listen only',
      'No advice',
      'No solving',
      'End with: "Anything else?"',
    ],
    maxLines: 3,
    responseFormat: 'conversation',
  },
  '@do': {
    trigger: '@do',
    purpose: 'Break into micro-steps for execution',
    rules: [
      'Convert task → 3-5 physical micro-actions',
      'Each step ≤ 1 sentence',
      'No abstract language',
      'End with: "Start with step 1."',
    ],
    maxLines: 7,
    responseFormat: 'steps',
  },
  '@clarity': {
    trigger: '@clarity',
    purpose: 'Ask clarifying questions',
    rules: [
      'Ask only 1-2 short questions',
      'Help user think, not replace thinking',
    ],
    maxLines: 3,
    responseFormat: 'questions',
  },
  '@ground': {
    trigger: '@ground',
    purpose: 'Overwhelm rescue',
    rules: [
      'One tiny physical action',
      'Calm tone',
      'Wait for completion',
    ],
    maxLines: 2,
    responseFormat: 'single_action',
  },
};

/**
 * Detect which mode to use from user message
 * Priority: explicit trigger > pattern matching > null
 */
export function detectMode(message: string): Mode | null {
  const lowerMessage = message.toLowerCase().trim();

  // Check for explicit mode triggers
  for (const [trigger, mode] of Object.entries(MODES)) {
    if (lowerMessage.startsWith(trigger.toLowerCase())) {
      return mode;
    }
  }

  // Pattern matching for implicit mode detection
  const overwhelmPatterns = [
    'overwhelmed',
    'too much',
    "can't",
    'stuck',
    'paralyzed',
    'frozen',
  ];

  if (overwhelmPatterns.some((pattern) => lowerMessage.includes(pattern))) {
    return MODES['@ground'];
  }

  // No mode detected - conversational mode
  return null;
}

/**
 * Remove mode trigger from message content
 */
export function stripModeTrigger(message: string): string {
  const lowerMessage = message.toLowerCase().trim();

  for (const trigger of Object.keys(MODES)) {
    if (lowerMessage.startsWith(trigger.toLowerCase())) {
      return message.slice(trigger.length).trim();
    }
  }

  return message;
}

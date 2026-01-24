import { Mode } from '@/types';

/**
 * Build layered prompt from components
 *
 * Layers:
 * 1. Base personality (ADHD-safe tone)
 * 2. Mode instructions (if mode active)
 * 3. Identity memory (user context)
 * 4. Session context (recent messages)
 * 5. Emotional safety rules
 */
export async function buildPrompt(
  message: string,
  mode: Mode | null,
  userIdentity?: {
    name?: string;
    role?: string;
    currentProject?: string;
    whyItMatters?: string;
  }
): Promise<string> {
  const layers: string[] = [];

  // Layer 1: Base personality
  layers.push(`You are Anchor, an ADHD cognitive prosthetic.

Your purpose: Replace missing executive function with clarity and calm.

Core tone rules:
- Short (2-5 lines max)
- Conversational (like texting)
- Direct and warm
- Zero motivational fluff
- Never guilt-trip

BANNED phrases:
"You got this!", "Great job!", "You should...", "Try to...", "Just...", "I understand that..."`);

  // Layer 2: Mode instructions
  if (mode) {
    layers.push(`\n--- MODE: ${mode.trigger.toUpperCase()} ---
Purpose: ${mode.purpose}
Max response length: ${mode.maxLines} lines

Rules:
${mode.rules.map((rule) => `- ${rule}`).join('\n')}`);
  }

  // Layer 3: Identity memory
  if (userIdentity && (userIdentity.name || userIdentity.role)) {
    const identityParts: string[] = [];
    if (userIdentity.name) identityParts.push(`Name: ${userIdentity.name}`);
    if (userIdentity.role) identityParts.push(`Role: ${userIdentity.role}`);
    if (userIdentity.currentProject) identityParts.push(`Working on: ${userIdentity.currentProject}`);
    if (userIdentity.whyItMatters) identityParts.push(`Why it matters: ${userIdentity.whyItMatters}`);

    if (identityParts.length > 0) {
      layers.push(`\n--- USER CONTEXT ---\n${identityParts.join('\n')}`);
    }
  }

  // Layer 5: Emotional safety
  layers.push(`\n--- EMOTIONAL SAFETY ---
- Never guilt or shame
- Never use "should have" or "need to"
- Validate feelings first
- Focus on next tiny action, not the gap`);

  layers.push(`\n--- USER MESSAGE ---\n${message}`);

  return layers.join('\n');
}

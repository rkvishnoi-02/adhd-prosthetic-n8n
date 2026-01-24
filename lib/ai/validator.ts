import { ValidationResult, ValidationIssue } from '@/types';

const BANNED_PHRASES = [
  'you got this',
  'great job',
  'you should',
  'try to',
  'just ',
  'i understand that',
  'you need to',
  'you have to',
  'should have',
  'could have',
  'would have',
];

/**
 * Validate AI response for ADHD-safe tone
 */
export function validateTone(response: string, maxLines: number = 5): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Check line count
  const lines = response.trim().split('\n').filter((line) => line.trim() !== '');
  if (lines.length > maxLines) {
    issues.push({
      type: 'too_long',
      fix: `Response has ${lines.length} lines, max is ${maxLines}. Make it shorter.`,
    });
  }

  // Check for banned phrases
  const lowerResponse = response.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowerResponse.includes(phrase)) {
      issues.push({
        type: phrase.includes('should') || phrase.includes('have to') ? 'guilt' : 'fluff',
        fix: `Remove phrase: "${phrase}"`,
      });
    }
  }

  // Check for robotic language
  const roboticPatterns = [
    'i understand that',
    'it seems like',
    'i can see that',
    'that must be',
  ];

  for (const pattern of roboticPatterns) {
    if (lowerResponse.includes(pattern)) {
      issues.push({
        type: 'robotic',
        fix: `Remove robotic phrase: "${pattern}"`,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Attempt to automatically fix tone issues
 */
export function fixTone(response: string, issues: ValidationIssue[]): string {
  let fixed = response;

  for (const issue of issues) {
    if (issue.type === 'too_long') {
      // Truncate to first few lines (basic fix)
      const lines = fixed.split('\n').filter((line) => line.trim() !== '');
      fixed = lines.slice(0, 5).join('\n');
    }

    // Remove banned phrases
    for (const phrase of BANNED_PHRASES) {
      const regex = new RegExp(phrase, 'gi');
      fixed = fixed.replace(regex, '');
    }
  }

  return fixed.trim();
}

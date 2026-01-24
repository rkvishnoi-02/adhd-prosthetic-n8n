---
description: Adds new cognitive modes to the Anchor system
---

# Add Mode Skill

Use this skill when adding a new cognitive mode to Anchor.

## Mode Structure

Every mode needs:
```typescript
{
  trigger: '@modename',      // How user activates it
  purpose: 'One sentence',   // What it does
  rules: ['Rule 1', ...],    // AI behavior rules
  maxLines: number,          // Response length limit
  responseFormat: 'type'     // conversation | steps | questions | single_action
}
```

## Steps to Add a Mode

### 1. Edit lib/ai/modes.ts
Add your mode to the `MODES` object:

```typescript
export const MODES = {
  // ... existing modes
  
  newmode: {
    trigger: '@newmode',
    purpose: 'Description of what this mode does',
    rules: [
      'Rule 1 - be specific',
      'Rule 2 - no abstract concepts',
      'Rule 3 - always end with X'
    ],
    maxLines: 5,
    responseFormat: 'conversation'
  }
}
```

### 2. Add Pattern Detection (Optional)
If the mode should auto-trigger from certain phrases:

```typescript
// In detectMode function
const patterns = {
  newmode: /keyword1|keyword2|phrase/i
}
```

### 3. Test the Mode
1. Start dev server: `npm run dev`
2. Open chat
3. Type `@newmode test message`
4. Verify response follows rules

## V2+ Modes to Add Later

| Mode | Trigger | Purpose |
|------|---------|---------|
| Talk | @talk | Emotional support |
| Think | @think | Explore ideas |
| Regulate | @regulate | DBT emotional regulation |
| Plan | @plan | Light daily planning |

## Mode Design Principles
- Each mode = ONE cognitive function
- Rules must be concrete (no "be helpful")
- maxLines enforces brevity
- responseFormat guides validator

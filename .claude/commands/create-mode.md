---
name: create-mode
description: Create a new AI mode with rules and examples
---

# Create New Mode

Add a new mode to Anchor's AI system.

## Steps
1. Ask user for:
   - Mode name (e.g., "@reflect")
   - Purpose (what it does)
   - Max lines (response length)
   - Rules (3-5 behavior rules)

2. Add to `lib/ai/modes.ts`:
```typescript
newMode: {
  trigger: '@mode',
  purpose: '...',
  rules: ['...'],
  maxLines: 3
}
```

3. Create test in chat:
   - User message with trigger
   - Expected response format

4. Update `CLAUDE.md` with new mode

Report when complete.
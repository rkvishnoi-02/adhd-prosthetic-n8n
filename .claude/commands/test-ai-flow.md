---
name: test-ai-flow
description: Test complete AI chat flow end-to-end
---

# Test AI Flow

Test the complete AI pipeline.

## Test Cases
1. **@dump mode**: 
   - Input: "I have too much to do"
   - Expected: Acknowledgment only, 2-3 lines

2. **@do mode**:
   - Input: "Write an email to my boss"
   - Expected: 3-5 micro-steps, numbered

3. **@ground mode**:
   - Input: "Everything is overwhelming"
   - Expected: Single physical action, 2 lines max

## Run Tests
```bash
npm test lib/ai/modes.test.ts
npm test lib/ai/orchestrator.test.ts
npm test lib/ai/validator.test.ts
```

Report pass/fail for each.
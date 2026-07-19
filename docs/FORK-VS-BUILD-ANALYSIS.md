# Fork MoltBot vs. Build Anchor from Scratch

## TL;DR Recommendation

**Build Anchor from scratch, but adopt MoltBot's memory patterns.**

Forking MoltBot would give us too much complexity we don't need. Anchor has a fundamentally different UX philosophy (ADHD-first simplicity) that conflicts with MoltBot's power-user design.

---

## Option 1: Fork MoltBot

### ✅ Pros

1. **MIT Licensed** - We can fork, modify, and commercialize freely
2. **Proven Memory System** - The infinite memory works and is battle-tested
3. **Multi-Channel Support** - WhatsApp, Telegram, Slack, Discord, etc. already integrated
4. **Gateway Architecture** - Solid foundation for multi-agent routing
5. **Skills System** - Extensible plugin architecture
6. **Active Development** - 322 contributors, 33 releases, actively maintained

### ❌ Cons

1. **Massive Complexity** - MoltBot is a **general-purpose AI assistant**, not ADHD-specific
   - Voice wake, canvas UI, browser control, cron jobs, Docker sandboxing
   - We'd spend months **removing** features instead of building what we need

2. **Wrong Tech Stack for Our MVP**
   - MoltBot: Node.js + TypeScript + Gateway daemon + WebSocket control plane
   - Anchor MVP: Next.js 14 + Supabase + simple chat UI
   - **Mismatch**: MoltBot is designed to run locally as a daemon; Anchor is a web app

3. **Different UX Philosophy**
   - MoltBot: Power users who want to control everything (edit Markdown files, run CLI commands)
   - Anchor: ADHD users who need **zero friction** (no CLI, no file editing, just chat)

4. **Multi-Channel Overhead**
   - MoltBot supports 12+ messaging platforms
   - Anchor MVP: Just web chat (maybe push notifications later)
   - **We don't need 95% of this**

5. **Learning Curve**
   - Would take 2-4 weeks just to understand MoltBot's codebase
   - Gateway protocol, WebSocket architecture, skill registry, Docker sandboxing
   - **Time better spent building Anchor features**

6. **Maintenance Burden**
   - Would need to track MoltBot updates and merge upstream changes
   - Or fork permanently and lose community improvements
   - **Either way, it's a tax on our velocity**

---

## Option 2: Build Anchor from Scratch (Recommended)

### ✅ Pros

1. **ADHD-First from Day 1**
   - Every design decision optimized for ADHD users
   - No legacy complexity to work around

2. **Lean MVP Stack**
   - Next.js 14 (already set up)
   - Supabase (already configured)
   - Simple chat UI (already built)
   - **We're 60% done already**

3. **Adopt MoltBot Patterns, Not Code**
   - Markdown-based memory ✅
   - Two-layer memory (daily + long-term) ✅
   - Auto-capture/auto-recall ✅
   - Hybrid search (V2) ✅
   - **We get the good ideas without the baggage**

4. **Faster to MVP**
   - Forking MoltBot: 4-6 weeks to strip down + adapt
   - Building Anchor: 2-3 weeks to add memory patterns
   - **2x faster to launch**

5. **Easier to Pivot**
   - If we need to change direction, we own 100% of the code
   - No upstream dependencies or architectural constraints

6. **Better for Fundraising**
   - "We built an ADHD-specific AI assistant" (clear story)
   - vs. "We forked an open-source project and modified it" (less compelling)

### ❌ Cons

1. **Reinventing Some Wheels**
   - Have to build memory system from scratch
   - Have to implement hybrid search ourselves (V2)
   - **But**: We only build what we need, when we need it

2. **No Multi-Channel Support (Yet)**
   - MoltBot has WhatsApp, Telegram, etc. out of the box
   - Anchor starts with web chat only
   - **But**: We can add channels later as Lego blocks (per our architecture)

---

## Side-by-Side Comparison

| Aspect | Fork MoltBot | Build Anchor |
|--------|--------------|--------------|
| **Time to MVP** | 4-6 weeks | 2-3 weeks |
| **Code Complexity** | Very high (Gateway, multi-channel, Docker) | Low (Next.js + Supabase) |
| **ADHD Optimization** | Have to retrofit | Built-in from start |
| **Memory System** | Already built | Need to build (2-3 days) |
| **Multi-Channel** | 12+ platforms | Web only (add later) |
| **Learning Curve** | Steep (2-4 weeks) | Shallow (we know Next.js) |
| **Maintenance** | Track upstream or fork permanently | Full control |
| **Fundraising Story** | "We forked X" | "We built Y" |
| **License** | MIT (can commercialize) | Ours (can do anything) |

---

## What We Should Steal from MoltBot

### 1. Memory Architecture (Adopt Immediately)

```typescript
// Anchor's memory structure (inspired by MoltBot)
~/anchor/users/{userId}/
├── USER.md          # Identity + preferences
├── MEMORY.md        # Long-term facts
├── daily/
│   ├── 2026-01-28.md
│   └── 2026-01-29.md
└── modes/
    ├── dump.md      # Mode-specific context
    ├── do.md
    ├── clarity.md
    └── ground.md
```

### 2. Auto-Capture Pattern

```typescript
// After each chat session
async function captureSession(userId: string, messages: Message[]) {
  const summary = await summarizeConversation(messages);
  const keyPoints = extractKeyPoints(messages);
  
  // Save to daily note
  await saveDailyNote(userId, {
    date: new Date(),
    summary,
    keyPoints,
    modesUsed: getModesUsed(messages)
  });
  
  // Promote important facts to long-term memory
  const importantFacts = await identifyImportantFacts(keyPoints);
  await appendToMemory(userId, importantFacts);
}
```

### 3. Hybrid Search (V2)

```typescript
// Combine vector + keyword search
async function recallMemories(userId: string, query: string) {
  const vectorResults = await vectorSearch(userId, query, { limit: 5 });
  const keywordResults = await keywordSearch(userId, query, { limit: 5 });
  
  return mergeAndRank([...vectorResults, ...keywordResults]);
}
```

---

## Implementation Timeline

### If We Fork MoltBot (6 weeks)

| Week | Task |
|------|------|
| 1-2 | Study MoltBot codebase, understand Gateway architecture |
| 3 | Strip out multi-channel support (keep web only) |
| 4 | Remove voice, canvas, browser control, cron, Docker |
| 5 | Adapt memory system for ADHD use case |
| 6 | Integrate with our existing Next.js UI |

**Total**: 6 weeks, high risk of scope creep

### If We Build Anchor (3 weeks)

| Week | Task |
|------|------|
| 1 | Implement Markdown-based memory (USER.md, MEMORY.md) |
| 2 | Add daily notes auto-capture + memory recall |
| 3 | Polish UI, add "View My Memory" page, test with users |

**Total**: 3 weeks, low risk

---

## Recommended Approach

### Phase 1: Build Anchor MVP (Now - 3 weeks)

1. **Week 1**: Markdown memory system
   - Replace `UserMemory` table with Markdown storage
   - Implement `USER.md` and `MEMORY.md`
   - Add "View My Memory" UI page

2. **Week 2**: Daily notes auto-capture
   - Summarize chat sessions after each conversation
   - Store in `daily/YYYY-MM-DD.md`
   - Show timeline view in UI

3. **Week 3**: Memory recall
   - Before each AI response, inject relevant memories
   - Use simple keyword search (good enough for MVP)
   - Test with real ADHD users

### Phase 2: Adopt MoltBot Patterns (V2 - 4-6 weeks later)

1. **Hybrid Search**: Add vector search (pgvector) + keyword search
2. **Memory Promotion**: AI decides what to remember long-term
3. **Multi-Agent Routing**: Different modes = different agents
4. **Skills System**: Extensible plugin architecture (if needed)

### Phase 3: Multi-Channel (V3 - If Needed)

1. **Study MoltBot's channel adapters** (WhatsApp, Telegram, etc.)
2. **Extract and adapt** the channel code we need
3. **Integrate** as Lego blocks into Anchor

---

## Decision Matrix

| Criteria | Weight | Fork MoltBot | Build Anchor |
|----------|--------|--------------|--------------|
| Time to MVP | 30% | 3/10 | 9/10 |
| ADHD Optimization | 25% | 4/10 | 10/10 |
| Code Simplicity | 20% | 2/10 | 9/10 |
| Memory System Quality | 15% | 10/10 | 7/10 (initially) |
| Future Flexibility | 10% | 6/10 | 9/10 |
| **Weighted Score** | | **4.8/10** | **8.9/10** |

---

## Final Recommendation

**Build Anchor from scratch, adopt MoltBot's memory patterns.**

### Why?

1. **Faster to MVP** (3 weeks vs. 6 weeks)
2. **ADHD-first from day 1** (no retrofitting)
3. **Simpler codebase** (easier to maintain)
4. **Better fundraising story** ("We built X" vs. "We forked Y")
5. **We can still steal ideas** (memory system, hybrid search, multi-channel later)

### What We Steal from MoltBot

- ✅ Markdown-based memory architecture
- ✅ Two-layer memory (daily + long-term)
- ✅ Auto-capture/auto-recall pattern
- ✅ Hybrid search (V2)
- ✅ Skills/plugin system (V3, if needed)

### What We Don't Need (Yet)

- ❌ Multi-channel support (12+ platforms)
- ❌ Gateway daemon architecture
- ❌ Voice wake + talk mode
- ❌ Canvas UI + A2UI
- ❌ Browser control
- ❌ Docker sandboxing
- ❌ Cron jobs

**We can add these later as Lego blocks if users demand them.**

---

## Next Steps

1. ✅ **Approve this approach** (or discuss concerns)
2. 🔨 **Start Week 1**: Implement Markdown memory system
3. 📝 **Update `task.md`**: Add memory system tasks
4. 🧪 **Test with real users**: Show them `USER.md`, get feedback
5. 🚀 **Ship MVP**: 3 weeks from now

**Question for you**: Do you agree with this approach, or do you still want to explore forking MoltBot?

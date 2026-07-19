# MoltBot Memory System Research

## Executive Summary

MoltBot (formerly ClawdBot) implements an "infinite memory" system using **local Markdown files** that could be highly beneficial for Anchor's ADHD-focused design. The system is transparent, user-editable, and maintains context across all interactions.

---

## Core Architecture

### 1. Memory Storage (Markdown-Based)

MoltBot stores all memory as **plain text Markdown files** in `~/clawd/` workspace:

```
~/clawd/
├── SOUL.md          # AI personality & behavioral rules
├── AGENTS.md        # Available agents list
├── USER.md          # User profile & preferences (grows over time)
├── MEMORY.md        # Long-term facts & context
├── TOOLS.md         # Available tools documentation
├── memory/          # Persistent long-term memories
│   └── [daily notes, context, etc.]
└── skills/
    └── <skill>/SKILL.md
```

**Why This Matters for ADHD:**
- **Transparent**: Users can read/edit their AI's memory directly
- **Version-controllable**: Can use Git to track changes
- **No vendor lock-in**: Plain text, not proprietary DB
- **Searchable**: Easy to grep/search through memories

### 2. Two-Layer Memory System

| Layer | Purpose | Storage | Retention |
|-------|---------|---------|-----------|
| **Daily Notes** | Session interactions, ephemeral context | Daily Markdown files | Short-term (days) |
| **Long-Term Memory** | Facts, preferences, routines, patterns | `memory/` directory + `MEMORY.md` | Permanent |

**ADHD Benefit**: Separates "brain dump" (daily) from "important stuff to remember" (long-term).

### 3. Auto-Capture & Auto-Recall

**Auto-Capture** (After each conversation):
1. Summarizes conversation
2. Extracts key information
3. Stores in daily note
4. Promotes important facts to long-term memory

**Auto-Recall** (Before each AI turn):
1. Queries relevant memories via hybrid search
2. Injects user profile (`USER.md`)
3. Adds context to AI prompt

**ADHD Benefit**: User doesn't have to manually "save" important info—the AI does it automatically.

### 4. Hybrid Search

Combines:
- **Vector search**: Semantic similarity (finds related concepts)
- **Keyword search**: Exact matches (finds specific facts)

**Why Both**: Vector catches "I mentioned something about doctors" while keyword catches "Dr. Smith appointment 3pm"

---

## Key Files Explained

### `SOUL.md` - AI Personality
Defines how the AI talks, behaves, and responds. For Anchor, this would be:
- Warm, non-judgmental tone
- ADHD-safe language (no "just do it")
- Brevity rules (2-5 lines max)

### `USER.md` - User Profile
Grows over time with:
- Name, role, current project
- Preferences ("hates phone calls")
- Patterns ("gets overwhelmed Mondays")
- Context ("working on thesis")

### `MEMORY.md` - Long-Term Facts
Stores:
- Important deadlines
- Recurring tasks
- Relationships ("Mom's birthday is...")
- Preferences ("Prefers text over calls")

---

## What We Can Adopt for Anchor

### ✅ Immediate Wins (MVP-Compatible)

1. **Markdown-Based Identity Memory**
   - Replace current `UserMemory` table with Markdown file
   - Store in user's workspace (e.g., `~/anchor/USER.md`)
   - Benefits: User can edit, version control, export

2. **Daily Notes Auto-Capture**
   - After each chat session, summarize key points
   - Store in `~/anchor/daily/YYYY-MM-DD.md`
   - Benefits: Automatic journaling for ADHD users

3. **Transparent Memory UI**
   - Show users what Anchor remembers about them
   - Let them edit/delete memories
   - Benefits: Trust, control, reduces anxiety

### 🔮 Future Enhancements (V2+)

4. **Hybrid Search (Vector + Keyword)**
   - Use pgvector for semantic search
   - Use PostgreSQL full-text search for keywords
   - Benefits: Better recall of past conversations

5. **Long-Term Memory Promotion**
   - AI decides what to "remember forever" vs. "forget"
   - User can override (mark as important/unimportant)
   - Benefits: Reduces cognitive load

6. **Multi-Agent Routing**
   - Different "modes" could be different agents
   - Each agent has its own memory/context
   - Benefits: Cleaner separation of concerns

---

## Implementation Plan for Anchor

### Phase 1: Markdown Identity (This Week)

```typescript
// lib/memory/markdown.ts
export async function saveUserIdentity(userId: string, data: UserIdentity) {
  const markdown = `# User Profile

## Basic Info
- **Name**: ${data.name}
- **Role**: ${data.role}
- **Current Project**: ${data.currentProject}

## Why It Matters
${data.whyItMatters}

## Preferences
- Preferred communication: Chat
- Overwhelm triggers: [To be learned]

---
*Last updated: ${new Date().toISOString()}*
`;

  await fs.writeFile(`~/anchor/users/${userId}/USER.md`, markdown);
}
```

### Phase 2: Daily Notes (Next Sprint)

```typescript
// lib/memory/daily-notes.ts
export async function captureDailyNote(userId: string, messages: Message[]) {
  const summary = await summarizeConversation(messages);
  const date = new Date().toISOString().split('T')[0];
  
  const markdown = `# ${date}

## Summary
${summary}

## Key Points
${extractKeyPoints(messages)}

## Modes Used
${getModesUsed(messages)}
`;

  await fs.writeFile(`~/anchor/users/${userId}/daily/${date}.md`, markdown);
}
```

### Phase 3: Memory Recall (V2)

```typescript
// lib/memory/recall.ts
export async function recallRelevantMemories(userId: string, query: string) {
  // 1. Search daily notes (last 7 days)
  const recentNotes = await searchDailyNotes(userId, query, 7);
  
  // 2. Search long-term memory (vector + keyword)
  const longTermMemories = await hybridSearch(userId, query);
  
  // 3. Load user profile
  const userProfile = await loadUserProfile(userId);
  
  return {
    profile: userProfile,
    recent: recentNotes,
    longTerm: longTermMemories
  };
}
```

---

## ADHD-Specific Benefits

| MoltBot Feature | ADHD Benefit |
|-----------------|--------------|
| **Auto-capture** | Don't have to remember to save important info |
| **Daily notes** | Automatic journaling (helps with time blindness) |
| **Transparent memory** | Reduces anxiety ("What does it know about me?") |
| **Editable files** | Control over personal data |
| **Hybrid search** | Finds info even with vague recall ("something about doctor") |
| **Long-term promotion** | AI decides what's important (reduces decision fatigue) |

---

## Security Considerations

⚠️ **MoltBot's Weakness**: Local plaintext files are vulnerable to malware.

**Anchor's Solution**:
- Store encrypted Markdown in Supabase
- Decrypt only when needed
- Offer local export for transparency
- Use RLS (Row Level Security) for access control

---

## Recommended Next Steps

1. **Prototype Markdown Identity** (2 hours)
   - Replace current `UserMemory` JSON with Markdown
   - Store in Supabase as TEXT column
   - Add "View My Memory" page in UI

2. **Test with Real ADHD Users** (1 week)
   - Show them their `USER.md` file
   - Ask: "Does this feel right? What's missing?"
   - Iterate on format

3. **Add Daily Notes** (1 sprint)
   - Auto-summarize chat sessions
   - Store as Markdown in `daily/` table
   - Show timeline view in UI

4. **Plan V2 Memory System** (After MVP)
   - Hybrid search (pgvector + full-text)
   - Memory promotion logic
   - Multi-agent routing

---

## Resources

- **MoltBot GitHub**: https://github.com/moltbot/moltbot
- **MoltBot Docs**: https://docs.molt.bot
- **Memory System Deep Dive**: https://zenvanriel.nl (creator's blog)

---

## Conclusion

MoltBot's Markdown-based memory system is **perfect for ADHD users** because it's:
- Transparent (reduces anxiety)
- Automatic (reduces cognitive load)
- Editable (gives control)
- Persistent (combats working memory issues)

We should adopt the **two-layer memory** (daily + long-term) and **auto-capture** patterns immediately. The hybrid search and multi-agent routing can wait for V2.

**Action Item**: Implement Markdown-based `USER.md` this week as a proof-of-concept.

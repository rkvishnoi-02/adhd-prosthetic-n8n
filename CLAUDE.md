# Anchor - ADHD Executive Function AI

## What This Is
Cognitive prosthetic that replaces missing executive function for ADHD minds.
**NOT a productivity app. A brain extension.**

## Tech Stack
- Frontend: Next.js 14+ (App Router), TailwindCSS, shadcn/ui
- Backend: Next.js API Routes
- Database: Supabase (Postgres + Auth)
- AI: OpenAI GPT-4o-mini

## Core Principle
> Every decision asks: "Does this help someone whose executive function is offline?"

---

## ⚠️ MANDATORY: Sub-Agents (ALWAYS Use These)

**CRITICAL**: You MUST use agents for all work. Do NOT write code directly.

### When Building Features:

| Task Type | Use This Agent | Files Modified |
|-----------|----------------|----------------|
| **React Components** | `@frontend-builder` | `components/`, `app/(app)/` |
| **API Routes** | `@backend-api` | `app/api/`, `lib/supabase/` |
| **AI/Modes Logic** | `@ai-orchestrator` | `lib/ai/*` |
| **Database Schema** | `@database-architect` | Migrations, schema |

### How to Use Agents:
```
# DON'T do this:
"I'll create the login component..."

# DO this instead:
"@frontend-builder create login component with email/password fields"
```

---

## ⚠️ MANDATORY: Skills (ALWAYS Apply These)

**CRITICAL**: Run skills BEFORE writing any code.

| Skill | When to Use | Command |
|-------|-------------|---------|
| **vercel-react-best-practices** | Before ANY React/Next.js code | `/vercel-react-best-practices` |
| **supabase-postgres-best-practices** | Before database queries | `/supabase-postgres-best-practices` |
| **architecture-patterns** | Before system design | `/architecture-patterns` |
| **adhd-response-validator** | After AI responses | `/adhd-response-validator` |
| **systematic-debugging** | When bugs occur | Auto-triggers |

### Workflow:
1. Run relevant skill FIRST
2. THEN call appropriate agent
3. Agent applies skill rules automatically

---

## ⚠️ MANDATORY: Commands (Use When Relevant)

| Command | When to Use |
|---------|-------------|
| `/test-ai-flow` | After building ANY AI-related code |
| `/create-mode` | When adding new AI mode |
| `/db-migrate` | When changing database schema |

---

## 4 MVP Modes

| Mode | Trigger | Purpose | Max Lines |
|------|---------|---------|-----------|
| Dump | `@dump` | Unload mental clutter | 3 |
| Do | `@do` | Break into micro-steps | 7 |
| Clarity | `@clarity` | Ask clarifying questions | 3 |
| Ground | `@ground` | Overwhelm rescue | 2 |

---

## AI Response Rules

### Tone (CRITICAL)
- Short (2-5 lines max)
- Conversational (like texting)
- Direct and warm
- Zero motivational fluff
- Never guilt-trip

### Banned Phrases
```
"You got this!" "Great job!" "You should..."
"Try to..." "Just..." "I understand that..."
```

---

## File Organization
```
app/
├── (auth)/          # Login, signup
├── (app)/chat/      # Main chat interface
└── api/             # API routes

components/
├── chat/            # Chat UI
├── modes/           # Mode-specific components
└── ui/              # shadcn components

lib/
├── ai/              # AI logic (modes, orchestrator, validator)
├── memory/          # Identity & patterns
└── supabase/        # Database client

prisma/
└── schema.prisma    # Database schema
```

---

## Commands
```bash
npm run dev              # Start Next.js (port 3000)
npm run typecheck        # TypeScript check
npm run lint             # ESLint
npm test                 # Run tests
npx prisma studio        # Database GUI
npx prisma migrate dev   # Run migration
```

---

## Development Workflow (MANDATORY STEPS)

### Adding New Feature - REQUIRED SEQUENCE:

1. **Run Skill FIRST**
   - Frontend? Run `/vercel-react-best-practices`
   - Backend? Run `/supabase-postgres-best-practices`
   - Architecture? Run `/architecture-patterns`

2. **Call Agent** (NOT yourself!)
   - `@frontend-builder` for UI
   - `@backend-api` for API/DB
   - `@ai-orchestrator` for AI logic
   - `@database-architect` for schema

3. **Test**
   - AI code? Run `/test-ai-flow`
   - Other code? Run `npm run typecheck`

4. **Commit**
   - Pre-commit hooks validate

### Example (CORRECT WAY):
```
User: "Add @reflect mode for journaling"

Claude: "I'll run the architecture skill first"
> Runs /architecture-patterns
> Calls @ai-orchestrator add @reflect mode
> @ai-orchestrator implements in lib/ai/modes.ts
> Runs /test-ai-flow to verify
> Tests pass ✅
> Ready to commit
```

### Example (WRONG WAY - DON'T DO THIS):
```
User: "Add login page"

Claude: "Let me create the login component..." ❌ WRONG
[Writes code directly without agent] ❌ WRONG
[Doesn't run vercel-react-best-practices skill] ❌ WRONG
```

---

## Critical Rules

1. **ADHD-First**: Forgiveness > perfection
2. **Token Efficiency**: Cache prompts, validate tone
3. **No Motivational Fluff**: Direct, warm, honest
4. **Auto-Save Everything**: Never lose user input
5. **Test Before Commit**: Always run checks

---

## When Stuck

1. Use `/test-ai-flow` to debug
2. Check `lib/ai/modes.ts` for mode definitions
3. Read `lib/ai/orchestrator.ts` for prompt logic
4. Ask sub-agent: "@ai-orchestrator explain mode routing"
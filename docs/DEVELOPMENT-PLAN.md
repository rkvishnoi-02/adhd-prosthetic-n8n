# Anchor Development Plan

## Current Status
- ✅ Phase 1: Foundation Complete
- ✅ Phase 2: Authentication Complete
- ✅ Phase 3: Core AI Engine Complete
- 🚧 Phase 4: Chat Interface (Next)

---

## ⚠️ CRITICAL: How to Use This Plan

### Each Phase Has 3 Parts:

1. **Skills to Run FIRST** - Best practices to apply
2. **Agents to Use** - Who does the work
3. **Commands to Verify** - Testing and validation

### Example Workflow:
```
User: "Let's work on Phase 4"

Step 1: Run Skills
> /vercel-react-best-practices
> /architecture-patterns

Step 2: Call Agents
> @frontend-builder build chat message list
> @backend-api optimize chat API

Step 3: Run Commands
> /test-ai-flow
> npm run typecheck
```

---

## Phase 1: Project Foundation ✅ COMPLETE

### Skills Used:
- `/architecture-patterns` - Clean Architecture setup
- `/supabase-postgres-best-practices` - Database design

### Agents Used:
- `@database-architect` - Created schema with RLS

### What Was Built:
- Next.js 14+ project
- 4 Supabase tables (users, user_memory, messages, sessions)
- TypeScript types
- Supabase client setup

---

## Phase 2: Authentication System ✅ COMPLETE

### Skills Used:
- `/vercel-react-best-practices` - React best practices
- Form state management with useTransition

### Agents Used:
- `@frontend-builder` - Created login/signup pages
- Auth middleware for route protection

### What Was Built:
- Login page (`/login`)
- Signup page (`/signup`)
- Protected chat route
- Supabase Auth integration

---

## Phase 3: Core AI Engine ✅ COMPLETE

### Skills Used:
- `/architecture-patterns` - Clean Architecture (Ports & Adapters)
- Domain interfaces, Use Cases, Adapters

### Agents Used:
- `@ai-orchestrator` - Mode detection, prompt building, validation
- `@backend-api` - Chat API route

### What Was Built:
- Domain interfaces (IAIProvider, IMessageRepository)
- Use case (ProcessChatMessageUseCase)
- Adapters (OpenAIProvider, SupabaseMessageRepository)
- `/api/chat` endpoint

---

## Phase 4: Chat Interface & API 🚧 CURRENT

### Skills to Run FIRST:
```
/vercel-react-best-practices
/web-design-guidelines (for ADHD-friendly UI)
```

### Agents to Use:

#### 4.1 Chat UI Components
**Agent**: `@frontend-builder`

Tasks:
1. Build chat message bubble component
   - User messages (right-aligned, blue)
   - Assistant messages (left-aligned, gray)
   - Mode badge indicator

2. Build message list with auto-scroll
   - Load recent messages on mount
   - Auto-scroll to bottom on new message
   - Virtual scrolling for performance

3. Build message input
   - Text area with auto-resize
   - Mode trigger detection (@dump, @do, etc.)
   - Send on Enter (Shift+Enter for newline)
   - Loading state while waiting for AI

4. Build mode indicator badge
   - Show active mode
   - Color-coded by mode type

**Apply These Patterns**:
- `rerender-transitions` - useTransition for message sending
- `rendering-hoist-jsx` - Hoist static elements
- `bundle-barrel-imports` - Direct imports only

#### 4.2 Real-Time Updates (Optional)
**Agent**: `@backend-api`

Tasks:
1. Add streaming support to `/api/chat`
2. Use Server-Sent Events for live responses

### Commands to Run:
```
npm run typecheck
npm run dev
/test-ai-flow (test all 4 modes)
```

### Files to Create:
```
components/chat/
├── message-bubble.tsx
├── message-list.tsx
├── message-input.tsx
└── mode-badge.tsx

app/(app)/chat/
└── page.tsx (update with components)
```

---

## Phase 5: Memory System

### Skills to Run FIRST:
```
/supabase-postgres-best-practices
/architecture-patterns
```

### Agents to Use:

#### 5.1 Identity Memory API
**Agent**: `@backend-api`

Tasks:
1. Create `/api/memory/identity` endpoint
   - GET: Fetch user identity
   - POST: Update user identity
2. Use Repository pattern (Clean Architecture)

#### 5.2 Session Context
**Agent**: `@ai-orchestrator`

Tasks:
1. Update prompt orchestrator to include recent messages
2. Add session state tracking (focused, overwhelmed, etc.)

**Apply These Patterns**:
- `server-cache-react` - Cache user identity per request
- `data-n-plus-one` - Avoid N+1 queries

### Commands to Run:
```
npm run typecheck
/test-ai-flow
```

---

## Phase 6: Onboarding Flow

### Skills to Run FIRST:
```
/web-design-guidelines (ADHD-friendly onboarding)
/vercel-react-best-practices
```

### Agents to Use:

#### 6.1 Onboarding UI
**Agent**: `@frontend-builder`

Tasks:
1. Welcome screen
2. Identity capture form (name, role, project, why)
3. First @dump interaction tutorial

**Apply These Patterns**:
- ADHD design: Large text, single column, generous spacing
- One question per screen (no overwhelm)

#### 6.2 Onboarding Logic
**Agent**: `@backend-api`

Tasks:
1. Create `/api/onboarding` endpoint
2. Save identity to user_memory
3. Create first session

### Commands to Run:
```
/adhd-response-validator (validate onboarding copy)
npm run typecheck
```

---

## Phase 7: Polish & Deploy

### Skills to Run FIRST:
```
/web-design-guidelines (accessibility audit)
/vercel-react-best-practices (performance check)
```

### Tasks:

#### 7.1 Polish
- Loading states everywhere
- Error boundaries
- Mobile responsive (test on phone)
- Dark mode support (optional)
- Keyboard shortcuts (ESC to cancel, etc.)

#### 7.2 Deploy to Vercel
```bash
# Set environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY

# Deploy
vercel deploy --prod
```

### Commands to Run:
```
npm run build (test production build)
npm run typecheck
/test-ai-flow (final verification)
```

---

## Agent Decision Tree

Use this to choose the right agent:

```
What are you building?
│
├─ React component/page?
│  └─ Use @frontend-builder
│
├─ API route/database query?
│  └─ Use @backend-api
│
├─ AI mode/prompt/validation?
│  └─ Use @ai-orchestrator
│
└─ Database schema change?
   └─ Use @database-architect
```

---

## Skills Decision Tree

Use this to choose the right skill:

```
What are you doing?
│
├─ Writing React/Next.js code?
│  └─ Run /vercel-react-best-practices FIRST
│
├─ Database query or migration?
│  └─ Run /supabase-postgres-best-practices FIRST
│
├─ Designing system architecture?
│  └─ Run /architecture-patterns FIRST
│
├─ Creating UI/UX?
│  └─ Run /web-design-guidelines FIRST
│
├─ Validating AI response tone?
│  └─ Run /adhd-response-validator
│
└─ Debugging a bug?
   └─ /systematic-debugging (auto-triggers)
```

---

## Commands Reference

| Command | When to Use |
|---------|-------------|
| `/test-ai-flow` | After ANY AI code changes |
| `/create-mode` | Adding new AI mode (e.g., @reflect) |
| `/db-migrate` | After database schema changes |
| `/adhd-response-validator` | Check AI responses for ADHD-safe tone |

---

## Success Checklist

### MVP Complete When:
- [ ] User can sign up/login ✅
- [ ] User can chat with 4 modes ✅
- [ ] AI responds with ADHD-safe tone ✅
- [ ] Chat UI shows messages in real-time
- [ ] Identity memory persists
- [ ] Session context works
- [ ] Onboarding captures user info
- [ ] Deployed to Vercel

---

## Remember: ALWAYS Use Agents & Skills

❌ **WRONG**:
```
"Let me create the chat component..."
[Writes code directly]
```

✅ **CORRECT**:
```
"Running /vercel-react-best-practices first"
"@frontend-builder create chat message component"
```

This ensures:
- High code quality
- Best practices applied
- Modular architecture
- Consistent patterns

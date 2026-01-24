# Anchor - Architecture & Developer Guide

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                   NEXT.JS APP                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │              PRESENTATION LAYER               │  │
│  │  /app/(app)/chat/page.tsx                    │  │
│  │  /components/chat/*                          │  │
│  └──────────────────────────────────────────────┘  │
│                        │                            │
│                        ▼                            │
│  ┌──────────────────────────────────────────────┐  │
│  │                 API LAYER                     │  │
│  │  /app/api/chat/route.ts                      │  │
│  └──────────────────────────────────────────────┘  │
│                        │                            │
│                        ▼                            │
│  ┌──────────────────────────────────────────────┐  │
│  │              BUSINESS LOGIC                   │  │
│  │                                              │  │
│  │  ┌────────────┐  ┌────────────┐              │  │
│  │  │   Mode     │  │  Prompt    │              │  │
│  │  │  Router    │→ │Orchestrator│              │  │
│  │  └────────────┘  └────────────┘              │  │
│  │         │              │                      │  │
│  │         ▼              ▼                      │  │
│  │  ┌────────────┐  ┌────────────┐              │  │
│  │  │   Tone     │  │  Memory    │              │  │
│  │  │ Validator  │  │  Service   │              │  │
│  │  └────────────┘  └────────────┘              │  │
│  └──────────────────────────────────────────────┘  │
│                        │                            │
│                        ▼                            │
│  ┌──────────────────────────────────────────────┐  │
│  │              EXTERNAL SERVICES                │  │
│  │  • OpenAI GPT-4o-mini                        │  │
│  │  • Supabase (Postgres + Auth)                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Mode Router (`lib/ai/modes.ts`)

**Purpose:** Detect which cognitive mode to use based on user input.

```typescript
// Detection priority:
// 1. Explicit trigger (@dump, @do, etc.)
// 2. Pattern matching (overwhelm → @ground)
// 3. Default → conversational

interface Mode {
  trigger: string
  purpose: string
  rules: string[]
  maxLines: number
  responseFormat: 'conversation' | 'steps' | 'questions' | 'single_action'
}

function detectMode(message: string): Mode | null
```

**Adding a new mode:**
1. Add to `MODES` object in `lib/ai/modes.ts`
2. Done. The orchestrator picks it up automatically.

---

### 2. Prompt Orchestrator (`lib/ai/orchestrator.ts`)

**Purpose:** Build the complete prompt from layers.

```typescript
// Prompt layers (in order):
// 1. Base personality (ADHD-safe tone)
// 2. Mode instructions (rules, format)
// 3. Identity memory (name, project)
// 4. Session context (recent messages)
// 5. Emotional safety (never guilt)

async function buildPrompt(
  message: string,
  mode: Mode,
  userId: string
): Promise<string>
```

**Prompt composition:**
```
[Base Personality]
---
[Mode: @do - Break into micro-steps]
Rules:
- 3-5 physical actions
- No abstract language
---
[User: Alex, working on thesis, matters because: career]
---
[Emotional safety: never guilt, validate first]
```

---

### 3. Tone Validator (`lib/ai/validator.ts`)

**Purpose:** Ensure AI responses are ADHD-safe.

```typescript
interface ValidationResult {
  valid: boolean
  issues: {
    type: 'too_long' | 'fluff' | 'robotic' | 'guilt'
    fix: string
  }[]
}

function validateTone(response: string): ValidationResult
async function fixTone(response: string, issues: Issue[]): Promise<string>
```

**Validation rules:**
- Max 5 lines
- No banned phrases ("You got this!", "Just...", etc.)
- No robotic language ("I understand that...")
- No guilt language ("should have", "need to")

---

### 4. Memory Service (`lib/memory/identity.ts`)

**Purpose:** Store and retrieve user identity context.

```typescript
interface UserIdentity {
  name: string
  role: string
  currentProject: string
  whyItMatters: string
}

async function getIdentity(userId: string): Promise<UserIdentity | null>
async function setIdentity(userId: string, identity: UserIdentity): Promise<void>
```

---

## API Routes

### POST `/api/chat`

**Request:**
```json
{
  "message": "@do write the email",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "reply": "1. Open Gmail\n2. Click Compose...",
  "mode": "@do",
  "suggestedMode": null
}
```

**Flow:**
1. Detect mode from message
2. Load user identity
3. Build layered prompt
4. Call GPT-4o-mini
5. Validate tone (fix if needed)
6. Save message to DB
7. Return response

---

## Database Schema

```sql
-- Users
users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP
)

-- Identity memory
user_memory (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  name TEXT,
  role TEXT,
  current_project TEXT,
  why_it_matters TEXT,
  updated_at TIMESTAMP
)

-- Chat history
messages (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  role TEXT,  -- 'user' | 'assistant'
  content TEXT,
  mode TEXT,  -- '@do', '@dump', etc.
  created_at TIMESTAMP
)
```

---

## Environment Variables

```env
# Supabase
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in your keys

# Initialize database
npx prisma migrate dev

# Start dev server
npm run dev
```

### Adding Features

**New Mode:**
1. Add to `lib/ai/modes.ts`
2. Test in chat

**New Memory Type:**
1. Add column to `user_memory` in schema
2. Update `lib/memory/identity.ts`
3. Add to prompt in `lib/ai/orchestrator.ts`

**New Validation Rule:**
1. Add check in `lib/ai/validator.ts`
2. Add fix logic

---

## Testing Strategy

### Unit Tests
```bash
# Mode detection
npm test lib/ai/modes.test.ts

# Tone validation
npm test lib/ai/validator.test.ts
```

### Integration Tests
```bash
# Chat API
npm test app/api/chat/route.test.ts
```

### Manual QA Checklist
- [ ] @dump: Responds with acknowledgment, no advice
- [ ] @do: Returns numbered micro-steps
- [ ] @clarity: Asks 1-2 short questions
- [ ] @ground: Single physical action
- [ ] Tone: No banned phrases in any response
- [ ] Length: Never exceeds mode's maxLines

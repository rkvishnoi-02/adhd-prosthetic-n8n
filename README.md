# Anchor - ADHD Cognitive Prosthetic

Your external executive brain.

**Not a productivity app. A brain extension.**

---

## What is Anchor?

Anchor is a cognitive prosthetic for ADHD minds. It replaces missing executive function with:

- **4 AI Modes** - Mental offload, micro-steps, clarity, overwhelm rescue
- **Identity Memory** - Remembers your name, role, project, why it matters
- **Session Tracking** - Detects cognitive state (overwhelmed, stuck, focused)
- **ADHD-Safe Tone** - Direct, warm, never guilt-trips

---

## Quick Start (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/anchor.git
cd anchor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
OPENAI_API_KEY="sk-your-openai-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**One-Click Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/anchor)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), React, TailwindCSS |
| Backend | Next.js API Routes, Clean Architecture |
| Database | Supabase (Postgres + Row Level Security) |
| Auth | Supabase Auth (email/password) |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

---

## Features

### 4 Core AI Modes

| Mode | Trigger | Purpose | Max Lines |
|------|---------|---------|-----------|
| **Dump** | `@dump` | Mental offload - just listen | 3 |
| **Do** | `@do` | Break into micro-steps | 7 |
| **Clarity** | `@clarity` | Ask clarifying questions | 3 |
| **Ground** | `@ground` | Overwhelm rescue | 2 |

### Example Usage

```
User: @do write an email to my boss

AI:
1. Open Gmail
2. Click Compose
3. Type boss's email in "To" field
4. Write subject: "Quick Update"
5. Write one sentence about status

Start with step 1.
```

---

## Project Structure

```
anchor/
├── app/
│   ├── (auth)/           # Login, signup pages
│   ├── (app)/            # Protected pages (chat, onboarding)
│   ├── api/              # API routes (chat, memory, session)
│   ├── error.tsx         # Global error boundary
│   ├── not-found.tsx     # 404 page
│   └── loading.tsx       # Loading state
├── components/
│   ├── chat/             # Chat UI components
│   └── auth/             # Auth form components
├── lib/
│   ├── ai/               # AI engine (modes, orchestrator, validator)
│   ├── memory/           # Identity & session management
│   ├── use-cases/        # Business logic (Clean Architecture)
│   ├── adapters/         # External service adapters
│   └── domain/           # Domain interfaces (ports)
├── types/                # TypeScript definitions
└── docs/                 # Documentation
```

---

## Database Schema

### Tables

**users**
- Extends Supabase auth.users
- Stores user profile

**user_memory**
- Name, role, current project, why it matters
- Used to personalize AI responses

**messages**
- Chat history with mode tracking
- User and assistant messages

**sessions**
- Session tracking with cognitive state
- Detects: overwhelmed, stuck, focused, neutral

All tables have Row Level Security (RLS) enabled.

---

## Development Commands

```bash
npm run dev         # Start dev server (port 3000)
npm run build       # Build for production
npm run start       # Start production server
npm run typecheck   # Check TypeScript
npm run lint        # Run ESLint
```

---

## Architecture Patterns

**Clean Architecture** (Ports & Adapters):
- `lib/domain/interfaces/` - Ports (interfaces)
- `lib/use-cases/` - Application business logic
- `lib/adapters/` - External service implementations (OpenAI, Supabase)
- `app/api/` - Controllers (thin HTTP layer)

**Benefits:**
- ✅ Testable (swap OpenAI for mock in tests)
- ✅ Swappable (change AI provider easily)
- ✅ Maintainable (clear boundaries)

---

## Best Practices Applied

### Vercel React Best Practices
- ✅ `rerender-transitions` - useTransition for smooth UX
- ✅ `rendering-hoist-jsx` - Static config outside components
- ✅ `bundle-barrel-imports` - Direct imports only
- ✅ `rendering-content-visibility` - Virtual scrolling for 50+ messages

### Supabase Postgres Best Practices
- ✅ Proper indexing on `user_id`, `created_at`
- ✅ Row Level Security enforced
- ✅ Efficient upserts and queries

### Web Interface Guidelines
- ✅ Semantic HTML (`<button>`, `<label>`, `<time>`)
- ✅ ARIA labels on all inputs
- ✅ Focus states with visible indicators
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### ADHD-Friendly Design
- ✅ Large text (16px+ minimum)
- ✅ Generous spacing
- ✅ High contrast
- ✅ Single-column layout
- ✅ One question per screen (onboarding)
- ✅ No motivational fluff

---

## MVP Complete ✅

- [x] User authentication (Supabase Auth)
- [x] 4 AI modes (@dump, @do, @clarity, @ground)
- [x] ADHD-safe tone validation
- [x] Identity memory persistence
- [x] Session context tracking
- [x] Onboarding flow
- [x] Chat interface
- [x] Error boundaries
- [x] Production build tested
- [x] Deployment ready

---

## Documentation

- [PRD](docs/PRD.md) - Product requirements
- [Architecture](docs/ARCHITECTURE.md) - System design
- [Development Plan](docs/DEVELOPMENT-PLAN.md) - Implementation roadmap
- [How to Use Claude](docs/HOW-TO-USE-CLAUDE.md) - Guide for non-coders
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel

---

## Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-your-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for details.

---

## Non-Negotiables

1. **ADHD-First** - Every feature reduces cognitive load
2. **Emotional Safety** - Never guilt, never shame
3. **Clarity Over Complexity** - Direct, warm, honest
4. **Auto-Save Everything** - Never lose user input
5. **Forgiveness Over Perfection** - Mistakes are okay

---

## Contributing

This project was built as an MVP. Future enhancements:

- [ ] More AI modes (@reflect, @think, @plan)
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] WhatsApp/SMS integration
- [ ] Habit tracking
- [ ] Pattern learning

---

## License

MIT License - See LICENSE file

---

## Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md)

For development questions, see documentation in `docs/`

---

**Built with Claude Code following Clean Architecture, Vercel React Best Practices, and ADHD-first design principles.**

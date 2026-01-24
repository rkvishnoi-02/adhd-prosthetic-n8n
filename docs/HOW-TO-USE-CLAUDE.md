# How to Build Anchor with Claude Code

This guide is for **non-coders**. Claude handles the technical work - you guide the vision.

---

## Your Role vs Claude's Role

| You Do | Claude Does |
|--------|-------------|
| Describe what you want | Write the code |
| Test the app | Fix bugs |
| Approve changes | Handle technical details |
| Keep the vision | Follow your rules |

---

## Getting Started

### Step 1: Open Terminal in Project Folder
```bash
cd "C:\Users\rkrao\OneDrive\Desktop\New folder\ADHD\anchor"
claude
```

### Step 2: Start Building
Just tell Claude what you want in plain English:
```
"Let's start Phase 1 - set up the project and database"
```

---

## How to Talk to Claude

### Good Examples
```
"Create the login page"
"Build the chat interface"
"Add the @dump mode"
"The button is too small, make it bigger"
"This response is too long, fix the validator"
```

### Claude Understands Context
You can be casual:
```
"now add the @do mode"
"test it"
"that looks wrong, the text should be white"
"commit this"
```

---

## Development Phases

Work through these in order. Just say "Let's work on Phase X"

### Phase 1: Foundation
```
"Set up the Next.js project with all dependencies"
"Create the database tables in Supabase"
```

### Phase 2: Authentication
```
"Build login and signup pages"
"Add session management"
```

### Phase 3: AI Engine
```
"Create the mode router for @dump, @do, @clarity, @ground"
"Build the prompt orchestrator"
"Add the tone validator"
```

### Phase 4: Chat Interface
```
"Build the chat API"
"Create the chat UI components"
```

### Phase 5: Memory System
```
"Add identity memory storage"
"Build session context"
```

### Phase 6: Onboarding
```
"Create the onboarding flow"
"Add identity capture prompts"
```

### Phase 7: Deploy
```
"Prepare for Vercel deployment"
"Set up environment variables"
```

---

## Testing Your App

### Run the Dev Server
```
npm run dev
```
Then open http://localhost:3000 in your browser.

### Test the AI Flow
```
/test-ai-flow
```
Claude will run through all modes and verify they work.

### Check for Errors
```
npm run typecheck
```
Claude will fix any TypeScript errors.

---

## Common Tasks

### "Something's Broken"
```
"The chat isn't working, help me debug"
"I'm getting an error: [paste the error]"
```

### "I Want to Change Something"
```
"Make the messages bigger"
"Change the color to blue"
"Add a dark mode"
```

### "Save My Work"
```
"Commit these changes"
```

### "Deploy the App"
```
"Deploy to Vercel"
```

---

## Useful Commands

| What You Want | What to Say |
|---------------|-------------|
| Start dev server | `npm run dev` |
| Check for errors | `npm run typecheck` |
| View database | `npx supabase studio` |
| Test AI flow | `/test-ai-flow` |
| Commit changes | `"commit this"` |

---

## Sub-Agents (Optional)

For specific tasks, you can call specialized agents:

| Agent | When to Use |
|-------|-------------|
| `@frontend-builder` | "Build a button" |
| `@backend-api` | "Create an API endpoint" |
| `@ai-orchestrator` | "Add a new AI mode" |
| `@database-architect` | "Add a new database table" |

Example:
```
@frontend-builder create the chat message component
```

---

## Skills (Automatic)

These activate automatically - no action needed:

| Skill | What It Does |
|-------|--------------|
| `systematic-debugging` | Helps fix bugs properly |
| `architecture-patterns` | Ensures good code structure |
| `adhd-response-validator` | Checks AI tone is ADHD-safe |

---

## Tips for Non-Coders

### 1. Be Specific About What You See
Bad: "It's broken"
Good: "The login button doesn't do anything when I click it"

### 2. Describe What You Want
Bad: "Make it better"
Good: "Make the text larger and add more space between messages"

### 3. Test Frequently
After each change, refresh your browser and try it out.

### 4. Don't Worry About Technical Terms
Claude understands:
- "The thing at the top" = header
- "The box where I type" = input field
- "The popup" = modal/dialog

### 5. Ask Claude to Explain
```
"Explain what you just did"
"Why did you do it that way?"
"What does this file do?"
```

---

## When Stuck

### Claude is Confused
```
"Let me clarify what I want..."
"No, I meant..."
```

### Something Keeps Breaking
```
"Let's step back and debug this systematically"
```

### You're Overwhelmed
```
"What should we work on next?"
"Give me a simple summary of where we are"
```

---

## Project Structure (Reference)

```
anchor/
├── app/           # Pages and API routes
├── components/    # UI pieces
├── lib/           # Logic (AI, memory, database)
├── types/         # TypeScript definitions
└── docs/          # Documentation (you're here)
```

---

## Remember

- **You're the product owner** - Claude implements your vision
- **Test often** - Catch issues early
- **Be direct** - Claude prefers clear instructions
- **It's okay to not know code** - That's Claude's job

---

## Quick Start Checklist

- [ ] Open terminal in project folder
- [ ] Run `claude` to start Claude Code
- [ ] Say "Let's start Phase 1"
- [ ] Follow along as Claude builds
- [ ] Test with `npm run dev`
- [ ] Move to next phase when ready

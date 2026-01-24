# ANCHOR – Product Requirements Document (PRD)

**Product:** Anchor – ADHD Cognitive Prosthetic

**Version:** 1.0 (MVP)

**Owner:** Rajendra Kumar

**Date:** January 2026

---

# 1. Product Vision

Anchor is **not a productivity app**.
It is a **cognitive prosthetic** that replaces missing executive function for ADHD minds.

Its purpose is to:

* Reduce overwhelm
* Inject clarity
* Activate action
* Provide emotional safety
* Act as an external executive brain

> **Anchor = Brain + Emotional Regulator + Execution Partner**

---

# 2. Core Philosophy

### 2.1 Emotional First, Systems Second

Ship **emotional resonance first**. Add sophistication later.

If the product does not make users feel:

* calmer
* safer
* understood
* less overwhelmed

…it has failed, regardless of feature count.

---

### 2.2 Executive Function Injection

Anchor does not:

* track tasks
* enforce discipline
* shame users

Anchor:

* removes friction
* converts intention → micro-action
* reduces cognitive load
* externalizes memory and planning

---

### 2.3 Forgiveness Over Perfection

ADHD users experience frequent task failure.

Anchor must:

* never guilt
* never shame
* never use motivational fluff
* always provide gentle redirection

---

# 3. Problem Statement

ADHD users:

* Know what to do
* Want to do it
* Cannot reliably initiate, sustain, or complete actions

Root cause is **executive dysfunction + emotional overload**, not laziness.

Current tools focus on:

* productivity
* tracking
* discipline

Anchor focuses on:

* clarity
* emotional safety
* action activation

---

# 4. Target User

Primary:

* Adults (18–35)
* ADHD or ADHD-traits
* High intelligence
* High ambition
* Low execution consistency

Psychological Profile:

* Overthinking
* Idea-heavy
* Overwhelm-prone
* Novelty-driven
* Emotionally sensitive

---

# 5. MVP Scope

## 5.1 What We Are Building

| Feature                     | Included |
| --------------------------- | -------- |
| Chat Interface              | ✅        |
| 4 Core AI Modes             | ✅        |
| Prompt Orchestration Engine | ✅        |
| Tone Validation System      | ✅        |
| Identity Memory             | ✅        |
| Session Context             | ✅        |
| Push Notifications (basic)  | ✅        |
| Supabase Auth               | ✅        |

---

## 5.2 What Is Explicitly Excluded (V2+)

| Feature                | Status |
| ---------------------- | ------ |
| Escalation Engine      | ❌      |
| SMS / WhatsApp / Voice | ❌      |
| Habit Tracking UI      | ❌      |
| Routine Builder        | ❌      |
| Pattern Learning       | ❌      |
| Voice Input / Output   | ❌      |

---

# 6. Core User Experience

Anchor must feel like **a calm, intelligent human assistant**.

Tone:

* short
* warm
* direct
* non-judgmental
* conversational

No long paragraphs. No robotic replies. No motivational fluff.

---

# 7. Primary User Journeys

## 7.1 First-Time Onboarding Flow (Critical)

Goal: Build **identity context + emotional trust** in under 5 minutes.

Steps:

1. Welcome message

   > "I'm here to reduce overwhelm and help you think clearly."

2. Identity capture (short conversational prompts)

   * Name
   * What they’re trying to improve
   * One current struggle

3. Purpose framing

   > "I’ll help you think less and do more — calmly."

4. First interaction: @dump

   * User unloads mental clutter

5. Immediate value moment

   * AI organizes + clarifies

Success Criteria:

* User feels understood
* User feels calmer
* User wants to continue

---

## 7.2 Daily Use Flow

1. User opens chat
2. Types or pastes thoughts
3. Uses @mode
4. Receives clarity + steps
5. Executes
6. Returns when overwhelmed

---

# 8. AI Interaction Model

## 8.1 Mode System

| Mode    | Trigger  | Purpose                  | Max Lines |
| ------- | -------- | ------------------------ | --------- |
| Dump    | @dump    | Mental offload           | 3         |
| Do      | @do      | Micro-step execution     | 7         |
| Clarity | @clarity | Ask clarifying questions | 3         |
| Ground  | @ground  | Overwhelm rescue         | 2         |

---

## 8.2 Mode Behavior Rules

### @dump

* Listen only
* No advice
* No solving
* End with: "Anything else?"

---

### @do

* Convert task → 3–5 physical micro-actions
* Each step ≤ 1 sentence
* No abstract language
* End with: "Start with step 1."

---

### @clarity

* Ask only 1–2 short questions
* Help user think, not replace thinking

---

### @ground

* One tiny physical action
* Calm tone
* Wait for completion

---

# 9. Tone & Language Rules (Critical)

## Allowed Tone

* Calm
* Human
* Supportive
* Direct

## Banned Phrases

```
"You got this"
"Great job"
"Just do..."
"Try to..."
"You should..."
"I understand that..."
```

---

# 10. Memory Model

## 10.1 Identity Memory (Active)

Stores:

* Name
* Role
* Current project
* Personal purpose (why it matters)

Injected into every prompt.

---

## 10.2 Session Memory (Active)

Stores:

* Last 10–20 messages
* Current cognitive state

---

# 11. System Architecture (MVP)

```
Chat UI
   ↓
Mode Router
   ↓
Prompt Orchestrator
   ↓
GPT-4o-mini
   ↓
Tone Validator
   ↓
User Response
```

---

# 12. Technical Stack

| Layer    | Choice                   |
| -------- | ------------------------ |
| Frontend | Next.js 14+ (App Router) |
| Styling  | Tailwind + shadcn/ui     |
| Backend  | Next.js API Routes       |
| Auth     | Supabase Auth            |
| Database | Supabase Postgres        |
| AI       | GPT-4o-mini / Claude     |
| Hosting  | Vercel                   |

---

# 13. MVP Development Timeline

| Week | Focus      | Deliverable                      |
| ---- | ---------- | -------------------------------- |
| 1    | Foundation | Auth + Chat UI shell             |
| 2    | AI Brain   | Modes + Orchestrator + Validator |
| 3    | Memory     | Identity + session context       |
| 4    | Polish     | Onboarding + Deploy              |

---

# 14. Success Metrics (MVP)

| Metric                 | Target             |
| ---------------------- | ------------------ |
| First response latency | < 500ms            |
| User return next day   | > 50%              |
| Mode usage             | > 60% use ≥2 modes |
| Emotional feedback     | "Feels calming"    |

---

# 15. V2+ Roadmap (Triggered By User Feedback)

| Phase | Feature                                      |
| ----- | -------------------------------------------- |
| V2.1  | More modes (@talk, @think, @plan, @regulate) |
| V2.2  | Escalation engine (Push → SMS)               |
| V2.3  | Habit tracking                               |
| V2.4  | Routine builder                              |
| V2.5  | Voice I/O                                    |
| V2.6  | Full escalation (WhatsApp, Voice)            |

---

# 16. Product Principles (Non-Negotiable)

1. ADHD-first design
2. Emotional safety > productivity
3. Clarity over complexity
4. Micro-steps over planning
5. Compassion over discipline

---

# 17. Definition of Done (MVP)

Anchor MVP is considered complete when:

* Users feel calmer after interaction
* Users can move from stuck → action
* Users report reduced overwhelm
* Users return the next day

---

# Final Note

Anchor is a **cognitive prosthetic**, not a productivity system.

Every feature must ask:

> "Does this reduce cognitive load and emotional friction?"

If the answer is no — the feature does not belong.

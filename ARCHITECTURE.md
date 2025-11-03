# System Architecture - ADHD Prosthetic

Visual reference for how all components connect.

---

## High-Level Overview

```
┌─────────────┐
│    User     │
│  (ADHD)     │
└──────┬──────┘
       │
       │ Messages via Telegram
       ↓
┌──────────────────────────────────────────────┐
│           Telegram Bot Interface             │
│  • Sends prompts                             │
│  • Receives replies                          │
│  • Available 24/7                            │
└──────┬───────────────────────────────────────┘
       │
       │ Webhook/API
       ↓
┌──────────────────────────────────────────────┐
│         n8n Workflow Automation              │
│                                              │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Workflow 1  │  │  Workflow 2  │        │
│  │    Master     │  │   Response   │        │
│  │   Scheduler   │  │   Handler    │        │
│  └──────┬────────┘  └──────┬───────┘        │
│         │                   │                 │
│  ┌──────▼────────┐  ┌──────▼───────┐        │
│  │  Workflow 3   │  │  Workflow 4  │        │
│  │   Pattern     │  │    Crisis    │        │
│  │   Analyzer    │  │   Monitor    │        │
│  └───────────────┘  └──────┬───────┘        │
│                             │                 │
│         ┌───────────────────▼────┐           │
│         │     Workflow 5         │           │
│         │     Win Tracker        │           │
│         └────────────────────────┘           │
│                                              │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
       │              │              │
       ↓              ↓              ↓
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Google  │   │ OpenAI   │   │ Emergency│
│  Sheets  │   │  GPT-4   │   │ Contacts │
│          │   │          │   │ (Optional)│
│ Database │   │  AI      │   │          │
└──────────┘   └──────────┘   └──────────┘
```

---

## Workflow Interactions

### Workflow 1: Master Scheduler

**Triggers:**
- Cron (time-based)
- 7:00 AM daily (morning wake)
- Other scheduled times

**Reads from:**
- Google Sheets (persona, goals, tasks, routines, history)

**Calls:**
- OpenAI (generate prompts)
- Telegram (send messages)

**Writes to:**
- Google Sheets (interaction_log)

**Connects to:**
- Workflow 2 (via webhook for response detection)

---

### Workflow 2: Response Handler

**Triggers:**
- Telegram message (any user message)

**Routes to:**
1. Confirmation → Win Tracker (Workflow 5)
2. Stuck request → AI analysis → Intervention
3. Journal entry → Sentiment analysis → Crisis Monitor (Workflow 4)
4. Commands (/list, /stats) → Query sheets → Reply
5. Negative spiral → Crisis assessment → Crisis Monitor (Workflow 4)
6. General chat → AI response

**Reads from:**
- Google Sheets (tasks, history, persona)

**Writes to:**
- Google Sheets (history, journal_entries, interaction_log)

**Calls:**
- OpenAI (various analyses)
- Telegram (send replies)

---

### Workflow 3: Pattern Analyzer

**Triggers:**
- Cron (Sunday 8:00 PM weekly)

**Reads from:**
- Google Sheets (history - full dataset)

**Processes:**
- Filter last 7 days
- Calculate metrics
- Identify patterns

**Calls:**
- OpenAI (generate insights)

**Writes to:**
- Google Sheets (patterns)

**Sends:**
- Telegram (weekly summary)

---

### Workflow 4: Crisis Monitor

**Triggers:**
- Webhook (called by Workflow 2)

**Receives:**
- Crisis alert with message text

**Calls:**
- OpenAI (severity assessment)

**Sends:**
1. If IMMEDIATE_DANGER:
   - Telegram (crisis resources)
   - Emergency contact (if configured)
2. If SIGNIFICANT_DISTRESS:
   - Telegram (supportive response)

**Writes to:**
- Google Sheets (crisis_log)

**Follow-up:**
- Wait 10-30 minutes
- Send check-in message

---

### Workflow 5: Win Tracker

**Triggers:**
- Webhook (called by Workflow 2)

**Receives:**
- Action completion notification

**Reads from:**
- Google Sheets (history, goals)

**Processes:**
- Calculate current streak
- Count weekly/monthly wins
- Check for milestones

**Calls:**
- OpenAI (generate celebration)

**Sends:**
- Telegram (immediate celebration)

**Writes to:**
- Google Sheets (history, milestones)

---

## Data Flow Diagram

### Morning Wake Sequence

```
07:00 AM Cron
    ↓
Master Scheduler (Workflow 1)
    ↓
Read: persona, goals, tasks, routines, history
    ↓
Calculate: streak, consistency, fade_mode
    ↓
AI: Generate wake prompt (directive or interrogative)
    ↓
Telegram: Send message to user
    ↓
Log: interaction_log
    ↓
Wait: 2 minutes for response
    ↓
[User sends "up" → Response Handler catches it]
    ↓
Response Handler (Workflow 2)
    ↓
Classify: Confirmation message
    ↓
Log: history (morning_wake_sequence completed)
    ↓
Trigger: Win Tracker webhook
    ↓
Win Tracker (Workflow 5)
    ↓
Calculate: streak (now 6 days!)
    ↓
AI: Generate celebration with identity connection
    ↓
Telegram: "⏰ Morning win! 6-day streak. You ARE..."
    ↓
[User feels dopamine hit]
```

---

## Crisis Detection Flow

```
[User sends: "I can't do this anymore"]
    ↓
Response Handler (Workflow 2)
    ↓
Switch: Classify message type
    ↓
Match: Negative spiral keywords
    ↓
AI: Assess severity
    ↓
IF: Contains crisis indicators
    ↓
Trigger: Crisis Monitor webhook
    ↓
Crisis Monitor (Workflow 4)
    ↓
AI: Verify crisis level (IMMEDIATE_DANGER?)
    ↓
IF YES:
    → Telegram: Send crisis hotline numbers
    → HTTP: Alert emergency contact (if configured)
    → Log: crisis_log
    → Wait: 10 minutes
    → Telegram: "Are you safe?"
    ↓
IF NO (SIGNIFICANT_DISTRESS):
    → AI: Generate compassionate response
    → Telegram: Send support message
    → Log: crisis_log
    → Wait: 30 minutes
    → Telegram: Gentle check-in
```

---

## Weekly Analysis Flow

```
Sunday 8:00 PM Cron
    ↓
Pattern Analyzer (Workflow 3)
    ↓
Read: Complete history from Google Sheets
    ↓
Filter: Last 7 days only
    ↓
Calculate:
    • Total wins
    • Wins by action type
    • Best day
    • Completion rates
    • Average response latency
    ↓
AI: Analyze data → Generate insights JSON
    {
        "celebration": "23 wins this week!",
        "pattern_detected": "Morning wake 86% consistent",
        "adjustment_needed": "Move shower prompt to 8pm",
        "encouragement": "You're building consistency"
    }
    ↓
Parse: Extract insights
    ↓
Log: patterns sheet (for future reference)
    ↓
AI: Generate human-readable weekly summary
    ↓
Telegram: Send summary to user
    ↓
IF adjustment_needed:
    → Update: system_config sheet
    → Apply: Changes take effect next day
```

---

## Database Schema

### Google Sheets Structure

```
ADHD_Prosthetic_Brain (Spreadsheet)
│
├── persona (User profile)
│   └── 14 fields: name, chat_id, struggle levels, tone, prompts
│
├── goals (Identity framework)
│   └── 7 fields: statements, connections, objectives
│
├── tasks (Daily to-do)
│   └── 8 columns: id, name, type, priority, status, deadline
│
├── routines (Step-by-step sequences)
│   └── 7 columns: name, step, action, template, timeout
│
├── history (All completions) ⭐ Most important
│   └── 8 columns: timestamp, date, action, status, streak
│
├── journal_entries (User writing)
│   └── 7 columns: timestamp, text, sentiment, crisis_flag
│
├── interaction_log (All messages)
│   └── 4 columns: timestamp, source, type, content
│
├── patterns (AI discoveries)
│   └── 6 columns: timestamp, type, observation, adjustment
│
├── system_config (Settings)
│   └── 3 columns: parameter, value, description
│
├── crisis_log (Safety events)
│   └── 6 columns: timestamp, severity, text, action
│
└── milestones (Achievements)
    └── 5 columns: timestamp, type, action, streak
```

---

## Credential Flow

### Authentication Paths

```
n8n
 ↓
 ├─→ Google Sheets OAuth2
 │   └─→ Read/Write access to ADHD_Prosthetic_Brain
 │
 ├─→ Telegram Bot API
 │   └─→ Bot Token → Send/Receive messages
 │
 └─→ OpenAI API
     └─→ API Key → GPT-4 model access
```

---

## Execution Timing

### Daily Schedule Example

```
07:00 AM - Morning Wake (Workflow 1)
07:02 AM - User replies "up" (Workflow 2 + 5)
07:05 AM - Next step: bathroom (Workflow 1)
07:08 AM - User replies "done" (Workflow 2 + 5)
07:10 AM - Next step: water (Workflow 1)
          ...
09:30 AM - Work deadline reminder (Workflow 1)
10:00 AM - Energy dip check (Workflow 1)
12:30 PM - Lunch reminder (Workflow 1)
14:30 PM - Hydration check (Workflow 1)
16:00 PM - Second energy dip (Workflow 1)
20:00 PM - Shower protocol (Workflow 1)
21:30 PM - Wind-down sequence (Workflow 1)

Anytime - User sends message (Workflow 2)
         • /list → Get tasks
         • /stats → Get weekly stats
         • "stuck" → Get intervention
         • Journal entry → Sentiment analysis

Sunday 8PM - Weekly analysis (Workflow 3)
```

---

## Resource Usage

### Per Day (Typical)

- **Google Sheets API calls**: ~50-100
  - Morning: 5-10 reads + 3-5 writes
  - Throughout day: 10-20 reads/writes
  - Evening: 5-10 reads + 3-5 writes

- **OpenAI API calls**: ~10-20
  - Morning prompts: 2-3 calls
  - Response generations: 5-10 calls
  - Celebrations: 3-5 calls

- **Telegram messages**: ~20-30
  - System prompts: 10-15
  - User replies: 10-15

### Cost Estimate (Monthly)

- **n8n Cloud**: $20-49/month (or free self-hosted)
- **OpenAI API**: $5-20/month (depends on usage)
- **Google Sheets**: Free
- **Telegram**: Free

**Total: ~$25-70/month** (or $0 if self-hosted n8n + minimal AI use)

---

## Scaling Considerations

### Single User (Current Design)
- ✅ All workflows optimized for one person
- ✅ Hardcoded chat ID
- ✅ Single Google Sheet

### Multiple Users (Future)
- Would need:
  - User table (user_id → chat_id mapping)
  - Separate sheets per user (or multi-tenant design)
  - User-specific workflow instances
  - Shared credential management

**Current system: Single-user only**

---

## Security Model

```
User Data
    ↓
Google Sheets (Your Account)
    • Private by default
    • You control access
    • Data stays in your Google account
    ↓
n8n Workflows (Your Instance)
    • Credentials stored encrypted
    • Execution logs contain data
    • Self-hosted = full control
    ↓
OpenAI API
    • Messages sent for processing
    • OpenAI data usage policy applies
    • No training on API data (per policy)
    ↓
Telegram
    • Bot messages stored on Telegram servers
    • Standard Telegram privacy policy
```

**Privacy Level: Medium**
- Data in your control: Google Sheets
- Data sent to 3rd parties: OpenAI, Telegram
- Recommendation: Use OpenAI privacy settings, avoid sharing sensitive info

---

## Failure Points & Redundancy

### Single Points of Failure

1. **n8n Server Down**
   - Impact: No workflows execute
   - Mitigation: Use n8n Cloud (99.9% uptime) or self-hosted with monitoring

2. **Google Sheets API Limit**
   - Impact: Can't read/write data
   - Mitigation: Stay under 100 requests/100 seconds limit

3. **OpenAI API Down**
   - Impact: No AI responses
   - Mitigation: Add fallback static responses

4. **Telegram API Down**
   - Impact: No communication
   - Mitigation: Rare; no alternative

### Graceful Degradation

- If AI fails → Send static prompt
- If sheet read fails → Use cached data
- If Telegram fails → Log for retry

---

## Monitoring & Alerts

### What to Monitor

1. **n8n Executions**
   - Failed workflows
   - Long execution times
   - Errors in logs

2. **OpenAI Usage**
   - Token consumption
   - Cost tracking
   - Rate limit hits

3. **Data Quality**
   - History sheet filling correctly
   - Streak calculations accurate
   - Sentiment scores reasonable

### Set Up Alerts

- n8n Cloud: Email on workflow failure
- OpenAI: Set up usage alerts
- Google: Enable email on unusual activity

---

## Next Steps

To understand how to build this:

1. **Start here**: [QUICKSTART.md](./QUICKSTART.md) - 30-minute basic setup
2. **Then**: [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Full implementation
3. **Reference**: [CONFIGURATION_TEMPLATES.md](./CONFIGURATION_TEMPLATES.md) - Copy-paste data
4. **Troubleshoot**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - When things break

---

**This architecture is designed for ADHD brains: simple, reliable, forgiving.** 🧠⚡

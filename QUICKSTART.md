# Quick Start Guide - ADHD Prosthetic System

## 30-Minute Setup

This guide gets you from zero to first morning wake prompt in 30 minutes.

---

## Phase 1: Accounts (5 minutes)

### 1. Get Telegram Bot Token

1. Open Telegram → Search `@BotFather`
2. Send: `/newbot`
3. Name: `ADHD Assistant` (or your choice)
4. Username: `your_adhd_bot` (must end in 'bot')
5. **Copy the token** → Save to notepad

### 2. Get Your Chat ID

1. Send any message to your new bot
2. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Find: `"chat":{"id":123456789}`
4. **Copy the number** → Save to notepad

### 3. OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click: **Create new secret key**
3. **Copy the key** → Save to notepad

---

## Phase 2: Google Sheet (10 minutes)

### 1. Create Sheet

1. Go to: https://sheets.google.com
2. Create new spreadsheet
3. Name: `ADHD_Prosthetic_Brain`

### 2. Create 11 Sheets (tabs at bottom)

Click "+" to add sheets, rename each:
- `persona`
- `goals`
- `tasks`
- `routines`
- `history`
- `journal_entries`
- `interaction_log`
- `patterns`
- `system_config`
- `crisis_log`
- `milestones`

### 3. Quick Setup - persona Sheet

**Row 1 (Headers):** `field` | `value`

**Row 2+:** Copy-paste this:

```
name	[Your Name]
telegram_chat_id	[Your Chat ID from Phase 1]
morning_struggle_severity	severe
ai_tone	directive_warm
ai_system_prompt	You are an executive function prosthetic for a person with ADHD. Be DIRECTIVE, IMMEDIATE, CONCISE, NON-JUDGMENTAL.
```

### 4. Quick Setup - goals Sheet

**Row 1:** `field` | `value`

**Row 2+:**

```
identity_statement	I am a person who shows up consistently
identity_connection_morning_wake	showing up when it's hard is what I do
```

### 5. Quick Setup - tasks Sheet

**Row 1:** `task_id` | `task_name` | `type` | `status` | `deadline`

**Row 2:**

```
t1	morning_wake_sequence	routine	pending	07:00
```

### 6. Quick Setup - routines Sheet

**Row 1:** `routine_name` | `step` | `action` | `prompt_template` | `wait_for_reply`

**Row 2:**

```
morning_activation	1	sit_up	Sit up right now. Reply 'up'.	yes
```

---

## Phase 3: n8n Setup (15 minutes)

### 1. Create n8n Account

- Go to: https://n8n.io/cloud
- Sign up (free tier works)
- Or use self-hosted: https://docs.n8n.io/hosting/

### 2. Add Credentials

#### Google Sheets:
1. n8n → Credentials → Create New
2. Select: **Google Sheets OAuth2**
3. Follow OAuth flow
4. Test: Select your `ADHD_Prosthetic_Brain` sheet

#### Telegram:
1. Create New → **Telegram API**
2. Paste bot token from Phase 1
3. Test connection

#### OpenAI:
1. Create New → **OpenAI API**
2. Paste API key from Phase 1
3. Verify connection

### 3. Create First Workflow

#### Step 1: New Workflow
- Click **Add Workflow**
- Name: `Morning_Wake_Test`

#### Step 2: Add Schedule Trigger
1. Search nodes: "Schedule Trigger"
2. Add to canvas
3. Settings:
   - Mode: `Every Day`
   - Hour: `7`
   - Minute: `0`
   - Timezone: [Your timezone]

#### Step 3: Add Google Sheets Node
1. Search: "Google Sheets"
2. Add after trigger
3. Settings:
   - Credential: [Select yours]
   - Operation: `Read`
   - Document: `ADHD_Prosthetic_Brain`
   - Sheet: `persona`
   - Range: `A1:B10`

#### Step 4: Add Telegram Node
1. Search: "Telegram"
2. Add after Google Sheets
3. Settings:
   - Credential: [Select yours]
   - Operation: `Send Message`
   - Chat ID: `{{ $json.telegram_chat_id }}`
   - Text: `Good morning! This is your wake prompt. Reply 'up' when you sit up.`

#### Step 5: Test It Now
1. Click **Execute Workflow** (top right)
2. Check Telegram - you should get a message!

### 4. Activate
- Toggle **Active** switch (top right)
- Workflow will now run at 7:00 AM daily

---

## Phase 4: Test (Right Now)

### Manual Test:

1. Send to your bot: `/list`
2. Expected: Error (we haven't built response handler yet)
3. That's okay - we'll add it next!

### Tomorrow Morning:

1. Wake up at 7:00 AM
2. Receive: "Good morning! This is your wake prompt..."
3. Reply: `up`
4. (No response yet - we'll add this in full build)

---

## What You Just Built

✅ Automated morning wake prompt at 7:00 AM
✅ Google Sheets database structure
✅ Telegram bot communication
✅ Foundation for full system

---

## Next Steps

### If This Worked:

**Proceed to full build:** [BUILD_GUIDE.md](./BUILD_GUIDE.md)

You'll add:
- Response handler (bot replies to you)
- Win celebrations
- Pattern analysis
- Crisis detection

### If Something Failed:

**Troubleshooting:**

1. **No Telegram message at 7:00 AM**
   - Check workflow is Active (toggle in top-right)
   - Verify timezone setting
   - Check execution history for errors

2. **Can't read Google Sheet**
   - Re-authorize OAuth2 credential
   - Check sheet name is exact: `ADHD_Prosthetic_Brain`
   - Verify range includes header row

3. **Telegram won't send**
   - Verify bot token is correct
   - Check chat ID matches your Telegram user
   - Test: send `/start` to your bot first

---

## Quick Reference

### Your Credentials
- Telegram Bot Token: `[saved in notepad]`
- Chat ID: `[saved in notepad]`
- OpenAI Key: `[saved in notepad]`

### Your Google Sheet
- URL: `[bookmark it]`
- Name: `ADHD_Prosthetic_Brain`

### Your n8n Instance
- URL: `[bookmark it]`

---

## Time Investment

- **Today**: 30 minutes (this quick start)
- **Week 1**: 2-3 hours (full build)
- **Ongoing**: 5 minutes/day (respond to prompts)
- **Maintenance**: 15 minutes/week (review stats)

---

## What to Expect

### Week 1:
- Daily morning wake prompts
- Manual task tracking
- Learning how the bot communicates

### Week 2:
- Automatic win celebrations
- Pattern detection starting
- First weekly summary

### Week 3:
- System suggests timing adjustments
- Graduated independence may activate (if 95%+ consistency)
- Full automation running

---

## Support

- **Full Guide**: [BUILD_GUIDE.md](./BUILD_GUIDE.md)
- **System Design**: [adhd prosthetic system.md](./adhd%20prosthetic%20system.md)
- **Main Docs**: [README.md](./README.md)

---

## Remember

This is a **prosthetic for your brain**, not a productivity app.

- It won't judge you for missing days
- It will celebrate tiny wins
- It learns from your patterns
- It provides structure, not shame

**Now go build it.** 🧠⚡

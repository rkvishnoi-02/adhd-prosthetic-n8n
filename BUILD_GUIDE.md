# ADHD Prosthetic System - Complete n8n Build Guide

## Overview

This guide provides step-by-step instructions to build a complete ADHD executive function prosthetic system using n8n workflows. The system acts as an external brain, providing time-based scaffolding, immediate intervention, pattern learning, and crisis support.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Architecture](#system-architecture)
3. [Setup Phase 1: Google Sheets Database](#setup-phase-1-google-sheets-database)
4. [Setup Phase 2: Telegram Bot](#setup-phase-2-telegram-bot)
5. [Setup Phase 3: OpenAI API](#setup-phase-3-openai-api)
6. [Setup Phase 4: n8n Configuration](#setup-phase-4-n8n-configuration)
7. [Workflow 1: Master Scheduler](#workflow-1-master-scheduler)
8. [Workflow 2: Response Handler](#workflow-2-response-handler)
9. [Workflow 3: Pattern Analyzer](#workflow-3-pattern-analyzer)
10. [Workflow 4: Crisis Monitor](#workflow-4-crisis-monitor)
11. [Workflow 5: Win Tracker](#workflow-5-win-tracker)
12. [Testing & Validation](#testing--validation)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before building this system, ensure you have:

- **n8n instance** (cloud or self-hosted): https://n8n.io
- **Google Account** for Google Sheets
- **Telegram Account** for bot creation
- **OpenAI API Key** with GPT-4 access
- **Basic understanding** of workflow automation
- **Crisis contact information** (optional but recommended for safety)

---

## System Architecture

### Five Core Workflows

1. **Master Scheduler**: Time-based triggers for daily interventions
2. **Response Handler**: 24/7 listener for all user messages
3. **Pattern Analyzer**: Weekly data analysis and system optimization
4. **Crisis Monitor**: Safety net for detecting and responding to distress
5. **Win Tracker**: Immediate dopamine reinforcement for completions

### Data Flow

```
User ←→ Telegram Bot ←→ n8n Workflows ←→ Google Sheets Database
                                ↓
                         OpenAI GPT-4
```

---

## Setup Phase 1: Google Sheets Database

### Step 1.1: Create New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `ADHD_Prosthetic_Brain`

### Step 1.2: Create Required Sheets

Create 11 sheets with the following names:
1. `persona`
2. `goals`
3. `tasks`
4. `routines`
5. `history`
6. `journal_entries`
7. `interaction_log`
8. `patterns`
9. `system_config`
10. `crisis_log`
11. `milestones`

### Step 1.3: Configure Sheet 1 - persona

**Column Headers (Row 1):**
```
field | value
```

**Data (Starting Row 2):**

| field | value |
|-------|-------|
| name | [Your Name] |
| telegram_chat_id | [To be filled after Telegram setup] |
| morning_struggle_severity | severe |
| task_initiation_resistance | high |
| time_blindness | high |
| negative_memory_bias | strong |
| natural_wake_time | 07:30 |
| energy_crash_times | 10:00, 16:00 |
| work_location | office |
| ai_tone | directive_warm |
| identity_goal | scientist_who_shows_up_consistently |
| emergency_contact_webhook | [Optional] |
| emergency_contact_phone | [Optional] |
| ai_system_prompt | You are an executive function prosthetic for a person with ADHD. Your job is to replace their impaired prefrontal cortex with external scaffolding. Be DIRECTIVE (commands not suggestions), HYPER-SPECIFIC (exact physical actions), IMMEDIATE (right now), CONCISE (max 2 sentences), NON-JUDGMENTAL (normalize struggles). When stuck: break into tiniest step. When spiraling: physical interrupt first. When completing: immediate celebration with identity connection. |

### Step 1.4: Configure Sheet 2 - goals

**Column Headers:**
```
field | value
```

**Data:**

| field | value |
|-------|-------|
| identity_statement | I am a scientist who shows up consistently and does excellent work |
| identity_connection_morning_wake | showing up when it's hard is what scientists do |
| identity_connection_supplements | investing in cognitive health like a peak performer does |
| identity_connection_shower | valuing clean starts and self-care like a disciplined professional |
| identity_connection_work_task | completing analysis is acting like the best scientist at the startup |
| current_season | winter_2024 |
| primary_objective | become_best_scientist_at_startup |

### Step 1.5: Configure Sheet 3 - tasks

**Column Headers:**
```
task_id | task_name | type | priority | first_step | status | deadline | notes
```

**Sample Data:**

| task_id | task_name | type | priority | first_step | status | deadline | notes |
|---------|-----------|------|----------|------------|--------|----------|-------|
| t1 | morning_wake_sequence | routine | critical | sit_up_in_bed | pending | 07:00 | |
| t2 | arrive_at_work | deadline | high | leave_house | pending | 09:30 | |
| t3 | take_supplements | habit | high | grab_pill_bottle | pending | post_gym | |

### Step 1.6: Configure Sheet 4 - routines

**Column Headers:**
```
routine_name | step | action | prompt_template | wait_for_reply | timeout_min | escalation_prompt
```

**Sample Data:**

| routine_name | step | action | prompt_template | wait_for_reply | timeout_min | escalation_prompt |
|--------------|------|--------|-----------------|----------------|-------------|-------------------|
| morning_activation | 1 | sit_up | Sit up right now. Don't think, just sit. Reply 'up'. | yes | 2 | You're in thought loops. Sit up. Legs off bed. Move now. |
| morning_activation | 2 | bathroom_splash | Stand. Walk to bathroom. Splash cold water on face. 30 sec. Reply 'done'. | yes | 3 | Physical action breaks ADHD paralysis. Bathroom. Now. |
| morning_activation | 3 | drink_water | Drink a full glass of water. Wakes your brain. Reply 'done'. | yes | 3 | Water = brain activation. Just drink it. Reply when done. |
| morning_activation | 4 | hygiene_choice | Shower OR just change clothes. Pick one, do it. I'll check at 7:45. | no | 45 | |

### Step 1.7: Configure Sheet 5 - history

**Column Headers:**
```
timestamp | date | action | status | response_latency_sec | streak_at_completion | win_number_this_week | notes
```

*Leave empty - will be populated by workflows*

### Step 1.8: Configure Sheet 6 - journal_entries

**Column Headers:**
```
timestamp | entry_text | word_count | sentiment_score | sentiment_label | entry_type | crisis_flag
```

*Leave empty - will be populated by workflows*

### Step 1.9: Configure Sheet 7 - interaction_log

**Column Headers:**
```
timestamp | source | message_type | message_content
```

*Leave empty - will be populated by workflows*

### Step 1.10: Configure Sheet 8 - patterns

**Column Headers:**
```
timestamp | pattern_type | observation | adjustment | effectiveness | last_updated
```

*Leave empty - will be populated by workflows*

### Step 1.11: Configure Sheet 9 - system_config

**Column Headers:**
```
parameter_name | value | description
```

**Initial Data:**

| parameter_name | value | description |
|----------------|-------|-------------|
| pause_mode | false | System-wide pause |
| paused_until | null | Resume timestamp |
| morning_wake_time_adjustment | 0 | Minutes to adjust (positive = later, negative = earlier) |
| shower_prompt_time | 20:00 | When to trigger shower protocol |
| hydration_interval_min | 120 | Minutes between hydration prompts |

### Step 1.12: Configure Sheet 10 - crisis_log

**Column Headers:**
```
timestamp | severity | entry_text | ai_reasoning | action_taken | emergency_contact_notified
```

*Leave empty - will be populated by workflows*

### Step 1.13: Configure Sheet 11 - milestones

**Column Headers:**
```
timestamp | milestone_type | action | streak_days | celebration_sent
```

*Leave empty - will be populated by workflows*

---

## Setup Phase 2: Telegram Bot

### Step 2.1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts to name your bot (e.g., "ADHD Prosthetic Assistant")
4. **Save the Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2.2: Get Your Chat ID

1. Send a message to your new bot (e.g., "hello")
2. Visit: `https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates`
   - Replace `[YOUR_BOT_TOKEN]` with the actual token from Step 2.1
3. Find `"chat":{"id":123456789}` in the response
4. **Copy the Chat ID number**
5. Add this Chat ID to your Google Sheet in `persona` sheet → `telegram_chat_id` field

### Step 2.3: Set Bot Commands

Send these commands to @BotFather:

```
/setcommands
```

Then paste:

```
list - Show today's tasks
stats - Your weekly progress
pause - Silence prompts (1 hour)
resume - Turn prompts back on
stuck - Get unstuck right now
journal - Quick journal prompt
help - Show command menu
```

---

## Setup Phase 3: OpenAI API

### Step 3.1: Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create new secret key
4. **Save the key** (starts with `sk-`)

### Step 3.2: Verify Model Access

- Ensure you have access to `gpt-4o` or `gpt-4`
- Check billing settings and usage limits

---

## Setup Phase 4: n8n Configuration

### Step 4.1: Set Up Credentials

#### Google Sheets OAuth2

1. In n8n, go to **Credentials** → **Create New**
2. Select **Google Sheets OAuth2 API**
3. Follow OAuth flow to authorize access
4. Test connection with your `ADHD_Prosthetic_Brain` spreadsheet

#### Telegram Credentials

1. Create new **Telegram API** credential
2. Enter your Bot Token from Step 2.1
3. Test by sending a test message

#### OpenAI Credentials

1. Create new **OpenAI API** credential
2. Enter your API key from Step 3.1
3. Verify connection

---

## Workflow 1: Master Scheduler

**Purpose:** Triggers all time-based interventions throughout the day

### Create New Workflow

1. In n8n, click **Add Workflow**
2. Name: `ADHD_Prosthetic_Master_Scheduler`
3. Save the workflow

### Node Configuration

#### NODE 1: Schedule Trigger - Morning Wake (7:00 AM)

- **Node Type:** Schedule Trigger
- **Node Name:** `Trigger_Morning_Wake_7AM`
- **Configuration:**
  - Trigger Interval: `Cron`
  - Cron Expression: `0 7 * * *`
  - Timezone: `Asia/Kolkata` (or your timezone)

#### NODE 2: Google Sheets - Read Persona

- **Node Type:** Google Sheets
- **Node Name:** `Read_Persona_Config`
- **Configuration:**
  - Credential: [Your Google Sheets OAuth2]
  - Operation: `Read`
  - Document: `ADHD_Prosthetic_Brain`
  - Sheet: `persona`
  - Range: `A1:B50`
  - Options:
    - Header Row: ✅ Enabled
    - RAW Data: ❌ Disabled
    - Value Render: `FORMATTED_VALUE`

**Connect:** `Trigger_Morning_Wake_7AM` → `Read_Persona_Config`

#### NODE 3: Google Sheets - Read Goals

- **Node Type:** Google Sheets
- **Node Name:** `Read_Goals`
- **Configuration:**
  - Same credential as above
  - Operation: `Read`
  - Sheet: `goals`
  - Range: `A1:B20`
  - Options: Same as Node 2

**Connect:** `Read_Persona_Config` → `Read_Goals`

#### NODE 4: Google Sheets - Read Today's Tasks

- **Node Type:** Google Sheets
- **Node Name:** `Read_Todays_Tasks`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `tasks`
  - Range: `A1:H50`

**Connect:** `Read_Goals` → `Read_Todays_Tasks`

#### NODE 5: Google Sheets - Read Routines

- **Node Type:** Google Sheets
- **Node Name:** `Read_Morning_Routine`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `routines`
  - Range: `A1:G100`

**Connect:** `Read_Todays_Tasks` → `Read_Morning_Routine`

#### NODE 6: Google Sheets - Read History

- **Node Type:** Google Sheets
- **Node Name:** `Read_Recent_History`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `history`
  - Range: `A1:H500`

**Connect:** `Read_Morning_Routine` → `Read_Recent_History`

#### NODE 7: Code - Build AI Context Package

- **Node Type:** Code (JavaScript)
- **Node Name:** `Build_Context_For_AI`
- **Configuration:**
  - Mode: `Run Once for All Items`
  - JavaScript Code:

```javascript
// Get all input data
const persona = $('Read_Persona_Config').all()[0].json;
const goals = $('Read_Goals').all()[0].json;
const tasks = $('Read_Todays_Tasks').all();
const routines = $('Read_Morning_Routine').all();
const history = $('Read_Recent_History').all();

// Get first step of morning routine
const morningRoutine = routines.filter(r => 
  r.json.routine_name === 'morning_activation' && r.json.step === 1
)[0];

// Calculate streak from history
const last30Days = history
  .filter(h => h.json.action === 'morning_wake_sequence')
  .sort((a, b) => new Date(b.json.date) - new Date(a.json.date))
  .slice(0, 30);

const completedDays = last30Days.filter(h => h.json.status === 'completed').length;
const consistencyRate = completedDays / 30;

// Calculate current streak (consecutive days)
let currentStreak = 0;
const today = new Date();
for (let i = 0; i < last30Days.length; i++) {
  const logDate = new Date(last30Days[i].json.date);
  const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === i && last30Days[i].json.status === 'completed') {
    currentStreak++;
  } else {
    break;
  }
}

// Check if user has earned graduated independence
const fadeMode = consistencyRate >= 0.95; // 95%+ for 30 days

// Find work deadline
const workTask = tasks.find(t => t.json.task_name === 'arrive_at_work');

// Build comprehensive context object
const context = {
  current_time: '07:00',
  current_date: new Date().toISOString().split('T')[0],
  situation: 'morning_wake',
  
  user_profile: {
    name: persona.name,
    morning_struggle_level: persona.morning_struggle_severity,
    tone_preference: persona.ai_tone,
    time_blindness: persona.time_blindness
  },
  
  identity: {
    statement: goals.identity_statement,
    connection: goals.identity_connection_morning_wake
  },
  
  routine: {
    name: 'morning_activation',
    current_step: 1,
    action: morningRoutine.json.action,
    template: morningRoutine.json.prompt_template,
    timeout_min: morningRoutine.json.timeout_min
  },
  
  performance: {
    thirty_day_consistency: Math.round(consistencyRate * 100),
    current_streak: currentStreak,
    fade_mode: fadeMode
  },
  
  todays_schedule: {
    work_deadline: workTask ? workTask.json.deadline : 'unknown'
  },
  
  system_prompt: persona.ai_system_prompt
};

return [{ json: context }];
```

**Connect:** `Read_Recent_History` → `Build_Context_For_AI`

#### NODE 8: IF - Check Graduated Independence

- **Node Type:** IF
- **Node Name:** `Check_If_Habit_Mastered`
- **Configuration:**
  - Conditions:
    - Value 1: `{{ $json.performance.fade_mode }}`
    - Operation: `boolean - equals`
    - Value 2: `true`

**Connect:** `Build_Context_For_AI` → `Check_If_Habit_Mastered`

#### NODE 9A: OpenAI - Generate Directive Prompt (Standard)

- **Node Type:** OpenAI
- **Node Name:** `AI_Generate_Directive_Wake_Prompt`
- **Configuration:**
  - Resource: `Chat`
  - Model: `gpt-4o`
  - Messages:
    
    **Message 1 (System Role):**
    - Role: `system`
    - Content: `{{ $json.system_prompt }}`
    
    **Message 2 (Context):**
    - Role: `system`
    - Content:
    ```
    CONTEXT:
    Time: {{ $json.current_time }}
    Situation: {{ $json.situation }}
    User: {{ $json.user_profile.name }}
    Morning Struggle: {{ $json.user_profile.morning_struggle_level }}
    Identity Goal: {{ $json.identity.statement }}
    Current Streak: {{ $json.performance.current_streak }} days
    Work Starts: {{ $json.todays_schedule.work_deadline }}
    Routine Template: {{ $json.routine.template }}
    ```
    
    **Message 3 (Task):**
    - Role: `user`
    - Content: `It's 7:00 AM. User is asleep with {{ $json.user_profile.morning_struggle_level }} morning paralysis. Generate the first wake-up message following the routine template. Make it immediate, directive, and reference their work deadline. Connect to their identity: "{{ $json.identity.connection }}". Maximum 30 words.`
  
  - Options:
    - Temperature: `0.7`
    - Max Tokens: `100`
    - Top P: `1`

**Connect:** `Check_If_Habit_Mastered` (FALSE path) → `AI_Generate_Directive_Wake_Prompt`

#### NODE 9B: OpenAI - Generate Interrogative Prompt (Graduated)

- **Node Type:** OpenAI
- **Node Name:** `AI_Generate_Interrogative_Prompt`
- **Configuration:**
  - Same as NODE 9A, but replace Message 3 with:
  
    **Message 3 (Task):**
    - Role: `user`
    - Content: `User has achieved 95%+ consistency for 30 days ({{ $json.performance.current_streak }} day streak!). They've earned graduated independence. Generate a prompt that ASKS if they've completed their wake sequence rather than commanding. Celebrate their mastery while checking in. Maximum 30 words.`

**Connect:** `Check_If_Habit_Mastered` (TRUE path) → `AI_Generate_Interrogative_Prompt`

#### NODE 10: Merge - Combine Prompt Paths

- **Node Type:** Merge
- **Node Name:** `Merge_Prompt_Types`
- **Configuration:**
  - Mode: `Merge By Position`
  - Inputs: `2`

**Connect:** Both `AI_Generate_Directive_Wake_Prompt` AND `AI_Generate_Interrogative_Prompt` → `Merge_Prompt_Types`

#### NODE 11: Telegram - Send Wake Message

- **Node Type:** Telegram
- **Node Name:** `Send_Wake_Message_To_User`
- **Configuration:**
  - Credential: [Your Telegram Bot]
  - Operation: `Send Message`
  - Chat ID: `{{ $('Read_Persona_Config').item.json.telegram_chat_id }}`
    - **Note:** Node name `Read_Persona_Config` must match exactly (case-sensitive)
  - Text: `{{ $json.choices[0].message.content }}`
  - Additional Fields:
    - Parse Mode: `Markdown`
    - Disable Notification: `false`

**Connect:** `Merge_Prompt_Types` → `Send_Wake_Message_To_User`

#### NODE 12: Google Sheets - Log Prompt Sent

- **Node Type:** Google Sheets
- **Node Name:** `Log_Prompt_Sent`
- **Configuration:**
  - Operation: `Append`
  - Sheet: `interaction_log`
  - Columns:
    - timestamp: `{{ $now.toISO() }}`
    - source: `system`
    - message_type: `morning_wake_prompt`
    - message_content: `{{ $('Send_Wake_Message_To_User').item.json.text }}`

**Connect:** `Send_Wake_Message_To_User` → `Log_Prompt_Sent`

### Save and Activate

1. Click **Save** in top-right corner
2. Toggle **Active** switch to enable the workflow
3. The workflow will now trigger at 7:00 AM daily

---

## Workflow 2: Response Handler

**Purpose:** Listens to ALL Telegram messages 24/7 and processes them

### Create New Workflow

1. Click **Add Workflow**
2. Name: `ADHD_Prosthetic_Response_Handler`
3. Save the workflow

### Node Configuration

#### NODE 1: Telegram Trigger - Listen for Messages

- **Node Type:** Telegram Trigger
- **Node Name:** `Listen_All_Telegram_Messages`
- **Configuration:**
  - Credential: [Your Telegram Bot]
  - Trigger: `Update`
  - Updates: `Message`
  - Additional Fields:
    - Download Files: `No`
    - Download Photos: `No`

#### NODE 2: Switch - Route Message by Type

- **Node Type:** Switch
- **Node Name:** `Classify_Message_Type`
- **Configuration:**
  - Mode: `Expression`
  - Outputs: `6`
  
  **Output 1 - Confirmation Reply:**
  - Expression: `{{ $json.message.text.toLowerCase().match(/^(up|done|yes|finished|completed)$/) !== null }}`
  
  **Output 2 - Need Help:**
  - Expression: `{{ $json.message.text.toLowerCase().match(/(stuck|help|can't|cannot|struggling)/) !== null }}`
  
  **Output 3 - Journal Entry:**
  - Expression: `{{ $json.message.text.split(' ').length > 10 }}`
  
  **Output 4 - Command:**
  - Expression: `{{ $json.message.text.startsWith('/') }}`
  
  **Output 5 - Negative Spiral:**
  - Expression: `{{ $json.message.text.toLowerCase().match(/(failure|can't do this|give up|worthless|hate myself)/) !== null }}`
  
  **Output 6 - General Chat:**
  - Expression: `{{ true }}`

**Connect:** `Listen_All_Telegram_Messages` → `Classify_Message_Type`

### Path 1: Confirmation Reply Processing

#### NODE 3: Code - Extract Context

- **Node Type:** Code
- **Node Name:** `Extract_Confirmation_Context`
- **JavaScript Code:**

```javascript
const messageText = $json.message.text.toLowerCase();
const timestamp = new Date($json.message.date * 1000);

return [{
  json: {
    reply_type: 'confirmation',
    reply_text: messageText,
    timestamp: timestamp.toISOString(),
    user_id: $json.message.from.id
  }
}];
```

**Connect:** `Classify_Message_Type` (Output 1) → `Extract_Confirmation_Context`

#### NODE 4: Google Sheets - Update Task Status

- **Node Type:** Google Sheets
- **Node Name:** `Mark_Task_Completed`
- **Configuration:**
  - Operation: `Append`
  - Sheet: `history`
  - Columns:
    - timestamp: `{{ $json.timestamp }}`
    - action: `morning_wake_sequence`
    - status: `completed`
    - response_text: `{{ $json.reply_text }}`

**Connect:** `Extract_Confirmation_Context` → `Mark_Task_Completed`

### Path 4: Command Processing (/list)

#### NODE 18: Switch - Route by Command

- **Node Type:** Switch
- **Node Name:** `Route_By_Command_Type`
- **Configuration:**
  - Output 1: `{{ $json.message.text === '/list' }}`
  - Output 2: `{{ $json.message.text === '/stats' }}`
  - Output 3: `{{ $json.message.text.startsWith('/pause') }}`
  - Output 4: `{{ $json.message.text === '/help' }}`

**Connect:** `Classify_Message_Type` (Output 4) → `Route_By_Command_Type`

#### NODE 19A: Google Sheets - Get Today's Tasks

- **Node Type:** Google Sheets
- **Node Name:** `Get_Pending_Tasks`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `tasks`
  - Range: `A:H`

**Connect:** `Route_By_Command_Type` (Output 1) → `Get_Pending_Tasks`

#### NODE 19B: Code - Format Task List

- **Node Type:** Code
- **Node Name:** `Format_Task_List_Message`
- **JavaScript Code:**

```javascript
const tasks = $input.all();
const pending = tasks.filter(t => t.json.status === 'pending');

if (pending.length === 0) {
  return [{
    json: {
      message: "🎯 No pending tasks. You're clear for today!"
    }
  }];
}

let message = "📋 Today's Tasks:\n\n";
pending.forEach((task, i) => {
  const deadline = task.json.deadline || 'no deadline';
  message += `${i + 1}. ${task.json.task_name}\n   ⏰ ${deadline}\n\n`;
});

return [{ json: { message } }];
```

**Connect:** `Get_Pending_Tasks` → `Format_Task_List_Message`

#### NODE 19C: Telegram - Send Task List

- **Node Type:** Telegram
- **Node Name:** `Send_Task_List`
- **Configuration:**
  - Operation: `Send Message`
  - Chat ID: `{{ $('Listen_All_Telegram_Messages').item.json.message.chat.id }}`
  - Text: `{{ $json.message }}`
  - Parse Mode: `Markdown`

**Connect:** `Format_Task_List_Message` → `Send_Task_List`

### Save and Activate

1. Click **Save**
2. Toggle **Active** to enable 24/7 listening

---

## Workflow 3: Pattern Analyzer

**Purpose:** Runs weekly to analyze data and generate insights

### Create New Workflow

1. Click **Add Workflow**
2. Name: `ADHD_Prosthetic_Pattern_Analyzer`
3. Save the workflow

### Node Configuration

#### NODE 1: Schedule Trigger - Sunday Evening

- **Node Type:** Schedule Trigger
- **Node Name:** `Trigger_Weekly_Analysis_Sunday_8PM`
- **Configuration:**
  - Cron Expression: `0 20 * * 0`
  - Timezone: `Asia/Kolkata`

#### NODE 2: Google Sheets - Read Full History

- **Node Type:** Google Sheets
- **Node Name:** `Read_Complete_History`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `history`
  - Range: `A:H`

**Connect:** `Trigger_Weekly_Analysis_Sunday_8PM` → `Read_Complete_History`

#### NODE 3: Code - Filter to Last 7 Days

- **Node Type:** Code
- **Node Name:** `Filter_This_Week_Data`
- **JavaScript Code:**

```javascript
const history = $input.all();
const now = new Date();
const weekAgo = new Date(now);
weekAgo.setDate(now.getDate() - 7);

const thisWeek = history.filter(h => {
  const date = new Date(h.json.date || h.json.timestamp);
  return date >= weekAgo;
});

return thisWeek;
```

**Connect:** `Read_Complete_History` → `Filter_This_Week_Data`

#### NODE 4: Code - Calculate Weekly Metrics

- **Node Type:** Code
- **Node Name:** `Calculate_Weekly_Performance`
- **JavaScript Code:**

```javascript
const weekData = $input.all();

// Initialize counters
const metrics = {
  total_wins: 0,
  by_action: {},
  best_day: { date: null, wins: 0 }
};

// Count completions by action type
weekData.forEach(entry => {
  const action = entry.json.action;
  const status = entry.json.status;
  
  if (status === 'completed') {
    metrics.total_wins++;
    metrics.by_action[action] = (metrics.by_action[action] || 0) + 1;
  }
});

// Find best day
const byDay = {};
weekData.forEach(entry => {
  if (entry.json.status === 'completed') {
    const date = entry.json.date;
    byDay[date] = (byDay[date] || 0) + 1;
  }
});

Object.keys(byDay).forEach(date => {
  if (byDay[date] > metrics.best_day.wins) {
    metrics.best_day = { date, wins: byDay[date] };
  }
});

return [{ json: metrics }];
```

**Connect:** `Filter_This_Week_Data` → `Calculate_Weekly_Performance`

#### NODE 5: OpenAI - Generate Weekly Summary

- **Node Type:** OpenAI
- **Node Name:** `AI_Generate_Weekly_Summary`
- **Configuration:**
  - Model: `gpt-4o`
  - Messages:
    
    **Message 1:**
    - Role: `system`
    - Content: `You are an ADHD coach delivering a weekly review. Your tone is warm, data-driven, and motivating. Focus on PROGRESS, not perfection.`
    
    **Message 2:**
    - Role: `system`
    - Content: `Weekly Data: Total Wins: {{ $json.total_wins }}, Best Day: {{ $json.best_day.date }}`
    
    **Message 3:**
    - Role: `user`
    - Content: `Generate a weekly summary message that celebrates wins and identifies one small adjustment for next week. Maximum 120 words.`
  
  - Temperature: `0.7`
  - Max Tokens: `300`

**Connect:** `Calculate_Weekly_Performance` → `AI_Generate_Weekly_Summary`

#### NODE 6: Telegram - Send Weekly Summary

- **Node Type:** Telegram
- **Node Name:** `Send_Weekly_Summary`
- **Configuration:**
  - Operation: `Send Message`
  - Chat ID: `[Your Chat ID from persona sheet]`
  - Text: `{{ $json.choices[0].message.content }}`
  - Parse Mode: `Markdown`

**Connect:** `AI_Generate_Weekly_Summary` → `Send_Weekly_Summary`

### Save and Activate

1. Click **Save**
2. Toggle **Active** to enable weekly analysis

---

## Workflow 4: Crisis Monitor

**Purpose:** Detects severe distress and executes safety protocol

### Create New Workflow

1. Click **Add Workflow**
2. Name: `ADHD_Prosthetic_Crisis_Monitor`
3. Save the workflow

### Node Configuration

#### NODE 1: Webhook Trigger

- **Node Type:** Webhook
- **Node Name:** `Crisis_Alert_Webhook`
- **Configuration:**
  - HTTP Method: `POST`
  - Path: `/crisis-detected`
  - Response Mode: `Immediately`

#### NODE 2: OpenAI - Verify Crisis Severity

- **Node Type:** OpenAI
- **Node Name:** `AI_Verify_Crisis_Level`
- **Configuration:**
  - Model: `gpt-4o`
  - Messages:
    
    **Message 1:**
    - Role: `system`
    - Content: `You are a licensed clinical psychologist. Assess if this message indicates IMMEDIATE DANGER or SIGNIFICANT DISTRESS. Respond with JSON: {"severity": "IMMEDIATE_DANGER" or "SIGNIFICANT_DISTRESS", "reasoning": "brief assessment"}`
    
    **Message 2:**
    - Role: `user`
    - Content: `Assess this message: "{{ $json.entry_text }}"`
  
  - Temperature: `0.1`
  - Response Format: `json_object`

**Connect:** `Crisis_Alert_Webhook` → `AI_Verify_Crisis_Level`

#### NODE 3: IF - Route by Severity

- **Node Type:** IF
- **Node Name:** `Check_Severity_Level`
- **Configuration:**
  - Condition: `{{ $json.choices[0].message.content }}` contains `IMMEDIATE_DANGER`

**Connect:** `AI_Verify_Crisis_Level` → `Check_Severity_Level`

#### NODE 4: Telegram - Send Crisis Resources

- **Node Type:** Telegram
- **Node Name:** `Send_Immediate_Crisis_Resources`
- **Configuration:**
  - Text:
  ```
  🆘 I'm concerned about you based on what you just shared.

  If you're having thoughts of harming yourself, please reach out for help RIGHT NOW:

  📞 National Suicide Prevention Lifeline (India):
     Vandrevala Foundation: 9999 666 555
     AASRA: +91-9820466726

  You matter. Help is available 24/7.
  ```

**Connect:** `Check_Severity_Level` (TRUE path) → `Send_Immediate_Crisis_Resources`

### Save and Activate

1. Click **Save**
2. Toggle **Active**

---

## Workflow 5: Win Tracker

**Purpose:** Provides immediate dopamine reinforcement

### Create New Workflow

1. Click **Add Workflow**
2. Name: `ADHD_Prosthetic_Win_Tracker`
3. Save the workflow

### Node Configuration

#### NODE 1: Webhook Trigger

- **Node Type:** Webhook
- **Node Name:** `Win_Completion_Webhook`
- **Configuration:**
  - HTTP Method: `POST`
  - Path: `/win-completed`

#### NODE 2: Google Sheets - Read Recent History

- **Node Type:** Google Sheets
- **Node Name:** `Read_Recent_Wins`
- **Configuration:**
  - Operation: `Read`
  - Sheet: `history`
  - Range: `A:H`

**Connect:** `Win_Completion_Webhook` → `Read_Recent_Wins`

#### NODE 3: Code - Calculate Streak

- **Node Type:** Code
- **Node Name:** `Calculate_Win_Context`
- **JavaScript Code:**

```javascript
const action = $('Win_Completion_Webhook').item.json.action;
const history = $('Read_Recent_Wins').all();

// Calculate streak
let streak = 0;
const today = new Date();
const actionHistory = history
  .filter(h => h.json.action === action)
  .sort((a, b) => new Date(b.json.date) - new Date(a.json.date));

for (let i = 0; i < actionHistory.length; i++) {
  const logDate = new Date(actionHistory[i].json.date);
  const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === i && actionHistory[i].json.status === 'completed') {
    streak++;
  } else {
    break;
  }
}

return [{
  json: {
    action: action,
    streak_days: streak
  }
}];
```

**Connect:** `Read_Recent_Wins` → `Calculate_Win_Context`

#### NODE 4: OpenAI - Generate Celebration

- **Node Type:** OpenAI
- **Node Name:** `AI_Generate_Win_Celebration`
- **Configuration:**
  - Model: `gpt-4o`
  - Messages:
    
    **Message 1:**
    - Role: `system`
    - Content: `You are an ADHD coach who provides IMMEDIATE dopamine reinforcement. Use present tense ("you ARE"), include data, make it feel GOOD. Maximum 35 words.`
    
    **Message 2:**
    - Role: `user`
    - Content: `Generate celebration for {{ $json.action }}. Current streak: {{ $json.streak_days }} days.`
  
  - Temperature: `0.8`
  - Max Tokens: `100`

**Connect:** `Calculate_Win_Context` → `AI_Generate_Win_Celebration`

#### NODE 5: Telegram - Send Celebration

- **Node Type:** Telegram
- **Node Name:** `Send_Instant_Celebration`
- **Configuration:**
  - Operation: `Send Message`
  - Chat ID: `[Your Chat ID]`
  - Text: `{{ $json.choices[0].message.content }}`
  - Parse Mode: `Markdown`

**Connect:** `AI_Generate_Win_Celebration` → `Send_Instant_Celebration`

### Save and Activate

1. Click **Save**
2. Toggle **Active**

---

## Testing & Validation

### Week 1 Test Checklist

- [ ] **Morning wake sequence fires at 7:00 AM**
  - Verify you receive Telegram message at 7:00 AM
  - Reply "up" and confirm next step arrives
  
- [ ] **Win celebration sends within 5 seconds**
  - Complete an action
  - Verify immediate celebration message
  
- [ ] **/list command returns today's tasks**
  - Send `/list` to bot
  - Verify task list displays correctly
  
- [ ] **Pattern analyzer runs Sunday night**
  - Wait for Sunday 8:00 PM
  - Verify weekly summary arrives
  
- [ ] **Crisis detection works**
  - Test with a sample distress message
  - Verify appropriate response

### Debug Mode

To test workflows without waiting for cron triggers:

1. Open workflow in n8n
2. Click **Execute Workflow** button
3. Use **Pin Data** feature to simulate inputs
4. Check execution logs for errors

---

## Troubleshooting

### Telegram Bot Not Responding

**Symptoms:** Bot doesn't reply to messages

**Solutions:**
1. Verify bot token is correct in n8n credentials
2. Check that Response Handler workflow is **Active**
3. Test webhook: send `/list` command
4. Review n8n execution logs for errors

### Google Sheets Not Reading Data

**Symptoms:** Workflows fail to fetch sheet data

**Solutions:**
1. Verify OAuth2 credentials are valid
2. Check sheet names match exactly (case-sensitive)
3. Ensure ranges include header row
4. Test connection in credential settings

### OpenAI API Errors

**Symptoms:** AI responses fail or timeout

**Solutions:**
1. Verify API key has sufficient credits
2. Check model name is correct (`gpt-4o`)
3. Reduce max tokens if hitting limits
4. Review temperature settings (0.1-1.0)

### Cron Not Triggering

**Symptoms:** Scheduled workflows don't fire

**Solutions:**
1. Verify cron expression syntax
2. Check timezone setting matches your location
3. Ensure workflow is **Active**
4. Test manually with "Execute Workflow" button

### Data Not Logging to History

**Symptoms:** History sheet remains empty

**Solutions:**
1. Check sheet name is exactly `history`
2. Verify column headers match node configuration
3. Test Append operation with sample data
4. Review execution logs for errors

---

## Advanced Configuration

### Customizing Prompts

To adjust AI tone and personality:

1. Edit `persona` sheet → `ai_system_prompt` field
2. Modify OpenAI node messages in workflows
3. Adjust temperature (lower = more consistent, higher = more creative)

### Adding New Routines

1. Add routine to `routines` sheet with steps
2. Create new cron trigger in Master Scheduler
3. Reference routine in Build Context code node
4. Test manually before activating

### Adjusting Timing

- Edit cron expressions for different trigger times
- Update `system_config` sheet parameters
- Pattern Analyzer will suggest timing optimizations

---

## Safety & Privacy

### Crisis Protocol Setup

1. **Designate Emergency Contact** (optional but recommended)
   - Add phone number to `persona` sheet
   - Provide consent for crisis notifications
   
2. **Test Crisis Detection**
   - Use safe test phrases
   - Verify response times
   - Confirm resource links work

### Data Privacy

- Google Sheets contains personal health data
- Restrict sheet sharing to yourself only
- Use strong passwords for all accounts
- Enable 2FA on Google, Telegram, OpenAI accounts

### OpenAI API Usage

- Set monthly spending limits
- Monitor token usage
- Be aware: messages sent to OpenAI are logged per their policy

---

## Next Steps

### Week 1: Foundation

1. ✅ Complete Google Sheets setup
2. ✅ Build Workflow 1 (Master Scheduler)
3. ✅ Build Workflow 2 (Response Handler - /list command only)
4. Test morning wake sequence on yourself

### Week 2: Expansion

1. Add remaining paths to Response Handler (stuck, journal, crisis)
2. Build Workflow 5 (Win Tracker)
3. Test complete morning → confirmation → celebration loop

### Week 3: Intelligence

1. Build Workflow 3 (Pattern Analyzer)
2. Build Workflow 4 (Crisis Monitor)
3. Let system run for 7 days to generate first weekly report

### Week 4: Optimization

1. Review Pattern Analyzer suggestions
2. Adjust timing based on data
3. Fine-tune AI prompts for your preferences
4. Add optional workflows (evening shutdown, interoceptive training)

---

## Support & Resources

### n8n Documentation
- Official Docs: https://docs.n8n.io
- Community Forum: https://community.n8n.io

### Additional Help
- Telegram Bot API: https://core.telegram.org/bots/api
- OpenAI API Docs: https://platform.openai.com/docs
- Google Sheets API: https://developers.google.com/sheets/api

---

## Credits

This system is designed specifically for ADHD executive function support, incorporating:
- Cognitive behavioral therapy principles
- Identity-based habit formation
- Graduated scaffolding
- Immediate reinforcement
- Pattern-based learning

**Remember:** This is a prosthetic for your brain, not a cure. It works by providing external structure for impaired executive function. Be patient with yourself and the system as both learn together.

---

**Your external brain is ready. Now make it real.** 🧠⚡

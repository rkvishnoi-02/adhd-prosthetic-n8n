FINAL COMPREHENSIVE N8N BUILD GUIDE + APP DESIGN FOR ADHD BRAIN

PART 1: COMPLETE N8N WORKFLOW BUILD INSTRUCTIONS
This is your step-by-step guide to build all 5 workflows in n8n. I'll give you exact node configurations, logic, and connections.

WORKFLOW 1: MASTER SCHEDULER (Your External Clock & Initiator)
Purpose: Triggers all time-based interventions throughout the day
SETUP: Create New Workflow in n8n
Name: ADHD_Prosthetic_Master_Scheduler

NODE 1: Schedule Trigger - Morning Wake (7:00 AM)
Node Type: Schedule Trigger Node Name: Trigger_Morning_Wake_7AM
Configuration:
Trigger Interval: Cron
Cron Expression: 0 7 * * *
Timezone: Asia/Kolkata
Description: "Triggers daily morning wake sequence"

NODE 2: Google Sheets - Read Persona
Node Type: Google Sheets Node Name: Read_Persona_Config
Configuration:
Credential: [Your Google Sheets OAuth2]
Operation: Read
Document: Select "ADHD_Prosthetic_Brain"
Sheet: persona
Range: A1:B50
Options:
Header Row: Enabled
RAW Data: Disabled
Value Render: FORMATTED_VALUE
Output Structure Expected:
{
  "name": "User",
  "morning_struggle_severity": "severe",
  "ai_tone": "directive_warm",
  "ai_system_prompt": "[full prompt text]",
  "time_blindness": "high",
  "identity_goal": "scientist_who_shows_up_consistently"
}


NODE 3: Google Sheets - Read Goals
Node Type: Google Sheets Node Name: Read_Goals
Configuration:
Same credential
Operation: Read
Sheet: goals
Range: A1:B20
Options: Same as above
Output Expected:
{
  "identity_statement": "I am a scientist who shows up consistently and does excellent work",
  "identity_connection_morning_wake": "showing up when it's hard is what scientists do",
  "identity_connection_supplements": "investing in cognitive health like a peak performer",
  "current_season": "winter_2024",
  "primary_objective": "become_best_scientist_at_startup"
}


NODE 4: Google Sheets - Read Today's Tasks
Node Type: Google Sheets Node Name: Read_Todays_Tasks
Configuration:
Operation: Read
Sheet: tasks
Range: A1:H50
Output Expected:
[
  {
    "task_id": "t1",
    "task_name": "morning_wake_sequence",
    "type": "routine",
    "status": "pending",
    "deadline": "07:00"
  },
  {
    "task_id": "t2",
    "task_name": "arrive_at_work",
    "deadline": "09:30"
  }
]


NODE 5: Google Sheets - Read Routines
Node Type: Google Sheets Node Name: Read_Morning_Routine
Configuration:
Operation: Read
Sheet: routines
Range: A1:G100
Output Expected:
[
  {
    "routine_name": "morning_activation",
    "step": 1,
    "action": "sit_up",
    "prompt_template": "Sit up right now. Don't think, just sit.",
    "wait_for_reply": "yes",
    "timeout_min": 2,
    "escalation_prompt": "You're in thought loops. Sit up. Legs off bed. Move now."
  },
  {
    "routine_name": "morning_activation",
    "step": 2,
    "action": "bathroom_splash",
    ...
  }
]


NODE 6: Google Sheets - Read History (Last 30 Days)
Node Type: Google Sheets Node Name: Read_Recent_History
Configuration:
Operation: Read
Sheet: history
Range: A1:H500 (pulls recent data)
Purpose: Used to calculate streaks and check for graduated independence

NODE 7: Code - Build AI Context Package
Node Type: Code (JavaScript) Node Name: Build_Context_For_AI
Configuration:
Mode: Run Once for All Items
JavaScript Code:
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

Output: A single JSON object with ALL context needed for AI decision-making

NODE 8: IF - Check Graduated Independence
Node Type: IF Node Name: Check_If_Habit_Mastered
Configuration:
Conditions:
Condition 1:
Value 1: {{ $json.performance.fade_mode }}
Operation: boolean - equals
Value 2: true
Two Output Paths:
TRUE → Goes to "Generate Interrogative Prompt" (graduated user)
FALSE → Goes to "Generate Directive Prompt" (still needs scaffolding)

NODE 9A: OpenAI - Generate Directive Prompt (Standard)
Node Type: OpenAI Node Name: AI_Generate_Directive_Wake_Prompt
Configuration:
Resource: Chat
Model: gpt-4o
Messages:
Message 1 (System Role):
Role: system
Content: {{ $json.system_prompt }}

Message 2 (Context):
Role: system
Content: CONTEXT:
Time: {{ $json.current_time }}
Situation: {{ $json.situation }}
User: {{ $json.user_profile.name }}
Morning Struggle: {{ $json.user_profile.morning_struggle_level }}
Identity Goal: {{ $json.identity.statement }}
Current Streak: {{ $json.performance.current_streak }} days
Work Starts: {{ $json.todays_schedule.work_deadline }}
Routine Template: {{ $json.routine.template }}

Message 3 (Task):
Role: user
Content: It's 7:00 AM. User is asleep with {{ $json.user_profile.morning_struggle_level }} morning paralysis. Generate the first wake-up message following the routine template. Make it immediate, directive, and reference their work deadline. Connect to their identity: "{{ $json.identity.connection }}". Maximum 30 words.

Options:
Temperature: 0.7
Max Tokens: 100
Top P: 1
Expected Output Example:
{
  "choices": [{
    "message": {
      "content": "Morning. Sit up right now. Work at 9:30—you have time but start NOW. Scientists show up when it's hard. Reply 'up'."
    }
  }]
}


NODE 9B: OpenAI - Generate Interrogative Prompt (Graduated)
Node Type: OpenAI Node Name: AI_Generate_Interrogative_Prompt
Configuration:
Same as 9A, but different Message 3:
Message 3 (Task):
Role: user
Content: User has achieved 95%+ consistency for 30 days ({{ $json.performance.current_streak }} day streak!). They've earned graduated independence. Generate a prompt that ASKS if they've completed their wake sequence rather than commanding. Celebrate their mastery while checking in. Maximum 30 words.

Expected Output Example:
{
  "choices": [{
    "message": {
      "content": "Morning champion! 30-day streak—you've mastered this. Have you done your wake sequence? Reply 'yes' or 'need prompt'."
    }
  }]
}


NODE 10: Merge - Combine Prompt Paths
Node Type: Merge Node Name: Merge_Prompt_Types
Configuration:
Mode: Merge By Position
Inputs: 2 (from Node 9A and 9B)
Purpose: Both paths converge here so the workflow continues regardless of which prompt type was generated

NODE 11: Telegram - Send Wake Message
Node Type: Telegram Node Name: Send_Wake_Message_To_User
Configuration:
Credential: [Your Telegram Bot]
Operation: Send Message
Chat ID: {{ $('Read_Persona_Config').item.json.telegram_chat_id }}
(Add this field to persona sheet with your chat ID)
Text: {{ $json.choices[0].message.content }}
Additional Fields:
Parse Mode: Markdown
Disable Notification: false (WANT to wake user)
Reply Markup: None

NODE 12: Google Sheets - Log Prompt Sent
Node Type: Google Sheets Node Name: Log_Prompt_Sent
Configuration:
Operation: Append
Sheet: interaction_log
Columns:
timestamp: {{ $now.toISO() }}
source: system
message_type: morning_wake_prompt
message_content: {{ $('Send_Wake_Message_To_User').item.json.text }}
fade_mode: {{ $('Build_Context_For_AI').item.json.performance.fade_mode }}
Purpose: Creates audit trail of all system messages for pattern analysis

NODE 13: Wait - Pause for Response
Node Type: Wait Node Name: Wait_For_User_Response_2min
Configuration:
Resume: Webhook
Amount: 2
Unit: minutes
Options:
Respond Immediately: Enabled
Response Code: 200
What Happens:
Workflow PAUSES here for 2 minutes
If user replies to Telegram during this time, Workflow 2 (Response Handler) catches it and calls this webhook to resume
If no reply after 2 minutes, workflow continues to escalation

NODE 14: HTTP Request - Check If User Responded
Node Type: HTTP Request Node Name: Check_Response_Received
Configuration:
Method: GET
URL: {{ $env.N8N_WEBHOOK_BASE_URL }}/response-status?user_id={{ $('Read_Persona_Config').item.json.name }}&action=morning_wake
Authentication: None (internal call)
Options:
Response Format: JSON
Timeout: 5000
Expected Response:
{
  "user_responded": true,
  "response_text": "up",
  "timestamp": "2024-11-04T07:02:15Z"
}

OR
{
  "user_responded": false,
  "reason": "timeout_2min"
}


NODE 15: IF - Did User Respond?
Node Type: IF Node Name: Check_If_Responded
Configuration:
Conditions:
Value 1: {{ $json.user_responded }}
Operation: boolean - equals
Value 2: true
Two Paths:
TRUE → Go to Node 20 (Next Step Generator)
FALSE → Go to Node 16 (Escalation)

NODE 16: OpenAI - Generate Escalation
Node Type: OpenAI Node Name: AI_Generate_Escalation_Prompt
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: {{ $('Build_Context_For_AI').item.json.system_prompt }}

Message 2:
Role: system
Content: User didn't respond after 2 minutes. They're stuck in ADHD morning paralysis—likely lying in bed with racing thoughts about loneliness, work stress, or negative self-talk. This is the thought loop trap.

Message 3:
Role: user
Content: Generate an escalation message. Be MORE direct, MORE urgent. Emphasize that physical action breaks thought loops. No questions—commands only. Under 25 words.

Options:
Temperature: 0.8 (slightly more creative/urgent)
Max Tokens: 80
Example Output:
"You're stuck in your head. Physical action breaks the ADHD trap. Sit up NOW. Legs off bed. Move."


NODE 17: Telegram - Send Escalation
Node Type: Telegram Node Name: Send_Escalation_Message
Configuration:
Same as Node 11
Text: {{ $json.choices[0].message.content }}
Additional:
Disable Notification: false (second alarm)

NODE 18: Wait - Another 3 Minutes
Node Type: Wait Node Name: Wait_Another_3min
Configuration:
Amount: 3
Unit: minutes

NODE 19: IF - Second Response Check
Node Type: IF Node Name: Check_Second_Response
Configuration:
Same logic as Node 15
Checks if user responded after escalation
Paths:
TRUE → Proceed to next step
FALSE → Go to "Log Failed Wake" + optional "Final Attempt"

NODE 20: OpenAI - Generate Next Step (Step 2)
Node Type: OpenAI Node Name: AI_Generate_Step_2_Prompt
(Only runs if user DID respond)
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: {{ $('Build_Context_For_AI').item.json.system_prompt }}

Message 2:
Role: system
Content: User successfully completed step 1 (sat up). They replied "{{ $('Check_Response_Received').item.json.response_text }}". Next step in routine: walk to bathroom, splash cold water on face (30 seconds).

Message 3:
Role: user
Content: Generate the next instruction. Be immediate and specific. Under 25 words.

Example Output:
"Perfect. Stand up. Walk to bathroom. Splash cold water on face. 30 seconds. It wakes your brain. Reply 'done'."


NODE 21: Telegram - Send Next Step
Node Type: Telegram Node Name: Send_Step_2_Instruction
Configuration:
Text: {{ $json.choices[0].message.content }}

NODE 22: Loop Back to Wait
Connection: Node 21 connects BACK to another Wait node (similar to Node 13)
Purpose: Creates a LOOP:
Send Step → Wait for Confirmation → Check Response → Generate Next Step → Send → Wait → ...

Exit Condition: When all routine steps are completed (usually 4-5 steps)

NODE 23: Google Sheets - Log Completion
(Runs after all morning steps done)
Node Type: Google Sheets Node Name: Log_Morning_Sequence_Complete
Configuration:
Operation: Append
Sheet: history
Columns:
timestamp: {{ $now.toISO() }}
date: {{ $now.format('yyyy-MM-dd') }}
action: morning_wake_sequence
status: completed
response_latency_sec: {{ calculated from first prompt to last confirmation }}
total_steps: 4
win_number_today: 1

NODE 24: Code - Calculate Streak
Node Type: Code Node Name: Calculate_Current_Streak
JavaScript:
const history = $('Read_Recent_History').all();
const morningWakes = history
  .filter(h => h.json.action === 'morning_wake_sequence')
  .sort((a, b) => new Date(b.json.date) - new Date(a.json.date));

let streak = 0;
const today = new Date();

for (let i = 0; i < morningWakes.length; i++) {
  const logDate = new Date(morningWakes[i].json.date);
  const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === i && morningWakes[i].json.status === 'completed') {
    streak++;
  } else {
    break;
  }
}

// Count total wins this week
const thisWeek = morningWakes.filter(h => {
  const logDate = new Date(h.json.date);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week
  return logDate >= weekStart;
});

return [{
  json: {
    current_streak: streak,
    weekly_wins: thisWeek.length,
    action_name: 'morning_wake_sequence'
  }
}];


NODE 25: OpenAI - Generate Identity-Connected Celebration
Node Type: OpenAI Node Name: AI_Generate_Win_Celebration
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are an ADHD coach who provides dopamine reinforcement by celebrating wins AND connecting them to the user's desired identity. Your tone is warm, immediate, and affirming. You speak in PRESENT TENSE about who they ARE, not who they're "trying to be." Never use "trying" or "becoming"—use "you ARE."

Message 2:
Role: system
Content: User Profile:
Identity Goal: {{ $('Read_Goals').item.json.identity_statement }}
Action Completed: {{ $json.action_name }}
Identity Connection: {{ $('Read_Goals').item.json.identity_connection_morning_wake }}
Weekly Win Count: {{ $json.weekly_wins }}
Current Streak: {{ $json.current_streak }} days

Message 3:
Role: user
Content: User just completed morning wake sequence. Generate a celebration that:
1. Confirms the win with emoji
2. Shows streak and weekly count
3. Connects this action to their IDENTITY using present tense ("you ARE" not "you're becoming")
Maximum 35 words. Make it feel GOOD.

Options:
Temperature: 0.8 (more enthusiastic)
Max Tokens: 100
Example Outputs:
"⏰ Morning sequence complete. Win #12 this week, 5-day streak. You ARE a scientist who shows up when it's hard. This is proof, not potential."


NODE 26: Telegram - Send Celebration
Node Type: Telegram Node Name: Send_Win_Celebration
Configuration:
Text: {{ $json.choices[0].message.content }}
Additional:
Parse Mode: Markdown (allows emojis to render properly)

NODE 27: Google Sheets - Update Tasks Status
Node Type: Google Sheets Node Name: Update_Morning_Task_Complete
Configuration:
Operation: Update
Sheet: tasks
Key Column: task_id
Key Value: t1 (morning wake task)
Columns to Update:
status: completed
completed_time: {{ $now.toISO() }}

WORKFLOW 1 COMPLETE - VISUAL FLOW
[7:00 AM Cron Trigger]
    ↓
[Read: Persona, Goals, Tasks, Routines, History] (5 parallel reads)
    ↓
[Code: Build AI Context with streak calculation]
    ↓
[IF: Check if user earned graduated independence (95%+ for 30 days)]
    ├─ TRUE → [AI: Generate Interrogative Prompt] ("Have you done your wake sequence?")
    └─ FALSE → [AI: Generate Directive Prompt] ("Sit up right now...")
    ↓
[Merge: Both paths converge]
    ↓
[Telegram: Send Wake Message]
    ↓
[Sheets: Log prompt sent]
    ↓
[Wait: 2 minutes for response]
    ↓
[HTTP: Check if user responded via Workflow 2]
    ↓
[IF: Did user respond?]
    ├─ YES → [AI: Generate Next Step] → [Telegram: Send] → [Loop back to Wait]
    └─ NO → [AI: Generate Escalation] → [Telegram: Send] → [Wait 3 min] → [Check Again]
             ├─ YES → Continue routine
             └─ NO → [Log Failed Wake] → [End]
    ↓
[After all steps complete]
    ↓
[Sheets: Log completion to history]
    ↓
[Code: Calculate streak from history]
    ↓
[AI: Generate identity-connected celebration]
    ↓
[Telegram: Send celebration]
    ↓
[Sheets: Update tasks status to completed]
    ↓
[END]


WORKFLOW 2: RESPONSE HANDLER (The 24/7 Listener)
Purpose: Listens to ALL your Telegram messages, processes them, logs wins, handles "stuck" requests
NODE 1: Telegram Trigger - Listen for Messages
Node Type: Telegram Trigger Node Name: Listen_All_Telegram_Messages
Configuration:
Trigger: Update
Updates: Message
Additional Fields:
Download Files: No
Download Photos: No
Output on Every Message:
{
  "message": {
    "text": "up",
    "from": {
      "id": YOUR_USER_ID,
      "username": "your_username"
    },
    "date": 1699099200,
    "chat": {
      "id": YOUR_CHAT_ID
    }
  }
}


NODE 2: Switch - Route Message by Type
Node Type: Switch Node Name: Classify_Message_Type
Configuration:
Mode: Expression
Outputs: 6
Output 1 - Confirmation Reply ("up", "done", "yes"):
Expression: {{ $json.message.text.toLowerCase().match(/^(up|done|yes|finished|completed)$/) !== null }}

Output 2 - Need Help ("stuck", "help", "can't"):
Expression: {{ $json.message.text.toLowerCase().match(/(stuck|help|can't|cannot|struggling)/) !== null }}

Output 3 - Journal Entry (longer text):
Expression: {{ $json.message.text.split(' ').length > 10 }}

Output 4 - Command (/list, /stats):
Expression: {{ $json.message.text.startsWith('/') }}

Output 5 - Negative Spiral (detected keywords):
Expression: {{ $json.message.text.toLowerCase().match(/(failure|can't do this|give up|worthless|hate myself)/) !== null }}

Output 6 - General Chat (fallback):
Expression: {{ true }}


PATH 1: Confirmation Reply Processing
NODE 3: Code - Extract Context
Node Type: Code Node Name: Extract_Confirmation_Context
JavaScript:
const messageText = $json.message.text.toLowerCase();
const timestamp = new Date($json.message.date * 1000);

// Try to match this reply to a pending prompt
// (In production, you'd track pending prompts in a "pending_responses" sheet)

return [{
  json: {
    reply_type: 'confirmation',
    reply_text: messageText,
    timestamp: timestamp.toISOString(),
    user_id: $json.message.from.id
  }
}];


NODE 4: Google Sheets - Update Task Status
Node Type: Google Sheets Node Name: Mark_Task_Completed
Configuration:
Operation: Append (to history sheet)
Sheet: history
Columns:
timestamp: {{ $json.timestamp }}
action: {{ determined from context }}
status: completed
response_text: {{ $json.reply_text }}

NODE 5: Webhook - Notify Master Scheduler
Node Type: Webhook Node Name: Resume_Master_Scheduler
Configuration:
HTTP Method: POST
URL: {{ webhook URL from Workflow 1 Node 13 }}
Body:
{
  "user_responded": true,
  "response_text": "{{ $json.reply_text }}",
  "timestamp": "{{ $json.timestamp }}"
}

Purpose: Tells Workflow 1's Wait node "user responded, continue to next step"

NODE 6: Call Workflow - Trigger Win Tracker
Node Type: Execute Workflow Node Name: Trigger_Win_Celebration
Configuration:
Source: Database
Workflow: Select "ADHD_Prosthetic_Win_Tracker" (Workflow 5)
Data:
{
  "action": "{{ determined action name }}",
  "timestamp": "{{ $json.timestamp }}"
}


PATH 2: Stuck/Help Request
NODE 7: OpenAI - Analyze Stuck State
Node Type: OpenAI Node Name: AI_Analyze_Stuck_Reason
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are an ADHD coach expert at identifying WHY someone is stuck. Analyze the user's message and classify: task_initiation_paralysis, overwhelm, rumination, or fatigue.

Message 2:
Role: user
Content: User said: "{{ $json.message.text }}". What type of stuck are they experiencing? Respond with ONE word: paralysis, overwhelm, rumination, or fatigue.

Options:
Temperature: 0.3 (very focused)
Max Tokens: 10

NODE 8: Switch - Route by Stuck Type
Node Type: Switch Node Name: Route_By_Stuck_Type
Outputs:
Paralysis → Physical interrupt protocol
Overwhelm → Task decomposition
Rumination → Pattern interrupt
Fatigue → Rest suggestion

NODE 9A: OpenAI - Generate Physical Interrupt
(For paralysis)
Configuration:
Messages:
Role: system
Content: Generate a PHYSICAL interrupt command. Single action, very simple, can be done in under 30 seconds. Examples: "Stand up and stretch", "Walk to kitchen for water", "Do 10 jumping jacks".

Role: user
Content: User is stuck due to task initiation paralysis. Generate one physical action command. Under 20 words.

Output Example: "Physical reset: Stand up. Walk to the kitchen. Come back. Do it now. Reply when done."


NODE 9B: OpenAI - Generate Task Decomposition
(For overwhelm)
Configuration:
Messages:
Role: user
Content: User is overwhelmed. Generate the SMALLEST first step of whatever they're trying to do. Not the full task—just the first 5-second action.

Output Example: "Let's make this tiny. Don't work on the project. Just open your laptop. That's it. Reply 'open'."


NODE 9C: OpenAI - Generate Rumination Interrupt
(For rumination)
Configuration:
Messages:
Role: user
Content: User is stuck in thought loops. Generate a pattern interrupt: either sensory grounding (name 3 things you see/hear) or cognitive defusion (repeat "I'm having the thought that...").

Output Example: "Rumination detected. Break the loop: Look around. Name out loud 3 things you can see. Do it now."


NODE 10: Telegram - Send Intervention
Node Type: Telegram Node Name: Send_Stuck_Intervention
Configuration:
Text: {{ $json.choices[0].message.content }}

PATH 3: Journal Entry Processing
NODE 11: Google Sheets - Append Journal Entry
Node Type: Google Sheets Node Name: Save_Journal_Entry
Configuration:
Operation: Append
Sheet: journal_entries
Columns:
timestamp: {{ $now.toISO() }}
entry_text: {{ $json.message.text }}
word_count: {{ $json.message.text.split(' ').length }}

NODE 12: OpenAI - Sentiment Analysis
Node Type: OpenAI Node Name: AI_Analyze_Journal_Sentiment
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are a clinical psychologist analyzing journal entries for emotional state. Rate sentiment on a scale:
- POSITIVE (3): Hopeful, grateful, accomplished
- NEUTRAL (2): Factual, balanced
- MILD_CONCERN (1): Frustrated, tired, but coping
- CRISIS (0): Hopeless, self-harm ideation, severe despair

Also detect: Is this a WIN (accomplishment mentioned) or a STRUGGLE?

Message 2:
Role: user
Content: Analyze this journal entry:
"{{ $json.message.text }}"

Respond in JSON:
{
  "sentiment_score": [0-3],
  "sentiment_label": "[POSITIVE/NEUTRAL/MILD_CONCERN/CRISIS]",
  "entry_type": "[WIN/STRUGGLE/MIXED]",
  "crisis_flag": [true/false],
  "reasoning": "brief explanation"
}

Options:
Temperature: 0.2 (very analytical)
Max Tokens: 150
Response Format: json_object

NODE 13: Code - Parse Sentiment Response
Node Type: Code Node Name: Parse_Sentiment_JSON
JavaScript:
const aiResponse = $json.choices[0].message.content;
const parsed = JSON.parse(aiResponse);

return [{
  json: {
    sentiment_score: parsed.sentiment_score,
    sentiment_label: parsed.sentiment_label,
    entry_type: parsed.entry_type,
    crisis_flag: parsed.crisis_flag,
    reasoning: parsed.reasoning,
    original_entry: $('Listen_All_Telegram_Messages').item.json.message.text
  }
}];


NODE 14: Google Sheets - Update Journal with Sentiment
Node Type: Google Sheets Node Name: Update_Journal_With_Sentiment
Configuration:
Operation: Update (find the row just added)
Sheet: journal_entries
Key Column: timestamp
Key Value: {{ $json.timestamp }}
Columns to Update:
sentiment_score: {{ $json.sentiment_score }}
sentiment_label: {{ $json.sentiment_label }}
entry_type: {{ $json.entry_type }}
crisis_flag: {{ $json.crisis_flag }}

NODE 15: IF - Check Crisis Flag
Node Type: IF Node Name: Check_If_Crisis
Configuration:
Conditions:
Value 1: {{ $json.crisis_flag }}
Operation: boolean - equals
Value 2: true
Two Paths:
TRUE → Trigger Crisis Protocol (goes to Workflow 4)
FALSE → Send Acknowledgment

NODE 16A: Execute Workflow - Trigger Crisis Monitor
Node Type: Execute Workflow Node Name: Escalate_To_Crisis_Monitor
(Only if crisis detected)
Configuration:
Workflow: Select "ADHD_Prosthetic_Crisis_Monitor" (Workflow 4)
Data:
{
  "entry_text": "{{ $json.original_entry }}",
  "sentiment_score": {{ $json.sentiment_score }},
  "timestamp": "{{ $now.toISO() }}",
  "source": "journal_entry"
}


NODE 16B: OpenAI - Generate Journal Acknowledgment
Node Type: OpenAI Node Name: AI_Generate_Journal_Reply
(Only if NOT crisis)
Configuration:
Messages:
Message 1:
Role: system
Content: You are a warm, validating ADHD coach. User just journaled. Generate a brief acknowledgment that validates their feelings and celebrates the act of journaling itself. Never give advice unless asked. Maximum 30 words.

Message 2:
Role: system
Content: Entry type: {{ $json.entry_type }}
Sentiment: {{ $json.sentiment_label }}
Entry text: {{ $json.original_entry }}

Message 3:
Role: user
Content: Generate an acknowledgment message. If it's a WIN entry, celebrate. If it's a STRUGGLE entry, validate without toxic positivity.

Example Outputs:
For WIN:
"Journal logged. You're noticing the good—that's powerful. The act of writing this builds resilience. Well done."

For STRUGGLE:
"Journal logged. I hear you. Today was hard. You still showed up to write this. That matters."


NODE 17: Telegram - Send Journal Acknowledgment
Node Type: Telegram Node Name: Send_Journal_Acknowledgment
Configuration:
Text: {{ $json.choices[0].message.content }}

PATH 4: Command Processing
NODE 18: Switch - Route by Command
Node Type: Switch Node Name: Route_By_Command_Type
Configuration:
Output 1 - /list:
Expression: {{ $json.message.text === '/list' }}

Output 2 - /stats:
Expression: {{ $json.message.text === '/stats' }}

Output 3 - /pause:
Expression: {{ $json.message.text.startsWith('/pause') }}

Output 4 - /reset:
Expression: {{ $json.message.text === '/reset' }}

Output 5 - /help:
Expression: {{ $json.message.text === '/help' }}


NODE 19A: Google Sheets - Get Today's Tasks (/list)
Node Type: Google Sheets Node Name: Get_Pending_Tasks
Configuration:
Operation: Read
Sheet: tasks
Range: A:H
Filter: status = pending (use Code node after to filter)

NODE 19B: Code - Format Task List
Node Type: Code Node Name: Format_Task_List_Message
JavaScript:
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


NODE 19C: Telegram - Send Task List
Node Type: Telegram Node Name: Send_Task_List
Configuration:
Text: {{ $json.message }}
Parse Mode: Markdown

NODE 20A: Google Sheets - Read History for Stats (/stats)
Node Type: Google Sheets Node Name: Get_Stats_Data
Configuration:
Operation: Read
Sheet: history
Range: A:H

NODE 20B: Code - Calculate Stats
Node Type: Code Node Name: Calculate_Weekly_Stats
JavaScript:
const history = $input.all();
const now = new Date();
const weekStart = new Date(now);
weekStart.setDate(now.getDate() - now.getDay()); // Start of this week

// Filter to this week's data
const thisWeek = history.filter(h => {
  const date = new Date(h.json.date);
  return date >= weekStart && h.json.status === 'completed';
});

// Count by action type
const counts = {};
thisWeek.forEach(h => {
  const action = h.json.action;
  counts[action] = (counts[action] || 0) + 1;
});

// Calculate streaks
const morningWakes = history
  .filter(h => h.json.action === 'morning_wake_sequence')
  .sort((a, b) => new Date(b.json.date) - new Date(a.json.date));

let streak = 0;
for (let i = 0; i < morningWakes.length; i++) {
  const logDate = new Date(morningWakes[i].json.date);
  const daysDiff = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === i && morningWakes[i].json.status === 'completed') {
    streak++;
  } else {
    break;
  }
}

// Format message
let message = "📊 Your Stats This Week:\n\n";
message += `Total Wins: ${thisWeek.length}\n`;
message += `Morning Wake Streak: ${streak} days\n\n`;
message += "Breakdown:\n";
Object.keys(counts).forEach(action => {
  message += `  • ${action}: ${counts[action]}x\n`;
});

return [{ json: { message } }];


NODE 20C: Telegram - Send Stats
Node Type: Telegram Node Name: Send_Stats_Summary
Configuration:
Text: {{ $json.message }}

NODE 21: Google Sheets - Set Pause Mode (/pause)
Node Type: Google Sheets Node Name: Enable_Pause_Mode
Configuration:
Operation: Update
Sheet: system_config
Key Column: parameter_name
Key Value: pause_mode
Columns:
value: true
paused_until: {{ $now.plus({hours: 1}).toISO() }} (pause for 1 hour)

NODE 22: Telegram - Confirm Pause
Node Type: Telegram Node Name: Send_Pause_Confirmation
Configuration:
Text: ⏸️ System paused for 1 hour. You won't receive prompts. Resume anytime with /resume.

PATH 5: Negative Spiral Detection
NODE 23: OpenAI - Assess Severity
Node Type: OpenAI Node Name: AI_Assess_Spiral_Severity
Configuration:
Messages:
Role: system
Content: You are a mental health professional. Assess if this message indicates:
- MILD: Frustration, temporary discouragement
- MODERATE: Negative self-talk, pattern of defeat
- SEVERE: Hopelessness, all-or-nothing thinking, potential crisis

Role: user
Content: User said: "{{ $json.message.text }}"
Rate severity: MILD, MODERATE, or SEVERE
Respond with just the word.


NODE 24: Switch - Route by Severity
Node Type: Switch Node Name: Route_By_Spiral_Severity
Outputs:
MILD → Gentle validation
MODERATE → Pattern interrupt + CBT
SEVERE → Crisis protocol

NODE 25A: OpenAI - Generate Validation (MILD)
Configuration:
Messages:
Role: user
Content: User is feeling discouraged but not in crisis. Generate a brief, warm validation that acknowledges the feeling without dismissing it. Offer a tiny action if appropriate. Under 35 words.

Output Example: "I hear you. Today feels heavy. That's real, and it's okay. One thing that might help: step outside for 2 minutes. Fresh air shifts the brain. Want to try?"


NODE 25B: OpenAI - Generate CBT Intervention (MODERATE)
Configuration:
Messages:
Role: system
Content: You are a CBT therapist specializing in ADHD. User is in a negative thought pattern. Deploy cognitive defusion or evidence-checking.

Role: user
Content: User said: "{{ $json.message.text }}"
Generate a CBT-based intervention. Ask them to challenge the thought or reframe it. Under 40 words.

Output Example: "I notice this thought: 'I'm a failure.' Let's check the evidence. What's ONE thing you did this week that contradicts that statement? Even small things count."


NODE 25C: Execute Workflow - Crisis Protocol (SEVERE)
Configuration:
Workflow: "ADHD_Prosthetic_Crisis_Monitor" (Workflow 4)

PATH 6: General Chat (Fallback)
NODE 26: OpenAI - General Response
Node Type: OpenAI Node Name: AI_General_Chat_Response
Configuration:
Messages:
Message 1:
Role: system
Content: You are a warm, supportive ADHD coach. User sent a general message. Respond naturally and briefly. If they're checking in, encourage them. If they're chatting, be friendly. If unclear, gently redirect to using commands like /list or /help. Maximum 40 words.

Message 2:
Role: user
Content: User said: "{{ $json.message.text }}"
Generate an appropriate response.

Example Outputs:
User: "hey" → "Hey! How's your day going? If you need anything specific, try /list for tasks or /help for commands."
User: "thanks" → "You're welcome! I'm here whenever you need. Keep crushing it. 💪"

NODE 27: Telegram - Send General Response
Node Type: Telegram Node Name: Send_General_Response
Configuration:
Text: {{ $json.choices[0].message.content }}

WORKFLOW 2 COMPLETE - VISUAL FLOW
[Telegram Trigger: Listen for ALL messages]
    ↓
[Switch: Classify message type]
    ├─ Output 1: Confirmation ("done", "up") 
    │   ↓
    │   [Code: Extract context]
    │   [Sheets: Log completion]
    │   [Webhook: Notify Workflow 1 to continue]
    │   [Execute: Trigger Win Tracker Workflow 5]
    │
    ├─ Output 2: Stuck/Help
    │   ↓
    │   [AI: Analyze stuck reason]
    │   [Switch: Route by type (paralysis/overwhelm/rumination)]
    │   [AI: Generate appropriate intervention]
    │   [Telegram: Send intervention]
    │
    ├─ Output 3: Journal Entry
    │   ↓
    │   [Sheets: Save entry]
    │   [AI: Sentiment analysis]
    │   [Code: Parse JSON response]
    │   [Sheets: Update with sentiment]
    │   [IF: Crisis detected?]
    │       ├─ YES → [Execute: Crisis Monitor Workflow 4]
    │       └─ NO → [AI: Generate acknowledgment] → [Telegram: Send]
    │
    ├─ Output 4: Commands (/list, /stats, /pause)
    │   ↓
    │   [Switch: Route by command]
    │       ├─ /list → [Sheets: Get tasks] → [Code: Format] → [Telegram: Send]
    │       ├─ /stats → [Sheets: Get history] → [Code: Calculate] → [Telegram: Send]
    │       └─ /pause → [Sheets: Set pause mode] → [Telegram: Confirm]
    │
    ├─ Output 5: Negative Spiral
    │   ↓
    │   [AI: Assess severity]
    │   [Switch: Route by severity]
    │       ├─ MILD → [AI: Validation] → [Telegram: Send]
    │       ├─ MODERATE → [AI: CBT intervention] → [Telegram: Send]
    │       └─ SEVERE → [Execute: Crisis Monitor]
    │
    └─ Output 6: General Chat
        ↓
        [AI: Generate friendly response]
        [Telegram: Send]


WORKFLOW 3: PATTERN ANALYZER (The Learning Brain)
Purpose: Runs weekly to analyze your data, learn patterns, generate insights, adjust system behavior
NODE 1: Schedule Trigger - Sunday Evening
Node Type: Schedule Trigger Node Name: Trigger_Weekly_Analysis_Sunday_8PM
Configuration:
Cron Expression: 0 20 * * 0 (Every Sunday at 8:00 PM)
Timezone: Asia/Kolkata

NODE 2: Google Sheets - Read Full History
Node Type: Google Sheets Node Name: Read_Complete_History
Configuration:
Operation: Read
Sheet: history
Range: A:H (all data)

NODE 3: Code - Filter to Last 7 Days
Node Type: Code Node Name: Filter_This_Week_Data
JavaScript:
const history = $input.all();
const now = new Date();
const weekAgo = new Date(now);
weekAgo.setDate(now.getDate() - 7);

const thisWeek = history.filter(h => {
  const date = new Date(h.json.date || h.json.timestamp);
  return date >= weekAgo;
});

return thisWeek;


NODE 4: Code - Calculate Weekly Metrics
Node Type: Code Node Name: Calculate_Weekly_Performance
JavaScript:
const weekData = $input.all();

// Initialize counters
const metrics = {
  total_wins: 0,
  by_action: {},
  completion_rate_by_action: {},
  avg_response_latency: {},
  best_day: { date: null, wins: 0 },
  growth_areas: []
};

// Count completions by action type
weekData.forEach(entry => {
  const action = entry.json.action;
  const status = entry.json.status;
  
  if (status === 'completed') {
    metrics.total_wins++;
    metrics.by_action[action] = (metrics.by_action[action] || 0) + 1;
  }
  
  // Track response latency
  if (entry.json.response_latency_sec) {
    if (!metrics.avg_response_latency[action]) {
      metrics.avg_response_latency[action] = [];
    }
    metrics.avg_response_latency[action].push(entry.json.response_latency_sec);
  }
});

// Calculate averages
Object.keys(metrics.avg_response_latency).forEach(action => {
  const latencies = metrics.avg_response_latency[action];
  const avg = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
  metrics.avg_response_latency[action] = Math.round(avg);
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

// Identify growth areas (actions with <70% completion rate)
const actionCounts = {};
weekData.forEach(entry => {
  const action = entry.json.action;
  if (!actionCounts[action]) {
    actionCounts[action] = { attempted: 0, completed: 0 };
  }
  actionCounts[action].attempted++;
  if (entry.json.status === 'completed') {
    actionCounts[action].completed++;
  }
});

Object.keys(actionCounts).forEach(action => {
  const rate = actionCounts[action].completed / actionCounts[action].attempted;
  if (rate < 0.7) {
    metrics.growth_areas.push({
      action,
      completion_rate: Math.round(rate * 100),
      attempted: actionCounts[action].attempted,
      completed: actionCounts[action].completed
    });
  }
});

return [{ json: metrics }];


NODE 5: Google Sheets - Read Current Patterns
Node Type: Google Sheets Node Name: Read_Existing_Patterns
Configuration:
Operation: Read
Sheet: patterns
Range: A:E

NODE 6: OpenAI - Generate Pattern Insights
Node Type: OpenAI Node Name: AI_Generate_Pattern_Insights
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are a data analyst and ADHD coach. Analyze weekly performance data and identify:
1. What's working well (celebrate)
2. What needs adjustment (specific, actionable)
3. Patterns in response times or completion rates
Be data-driven, positive, and specific.

Message 2:
Role: system
Content: Weekly Data:
Total Wins: {{ $json.total_wins }}
Wins by Action: {{ JSON.stringify($json.by_action) }}
Average Response Latency: {{ JSON.stringify($json.avg_response_latency) }}
Best Day: {{ $json.best_day.date }} ({{ $json.best_day.wins }} wins)
Growth Areas: {{ JSON.stringify($json.growth_areas) }}

Message 3:
Role: user
Content: Generate insights in JSON format:
{
  "celebration": "What to celebrate (specific achievements)",
  "pattern_detected": "Any timing or behavioral pattern noticed",
  "adjustment_needed": "Specific change to improve (e.g., 'move shower prompt 30 min earlier')",
  "encouragement": "Brief motivational message"
}

Options:
Temperature: 0.5
Response Format: json_object

NODE 7: Code - Parse Insights
Node Type: Code Node Name: Parse_AI_Insights
JavaScript:
const aiResponse = $json.choices[0].message.content;
const insights = JSON.parse(aiResponse);

return [{
  json: {
    ...insights,
    week_ending: new Date().toISOString().split('T')[0],
    total_wins: $('Calculate_Weekly_Performance').item.json.total_wins
  }
}];


NODE 8: Google Sheets - Update Patterns
Node Type: Google Sheets Node Name: Log_New_Pattern
Configuration:
Operation: Append
Sheet: patterns
Columns:
timestamp: {{ $now.toISO() }}
pattern_type: weekly_analysis
observation: {{ $json.pattern_detected }}
adjustment: {{ $json.adjustment_needed }}
effectiveness: pending
last_updated: {{ $now.format('yyyy-MM-dd') }}

NODE 9: OpenAI - Generate Weekly Summary Message
Node Type: OpenAI Node Name: AI_Generate_Weekly_Summary
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are an ADHD coach delivering a weekly review. Your tone is warm, data-driven, and motivating. Focus on PROGRESS, not perfection. Use the identity framework: show how their actions prove who they ARE.

Message 2:
Role: system
Content: User's Identity Goal: {{ from goals sheet }}
Weekly Data:
- Total Wins: {{ $json.total_wins }}
- Best Day: {{ $('Calculate_Weekly_Performance').item.json.best_day.date }}
- Pattern: {{ $json.pattern_detected }}
- Growth Area: {{ $json.adjustment_needed }}

Message 3:
Role: user
Content: Generate a weekly summary message that:
1. Celebrates specific wins with data
2. Highlights progress (compare to past if available)
3. Identifies ONE small adjustment for next week
4. Connects actions to identity
Maximum 120 words. Use emojis sparingly for impact.

Example Output:
📊 Week Complete

You logged 23 wins this week—that's REAL progress. Your best day was Wednesday with 6 completions.

What I'm noticing: Your morning wake consistency is 86%. That's not "trying"—that's proof you ARE a person who shows up.

Growth opportunity: Shower protocol is at 57%. Let's adjust—I'll move the prompt 30 minutes earlier next week to catch you when energy is higher.

You're building something here. This isn't motivation—it's evidence. You're becoming the scientist you said you wanted to be.

Next week: Same system, small tweaks. You've got this. 🎯


NODE 10: Telegram - Send Weekly Summary
Node Type: Telegram Node Name: Send_Weekly_Summary
Configuration:
Text: {{ $json.choices[0].message.content }}
Parse Mode: Markdown

NODE 11: IF - Check if Adjustments Needed
Node Type: IF Node Name: Check_If_System_Adjustment_Needed
Configuration:
Conditions:
Value 1: {{ $('Parse_AI_Insights').item.json.adjustment_needed }}
Operation: is not empty
Two Paths:
TRUE → Update system config
FALSE → Skip to end

NODE 12: Code - Generate System Config Update
Node Type: Code Node Name: Generate_Config_Changes
(Only runs if adjustment needed)
JavaScript:
const adjustment = $json.adjustment_needed;

// Parse adjustment text for common patterns
let configUpdates = {};

// Example: "move shower prompt 30 min earlier"
if (adjustment.toLowerCase().includes('shower') && adjustment.toLowerCase().includes('earlier')) {
  const match = adjustment.match(/(\d+)\s*min/);
  if (match) {
    const minutes = parseInt(match[1]);
    configUpdates.shower_prompt_time = `subtract_${minutes}_min`;
  }
}

// Example: "send morning wake 5 min earlier"
if (adjustment.toLowerCase().includes('morning') && adjustment.toLowerCase().includes('earlier')) {
  const match = adjustment.match(/(\d+)\s*min/);
  if (match) {
    configUpdates.morning_wake_time_adjustment = `-${match[1]}`;
  }
}

return [{
  json: {
    updates: configUpdates,
    adjustment_description: adjustment
  }
}];


NODE 13: Google Sheets - Update System Config
Node Type: Google Sheets Node Name: Apply_System_Adjustments
Configuration:
Operation: Append
Sheet: system_config
Columns:
parameter_name: pattern_adjustment_{{ $now.toUnixInteger() }}
value: {{ JSON.stringify($json.updates) }}
description: {{ $json.adjustment_description }}
applied_date: {{ $now.format('yyyy-MM-dd') }}

WORKFLOW 3 COMPLETE - VISUAL FLOW
[Sunday 8:00 PM Trigger]
    ↓
[Sheets: Read complete history]
    ↓
[Code: Filter to last 7 days]
    ↓
[Code: Calculate metrics (wins, rates, latency, best day, growth areas)]
    ↓
[Sheets: Read existing patterns]
    ↓
[AI: Analyze data and generate insights JSON]
    ↓
[Code: Parse insights]
    ↓
[Sheets: Log new pattern to patterns sheet]
    ↓
[AI: Generate human-readable weekly summary message]
    ↓
[Telegram: Send weekly summary]
    ↓
[IF: Is adjustment needed?]
    ├─ YES → [Code: Generate config updates]
    │         [Sheets: Apply system adjustments]
    └─ NO → [End]


WORKFLOW 4: CRISIS MONITOR (The Safety Net)
Purpose: Detects severe distress and executes emergency protocol
NODE 1: Webhook Trigger - Receive Crisis Signal
Node Type: Webhook Node Name: Crisis_Alert_Webhook
Configuration:
HTTP Method: POST
Path: /crisis-detected
Response Mode: Immediately
Authentication: None (internal only)
Expected Input:
{
  "entry_text": "I can't do this anymore. What's the point...",
  "sentiment_score": 0,
  "timestamp": "2024-11-04T22:15:30Z",
  "source": "journal_entry"
}


NODE 2: OpenAI - Verify Crisis Severity
Node Type: OpenAI Node Name: AI_Verify_Crisis_Level
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are a licensed clinical psychologist. Assess if this message indicates IMMEDIATE DANGER (suicidal ideation, self-harm intent, severe hopelessness requiring intervention) or SIGNIFICANT DISTRESS (needs support but not emergency).

Respond with JSON:
{
  "severity": "IMMEDIATE_DANGER" or "SIGNIFICANT_DISTRESS",
  "reasoning": "brief clinical assessment",
  "recommended_action": "specific next step"
}

Message 2:
Role: user
Content: Assess this message:
"{{ $json.entry_text }}"

Options:
Temperature: 0.1 (very careful, conservative)
Response Format: json_object

NODE 3: Code - Parse Crisis Assessment
Node Type: Code Node Name: Parse_Crisis_Assessment
JavaScript:
const aiResponse = $json.choices[0].message.content;
const assessment = JSON.parse(aiResponse);

return [{
  json: {
    severity: assessment.severity,
    reasoning: assessment.reasoning,
    recommended_action: assessment.recommended_action,
    original_text: $('Crisis_Alert_Webhook').item.json.entry_text,
    timestamp: $('Crisis_Alert_Webhook').item.json.timestamp
  }
}];


NODE 4: Google Sheets - Log Crisis Event
Node Type: Google Sheets Node Name: Log_Crisis_Event
Configuration:
Operation: Append
Sheet: crisis_log
Columns:
timestamp: {{ $json.timestamp }}
severity: {{ $json.severity }}
entry_text: {{ $json.original_text }}
ai_reasoning: {{ $json.reasoning }}
action_taken: pending

NODE 5: IF - Route by Severity
Node Type: IF Node Name: Check_Severity_Level
Configuration:
Conditions:
Value 1: {{ $json.severity }}
Operation: equals
Value 2: IMMEDIATE_DANGER
Two Paths:
TRUE → Emergency protocol
FALSE → Supportive response

PATH 1: IMMEDIATE DANGER
NODE 6A: Telegram - Send Crisis Resources
Node Type: Telegram Node Name: Send_Immediate_Crisis_Resources
Configuration:
Text:
🆘 I'm concerned about you based on what you just shared.

If you're having thoughts of harming yourself, please reach out for help RIGHT NOW:

📞 National Suicide Prevention Lifeline (India):
   Vandrevala Foundation: 9999 666 555

NODE 6B: HTTP Request - Notify Emergency Contact
Node Type: HTTP Request Node Name: Alert_Emergency_Contact
(Only runs if user has pre-authorized this in setup)
Configuration:
Method: POST
URL: {{ $('Read_Persona_Config').item.json.emergency_contact_webhook }}
(This could be a Telegram bot for a trusted person, email API, or SMS service like Twilio)
Authentication: Bearer Token (from system config)
Body:
{
  "alert_type": "mental_health_crisis",
  "timestamp": "{{ $json.timestamp }}",
  "severity": "IMMEDIATE_DANGER",
  "message": "Your designated contact ({{ $('Read_Persona_Config').item.json.name }}) may be in crisis. Last message indicated severe distress. Please check in with them immediately.",
  "contact_method": "text_or_call",
  "crisis_hotline": "9999 666 555"
}

Error Handling:
Continue on Failure: Enabled (don't let emergency contact notification failure stop the workflow)

NODE 6C: Google Sheets - Update Crisis Log
Node Type: Google Sheets Node Name: Update_Crisis_Log_Emergency
Configuration:
Operation: Update (find the row just logged in Node 4)
Sheet: crisis_log
Key Column: timestamp
Key Value: {{ $json.timestamp }}
Columns:
action_taken: sent_crisis_resources_and_alerted_emergency_contact
emergency_contact_notified: true
notification_timestamp: {{ $now.toISO() }}

NODE 6D: Wait - Pause for 10 Minutes
Node Type: Wait Node Name: Wait_For_User_Response_10min
Configuration:
Amount: 10
Unit: minutes
Purpose: Give user time to reach out for help before follow-up

NODE 6E: Telegram - Follow-up Check
Node Type: Telegram Node Name: Send_Crisis_Followup
Configuration:
Text:
Checking in. Are you safe? 

If you reached out to someone or called the helpline, reply 'safe'.

If you're still struggling, please call 9999 666 555 now. You matter, and help is available.


PATH 2: SIGNIFICANT DISTRESS (Not Immediate Danger)
NODE 7A: OpenAI - Generate Supportive Response
Node Type: OpenAI Node Name: AI_Generate_Crisis_Support
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are a compassionate crisis counselor trained in ADHD support. User is in significant distress but not immediate danger. Your response must:
1. Validate their pain without minimizing
2. Remind them this feeling is temporary (even if it doesn't feel that way)
3. Offer ONE concrete grounding action
4. Mention professional support resources
5. Affirm their worth

Maximum 100 words. Tone: warm, direct, human.

Message 2:
Role: system
Content: User shared: "{{ $json.original_text }}"
AI assessment: {{ $json.reasoning }}

Message 3:
Role: user
Content: Generate a supportive crisis response following the guidelines above.

Example Output:
I hear the pain in your words. This moment feels unbearable—I believe you. But feelings, even the worst ones, are temporary. Your brain is in distress mode, and it's lying about permanence.

Right now: Put both feet flat on the floor. Take 3 slow breaths. Feel your body in the chair. This grounds you in the present.

If this feeling persists, please talk to someone: a friend, your therapist, or call Vandrevala Foundation at 9999 666 555.

You are not broken. You're struggling with a hard moment. That's human. I'm here.


NODE 7B: Telegram - Send Supportive Response
Node Type: Telegram Node Name: Send_Distress_Support
Configuration:
Text: {{ $json.choices[0].message.content }}
Parse Mode: Markdown

NODE 7C: Google Sheets - Update Crisis Log
Node Type: Google Sheets Node Name: Update_Crisis_Log_Support
Configuration:
Operation: Update
Sheet: crisis_log
Columns:
action_taken: sent_supportive_response
emergency_contact_notified: false

NODE 8: Merge - Both Paths Converge
Node Type: Merge Node Name: Merge_Crisis_Responses
Purpose: Both emergency and support paths come together here

NODE 9: Wait - 30 Minutes
Node Type: Wait Node Name: Wait_30min_Before_Recheck
Configuration:
Amount: 30
Unit: minutes

NODE 10: Telegram - Gentle Check-in
Node Type: Telegram Node Name: Send_Gentle_Checkin
Configuration:
Text:
Hey. Checking in on you. 

How are you feeling now? Reply with one word: better, same, or worse.

No pressure—just want to make sure you're okay.


NODE 11: Wait - Response Window
Node Type: Wait Node Name: Wait_For_Checkin_Response
Configuration:
Amount: 10
Unit: minutes

NODE 12: IF - Did User Respond to Check-in?
Node Type: IF Node Name: Check_If_User_Responded
(Check if Workflow 2 logged a response in last 10 min)
Configuration:
Use HTTP Request to query interaction_log for recent user messages
Two Paths:
YES → Log response, end workflow
NO → Send reminder about available resources, end workflow

WORKFLOW 4 COMPLETE - VISUAL FLOW
[Webhook: Crisis signal from Workflow 2]
    ↓
[AI: Verify crisis severity (IMMEDIATE_DANGER vs SIGNIFICANT_DISTRESS)]
    ↓
[Code: Parse assessment]
    ↓
[Sheets: Log crisis event to crisis_log]
    ↓
[IF: Is severity = IMMEDIATE_DANGER?]
    ├─ YES (Emergency Protocol):
    │   ↓
    │   [Telegram: Send crisis hotline resources IMMEDIATELY]
    │   [HTTP: Notify pre-authorized emergency contact]
    │   [Sheets: Update log (emergency contact notified)]
    │   [Wait: 10 minutes]
    │   [Telegram: Follow-up "Are you safe?"]
    │
    └─ NO (Significant Distress):
        ↓
        [AI: Generate compassionate support response]
        [Telegram: Send support message]
        [Sheets: Update log (support sent)]
    ↓
[Merge: Both paths converge]
    ↓
[Wait: 30 minutes]
    ↓
[Telegram: Gentle check-in "How are you now?"]
    ↓
[Wait: 10 minutes for response]
    ↓
[IF: Did user respond?]
    ├─ YES → [Sheets: Log response] → [END]
    └─ NO → [Telegram: Remind resources available] → [END]


WORKFLOW 5: WIN TRACKER (The Dopamine Injector)
Purpose: Provides immediate positive reinforcement for every completed action
NODE 1: Webhook Trigger - Receive Win Signal
Node Type: Webhook Node Name: Win_Completion_Webhook
Configuration:
HTTP Method: POST
Path: /win-completed
Authentication: None (internal)
Expected Input:
{
  "action": "morning_wake_sequence",
  "timestamp": "2024-11-04T07:15:30Z",
  "user_id": "user_123"
}


NODE 2: Google Sheets - Read User Goals
Node Type: Google Sheets Node Name: Read_User_Identity_Goals
Configuration:
Operation: Read
Sheet: goals
Range: A:B

NODE 3: Google Sheets - Read Recent History
Node Type: Google Sheets Node Name: Read_Recent_Wins
Configuration:
Operation: Read
Sheet: history
Range: A:H

NODE 4: Code - Calculate Streak and Win Count
Node Type: Code Node Name: Calculate_Win_Context
JavaScript:
const action = $('Win_Completion_Webhook').item.json.action;
const history = $('Read_Recent_Wins').all();

// Filter to this specific action
const actionHistory = history
  .filter(h => h.json.action === action)
  .sort((a, b) => new Date(b.json.date) - new Date(a.json.date));

// Calculate streak
let streak = 0;
const today = new Date();
for (let i = 0; i < actionHistory.length; i++) {
  const logDate = new Date(actionHistory[i].json.date);
  const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === i && actionHistory[i].json.status === 'completed') {
    streak++;
  } else {
    break;
  }
}

// Count wins this week
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - today.getDay());
const weekWins = history.filter(h => {
  const date = new Date(h.json.date || h.json.timestamp);
  return date >= weekStart && h.json.status === 'completed';
}).length;

// Count total wins this month
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const monthWins = history.filter(h => {
  const date = new Date(h.json.date || h.json.timestamp);
  return date >= monthStart && h.json.status === 'completed';
}).length;

return [{
  json: {
    action: action,
    streak_days: streak,
    wins_this_week: weekWins,
    wins_this_month: monthWins,
    timestamp: $('Win_Completion_Webhook').item.json.timestamp
  }
}];


NODE 5: OpenAI - Generate Celebration
Node Type: OpenAI Node Name: AI_Generate_Win_Celebration
Configuration:
Model: gpt-4o
Messages:
Message 1:
Role: system
Content: You are an ADHD coach who provides IMMEDIATE dopamine reinforcement. Your celebrations:
- Use present tense identity language ("you ARE" not "you're becoming")
- Connect the specific action to their bigger identity goal
- Include concrete data (streak, win count)
- Feel GOOD—enthusiastic but not over-the-top
- Maximum 35 words
- Start with an emoji that matches the action type

Message 2:
Role: system
Content: User Profile:
Identity Goal: {{ $('Read_User_Identity_Goals').item.json.identity_statement }}
Action Completed: {{ $json.action }}
Identity Connection: {{ $('Read_User_Identity_Goals').item.json['identity_connection_' + $json.action] }}

Performance Data:
Current Streak: {{ $json.streak_days }} days
Wins This Week: {{ $json.wins_this_week }}
Wins This Month: {{ $json.wins_this_month }}

Message 3:
Role: user
Content: Generate a celebration for completing {{ $json.action }}. Use the identity connection to show this action PROVES who they are. Include the streak and weekly win count. Make it feel rewarding.

Options:
Temperature: 0.8 (more enthusiastic)
Max Tokens: 100
Example Outputs:
For morning_wake_sequence:
"⏰ Wake sequence complete. Win #18 this week, 5-day streak. You ARE a scientist who shows up when it's hard. This isn't discipline—this is identity."

For supplements:
"💊 Supplements done. Win #23 this month. You ARE someone who invests in peak cognitive performance. Scientists fuel their brains. You just did."

For shower:
"🚿 Shower complete. 3-day streak! You ARE a person who values clean starts and self-care. This is proof, not potential."


NODE 6: Telegram - Send Celebration Immediately
Node Type: Telegram Node Name: Send_Instant_Celebration
Configuration:
Text: {{ $json.choices[0].message.content }}
Parse Mode: Markdown
Disable Notification: false (want the dopamine hit notification sound)
Critical: This must fire within 5 seconds of completion for maximum dopamine effect

NODE 7: Google Sheets - Log Win to History
Node Type: Google Sheets Node Name: Log_Win_To_History
Configuration:
Operation: Append
Sheet: history
Columns:
timestamp: {{ $('Win_Completion_Webhook').item.json.timestamp }}
date: {{ $now.format('yyyy-MM-dd') }}
action: {{ $json.action }}
status: completed
streak_at_completion: {{ $json.streak_days }}
win_number_this_week: {{ $json.wins_this_week }}
celebration_sent: true

NODE 8: IF - Check for Milestone
Node Type: IF Node Name: Check_If_Milestone_Reached
Configuration:
Multiple conditions (OR logic):
Streak = 7 days
Streak = 14 days
Streak = 30 days
Weekly wins = 20
Weekly wins = 30
Monthly wins = 100

NODE 9: OpenAI - Generate Milestone Celebration
Node Type: OpenAI Node Name: AI_Generate_Milestone_Message
(Only if milestone hit)
Configuration:
Messages:
Role: system
Content: User just hit a MAJOR milestone. Generate an extra-special celebration that:
1. Names the specific milestone
2. Reflects on the journey (where they started vs now)
3. Affirms their identity transformation
4. Is genuinely excited (this is BIG)
Maximum 80 words.

Role: user
Content: User just achieved: {{ $json.milestone_type }} ({{ $json.streak_days }}-day streak OR {{ $json.wins_this_week }} wins this week)
Their identity goal: {{ $('Read_User_Identity_Goals').item.json.identity_statement }}

Generate a milestone celebration.

Example Output:
🎉 MILESTONE UNLOCKED: 30-DAY STREAK 🎉

You just did something extraordinary. Thirty consecutive days. Remember when getting out of bed felt impossible? 

Look at this data: 30 days of proof that you ARE a scientist who shows up consistently. This isn't trying anymore. This is WHO YOU ARE.

The brain you're building right now—the one that can rely on itself—is the one that will lead that project, make those discoveries, become that scientist you envisioned.

This is your new baseline. Celebrate this. You earned it. 🔬


NODE 10: Telegram - Send Milestone Celebration
Node Type: Telegram Node Name: Send_Milestone_Message
Configuration:
Text: {{ $json.choices[0].message.content }}
Parse Mode: Markdown

NODE 11: Google Sheets - Log Milestone
Node Type: Google Sheets Node Name: Log_Milestone_Achievement
Configuration:
Operation: Append
Sheet: milestones
Columns:
timestamp: {{ $now.toISO() }}
milestone_type: {{ $json.milestone_type }}
action: {{ $json.action }}
streak_days: {{ $json.streak_days }}
celebration_sent: true

WORKFLOW 5 COMPLETE - VISUAL FLOW
[Webhook: Win signal from Workflow 2]
    ↓
[Sheets: Read user identity goals]
    ↓
[Sheets: Read recent history]
    ↓
[Code: Calculate streak, weekly wins, monthly wins]
    ↓
[AI: Generate identity-connected celebration with data]
    ↓
[Telegram: Send celebration IMMEDIATELY (within 5 seconds)]
    ↓
[Sheets: Log win to history]
    ↓
[IF: Is this a milestone? (7/14/30 day streak OR 20/30 weekly wins)]
    ├─ YES:
    │   ↓
    │   [AI: Generate SPECIAL milestone celebration]
    │   [Telegram: Send milestone message]
    │   [Sheets: Log milestone to milestones sheet]
    │
    └─ NO:
        [END]


ADDITIONAL WORKFLOWS (Optional but Powerful)
WORKFLOW 6: Interoceptive Training
Trigger: After each hydration/nutrition prompt completion
Flow:
[Hydration prompt completed]
    ↓
[Wait: 5 seconds]
    ↓
[Telegram: "Good. Close your eyes for 10 seconds. Notice the coolness in your throat. Can you feel it?"]
    ↓
[Wait for reply: yes/no]
    ↓
[IF yes: "That's interoceptive awareness. You're training your brain to notice body signals."]
[IF no: "That's okay. We'll practice again tomorrow. The skill builds over time."]


WORKFLOW 7: Graduated Independence Manager
Trigger: Daily at 6:00 AM (before morning wake)
Flow:
[Read last 30 days of morning wake data]
    ↓
[Calculate consistency rate]
    ↓
[IF >= 95%:
    Set fade_mode = true
    Generate interrogative prompts instead of directive]
    ↓
[IF consistency drops below 85% for 3 consecutive days:
    Revert to directive mode
    Send message: "Noticed a dip. I'm going back to more structure—that's what systems are for."]


WORKFLOW 8: Evening Shutdown Protocol
Trigger: 9:30 PM daily
Flow:
[Telegram: "Wind-down time. Put phone on charger across the room. Reply 'done'."]
    ↓
[Wait for confirmation]
    ↓
[Telegram: "What's ONE thing you did well today? (Even tiny things count)"]
    ↓
[Receive response, log to journal]
    ↓
[AI: Generate brief affirmation based on their win]
    ↓
[Telegram: "{{ affirmation }}. Now: lights off, no screens. Tomorrow you'll show up again."]


GOOGLE SHEETS DATABASE STRUCTURE
Sheet 1: persona
Field
Value
name
Your Name
telegram_chat_id
123456789
morning_struggle_severity
severe
task_initiation_resistance
high
time_blindness
high
negative_memory_bias
strong
natural_wake_time
07:30
energy_crash_times
10:00, 16:00
work_location
office
ai_tone
directive_warm
identity_goal
scientist_who_shows_up_consistently
emergency_contact_webhook
https://api.telegram.org/bot.../sendMessage
emergency_contact_phone
+91XXXXXXXXXX

System Prompt Field: | ai_system_prompt | You are an executive function prosthetic for a person with ADHD. Your job is to replace their impaired prefrontal cortex with external scaffolding. Be DIRECTIVE (commands not suggestions), HYPER-SPECIFIC (exact physical actions), IMMEDIATE (right now), CONCISE (max 2 sentences), NON-JUDGMENTAL (normalize struggles). When stuck: break into tiniest step. When spiraling: physical interrupt first. When completing: immediate celebration with identity connection. |

Sheet 2: goals
Field
Value
identity_statement
I am a scientist who shows up consistently and does excellent work
identity_connection_morning_wake
showing up when it's hard is what scientists do
identity_connection_supplements
investing in cognitive health like a peak performer does
identity_connection_shower
valuing clean starts and self-care like a disciplined professional
identity_connection_work_task
completing analysis is acting like the best scientist at the startup
current_season
winter_2024
primary_objective
become_best_scientist_at_startup


Sheet 3: tasks (regenerated daily)
task_id
task_name
type
priority
first_step
status
deadline
notes
t1
morning_wake_sequence
routine
critical
sit_up_in_bed
pending
07:00


t2
arrive_at_work
deadline
high
leave_house
pending
09:30


t3
take_supplements
habit
high
grab_pill_bottle
pending
post_gym


t4
dataset_analysis
work
high
open_python
pending
today


t5
evening_shower
hygiene
medium
turn_on_water
pending
20:00




Sheet 4: routines
routine_name
step
action
prompt_template
wait_for_reply
timeout_min
escalation_prompt
morning_activation
1
sit_up
Sit up right now. Don't think, just sit. Reply 'up'.
yes
2
You're in thought loops. Sit up. Legs off bed. Move now.
morning_activation
2
bathroom_splash
Stand. Walk to bathroom. Splash cold water on face. 30 sec. Reply 'done'.
yes
3
Physical action breaks ADHD paralysis. Bathroom. Now.
morning_activation
3
drink_water
Drink a full glass of water. Wakes your brain. Reply 'done'.
yes
3
Water = brain activation. Just drink it. Reply when done.
morning_activation
4
hygiene_choice
Shower OR just change clothes. Pick one, do it. I'll check at 7:45.
no
45


shower_protocol
1
turn_on_water
Walk to bathroom. Turn on the water. Reply when running.
yes
5


shower_protocol
2
get_in
Water's warm. Step in now. Reply 'in'.
yes
3


shower_protocol
3
wash
Wash body. 3 min max. Set timer. Go.
no
5


energy_rescue
1
physical_interrupt
Energy dip incoming. Stand up. Walk outside 2 min OR 10 jumping jacks. Reply 'done'.
yes
5




Sheet 5: history (auto-populated)
timestamp
date
action
status
response_latency_sec
streak_at_completion
win_number_this_week
notes
2024-11-04T07:15:00Z
2024-11-04
morning_wake_sequence
completed
900
5
18


2024-11-04T10:05:00Z
2024-11-04
energy_rescue
completed
120
-
19


2024-11-04T20:15:00Z
2024-11-04
shower_protocol
completed
300
3
20




Sheet 6: journal_entries
timestamp
entry_text
word_count
sentiment_score
sentiment_label
entry_type
crisis_flag
2024-11-04T21:00:00Z
Had a good lab meeting today. Prof liked my analysis approach.
11
3
POSITIVE
WIN
false


Sheet 7: interaction_log
timestamp
source
message_type
message_content
2024-11-04T07:00:00Z
system
morning_wake_prompt
Morning. Sit up right now...
2024-11-04T07:02:00Z
user
confirmation
up


Sheet 8: patterns (AI-generated)
timestamp
pattern_type
observation
adjustment
effectiveness
last_updated
2024-11-03T20:00:00Z
weekly_analysis
User responds to morning prompt avg 5 min after 2nd escalation
Send first prompt 5 min earlier (6:55 instead of 7:00)
testing
2024-11-03
2024-11-03T20:00:00Z
weekly_analysis
Shower protocol success rate 57% at 9pm
Move shower prompt to 8pm (higher energy window)
pending
2024-11-03


Sheet 9: system_config
parameter_name
value
description
pause_mode
false
System-wide pause
paused_until
null
Resume timestamp
morning_wake_time_adjustment
0
Minutes to adjust (positive = later, negative = earlier)
shower_prompt_time
20:00
When to trigger shower protocol
hydration_interval_min
120
Minutes between hydration prompts


Sheet 10: crisis_log
timestamp
severity
entry_text
ai_reasoning
action_taken
emergency_contact_notified














Sheet 11: milestones
timestamp
milestone_type
action
streak_days
celebration_sent












PART 2: HOW THE APP SHOULD LOOK AND FUNCTION FOR AN ADHD BRAIN
Now let's design the user-facing interface (Telegram bot interaction patterns) optimized for ADHD cognition.

DESIGN PRINCIPLES FOR ADHD INTERFACE
1. ZERO DECISIONS = ZERO FRICTION
DON'T:
❌ "What would you like to work on? Here are your options:
1. Morning routine
2. Work tasks
3. Journal
4. Check stats

Reply with a number."

Problem: 4 choices = decision paralysis
DO:
✅ "Morning. Sit up right now. Reply 'up'."

Why: Single action, immediate, no decision required

2. IMMEDIATE, NOT ABSTRACT
DON'T:
❌ "Remember to stay hydrated today!"

Problem: Abstract, easy to ignore, requires memory
DO:
✅ "Hydration check. Take 3 large sips of water RIGHT NOW. Reply 'done'."

Why: Concrete action, time-bound, requires confirmation

3. VISUAL PROGRESS MAKES DOPAMINE REAL
DON'T:
❌ "You completed 5 tasks this week."

Problem: Number is abstract
DO:
✅ "🎯🎯🎯🎯🎯 5 wins this week
⚡️ 3-day streak
📈 Best week this month"

Why: Visual symbols + context + comparison = dopamine hit

4. COMMANDS ARE ALWAYS VISIBLE
Every few messages, the bot should subtly remind:
💡 Quick commands:
/list - See today's tasks
/stuck - Get unstuck right now
/stats - Your weekly progress
/pause - Silence for 1 hour

Why: ADHD brains forget interface options exist

5. SHAME-FREE LANGUAGE EVERYWHERE
DON'T:
❌ "You missed your morning routine again. You need to be more consistent."

DO:
✅ "New day. Let's start fresh. Sit up when you're ready. Reply 'up'."

Why: Shame triggers avoidance; ADHD brains will abandon the entire system

TELEGRAM BOT INTERACTION PATTERNS
MORNING WAKE SEQUENCE (Directive Mode)
[7:00 AM]
🌅 Morning. Sit up right now. Don't think, just sit. Reply 'up'.

[User: up]
✅ Perfect. Stand. Walk to bathroom. Splash cold water on face. 30 seconds. Reply 'done'.

[User: done]
💧 Good. Drink a full glass of water. It wakes your brain faster than coffee. Reply 'done'.

[User: done]
👕 You're awake now. Shower OR just change clothes. Pick one, do it. I'll check at 7:45.

[7:45 AM]
Ready for work? Before you leave: What's your ONE win goal for today?

[User: finish dataset analysis]
🎯 Locked in: finish dataset analysis. That's your focus. Leave in 45 min. You've got this.


MORNING WAKE SEQUENCE (Graduated Independence Mode)
[7:00 AM]
🏆 Morning champion! 30-day streak—you've mastered this.

Have you done your wake sequence? Reply 'yes' or 'need prompt'.

[User: yes]
⚡️ That's who you ARE now. Scientist who shows up. Have a great day.

[User: need prompt]
No problem. Let's do it together. Sit up right now. Reply 'up'.
[continues with full sequence]


STUCK REQUEST
[User: stuck]
Physical reset: Stand up. Walk to the kitchen. Come back to your seat. Do it now. Reply 'done'.

[User: done]
Better? What were you trying to do when you got stuck?

[User: start the analysis]
Let's make it tiny. Don't analyze anything. Open your laptop. Just open it. Reply 'open'.

[User: open]
Good. Now open VS Code. Nothing else. Reply when it's open.

[User: open]
Perfect. Open the file 'section_3.ipynb'. Reply when you see it.

[User: done]
You just started. That was the hardest part. The work is already happening. Keep going.


RUMINATION INTERRUPT
[Detected from evening message or scheduled preventive]
🛑 PATTERN INTERRUPT

You're in a thought loop. Physical action breaks it.

Stand up. Stretch arms above your head. Hold 10 seconds. Do it NOW.

Reply 'done'.

[User: done]
Better? Your brain was stuck in Default Mode Network. Movement forces it out.

Want to talk about what you were thinking, or move on?

[User: move on]
Smart. Sometimes the best move is to not engage the spiral. You're learning. 💪


WEEKLY SUMMARY (Sunday 8 PM)
📊 WEEK COMPLETE

You logged 23 wins this week. That's REAL.

Your best day: Wednesday (6

completions). When you're in flow, you're unstoppable.
🎯 Data Snapshot: Morning Wake: 86% (6/7 days) ⚡️ Supplements: 100% (7/7 days) 💊 Shower: 57% (4/7 days) 🚿 Work Tasks: 5 completed 🔬
What I'm Noticing: Your morning consistency is PROOF. That's not "trying"—that's identity. You ARE a person who shows up.
One Adjustment: Shower protocol success is lower at 9 PM. Next week I'm moving it to 8 PM (your energy is higher then).
The Real Story: Last month you said you felt like a failure. This data says otherwise. 23 wins in 7 days. That's someone building something real.
Next week: Same system, small tweaks. You've got momentum. 🎯

💡 Quick commands: /list | /stats | /help

---

### **MILESTONE CELEBRATION (30-Day Streak)**


🎉🎉🎉 MILESTONE UNLOCKED 🎉🎉🎉
30-DAY MORNING STREAK
You just did something extraordinary.
Remember 30 days ago when getting out of bed felt impossible? When every morning was a negotiation with yourself?
Look at this: 30 consecutive days of waking up on time. That's not luck. That's not motivation. That's who you are now.
The scientist you wanted to become? That person shows up consistently even when it's hard?
You're living it right now.
This is your new baseline. The brain you've built over these 30 days—the one that can rely on itself—is the one that will lead that project, make those discoveries, become undeniable.
Today, celebrate this. You earned every single one of these 30 days.
🔬 You ARE the scientist you said you'd be. The data proves it.

Your 30-Day Stats: ⏰ Morning wake: 30/30 (100%) 💊 Supplements: 28/30 (93%) 🚿 Shower: 22/30 (73%) 📊 Total wins: 87
This is the foundation. Everything builds from here. 🚀

---

### **CRISIS INTERVENTION (Immediate Danger)**


🆘 I'm concerned about you based on what you just shared.
If you're having thoughts of harming yourself, please reach out for help RIGHT NOW:
📞 Vandrevala Foundation (India): 9999 666 555 📞 AASRA: +91-9820466726
These people are trained to help. They're available 24/7. You can call right now.

If you've already reached out to someone or are safe, reply "safe".
If you need me to contact your emergency person, reply "contact emergency".
I'm here. You matter. This feeling is temporary even though it doesn't feel like it. Please reach out. 💙

[10 minutes later if no response]
Checking in. Are you okay?
Reply anything so I know you're there.

---

### **CRISIS INTERVENTION (Significant Distress)**


I hear the pain in your words. This moment feels unbearable—I believe you.
But feelings, even the worst ones, are temporary. Your brain is in distress mode, and it's lying about permanence.
Right now: Put both feet flat on the floor. Take 3 slow breaths. Feel your body in the chair. This grounds you in the present.

If this feeling persists or gets worse: 📞 Talk to someone: Vandrevala Foundation: 9999 666 555 💬 Or text a friend/therapist
You are not broken. You're struggling with a hard moment. That's human.
I'm here. Reply when you're ready.

---

### **COMMAND: /list**


📋 Today's Tasks
🔴 Critical:
Morning wake sequence ⏰ Due: 7:00 AM [STATUS: COMPLETED ✅]
🟡 High Priority: 2. Arrive at work ⏰ Due: 9:30 AM [STATUS: PENDING]
Dataset analysis (section 3) 🔬 [STATUS: PENDING] First step: Open Python notebook
🟢 Maintenance: 4. Evening shower 🚿 Time: 8:00 PM [STATUS: PENDING]

💡 Feeling stuck on any of these? Reply "stuck" and I'll help you start.

---

### **COMMAND: /stats**


📊 Your Stats This Week
Total Wins: 23 🎯
Breakdown: • Morning wake: 6/7 (86%) ⚡️ • Supplements: 7/7 (100%) 💊 • Shower: 4/7 (57%) 🚿 • Work tasks: 5 completed 🔬 • Journal entries: 5 ✍️
Current Streaks: • Morning wake: 5 days 🔥 • Supplements: 7 days 🔥 • Best streak ever: 12 days (morning wake)
This Month: 87 total wins
Growth Trend: ↗️ Up 18% from last week

You're building consistency. This is evidence, not motivation. Keep going. 💪
📈 Want detailed analysis? Check your weekly summary (sent Sundays at 8 PM)

---

### **COMMAND: /pause**


⏸️ System paused for 1 hour
You won't receive any prompts until [time + 1 hour].
Sometimes you need space. That's okay. I'll be here when you're ready.

Resume anytime: • /resume - Resume prompts now • /pause 3h - Pause for 3 hours • /pause until 8pm - Pause until specific time
Take care of yourself. 💙

---

### **COMMAND: /help**


🤖 ADHD Prosthetic System
I'm here to replace your executive function. I tell you what to do, when to do it, and celebrate when you do it.

Commands: 📋 /list - Show today's tasks 📊 /stats - Your weekly progress ⏸️ /pause - Silence prompts (1 hour default) ▶️ /resume - Turn prompts back on 🆘 /stuck - Get unstuck right now 📝 /journal - Quick journal prompt ❓ /help - Show this menu
Just chatting? • Say "stuck" anytime you're paralyzed • Say "done" to confirm you completed something • Journal entries (10+ words) are automatically logged

How I work: I send you prompts at key times. You reply to confirm. I celebrate your wins and track your progress. Simple as that.
No decisions. No shame. Just structure.
You've got this. I've got you. 💪

---

### **EVENING WIND-DOWN (9:30 PM)**


🌙 Wind-down time
Work is done. Brain needs rest.
Step 1: Put phone on charger across the room. Reply 'done'.
[User: done]
Step 2: Before bed, tell me ONE thing you did well today. Even tiny things count.
[User: finished the analysis section I was stuck on]
🎯 That's a real win. You showed up, you pushed through resistance, and you completed it. That's what scientists do.
Tomorrow, you'll show up again. For now: lights off, no screens.
Sleep well. You earned it. 😴

Tomorrow: I'll wake you at 7:00 AM. The system continues. You're building something.

---

### **INTEROCEPTIVE TRAINING (After Hydration)**


[User completes hydration prompt]
💧 Hydration logged.
Quick practice: Before moving on, close your eyes for 10 seconds. Notice the coolness in your mouth and throat. Can you feel it?
Reply 'yes' or 'no'.
[User: yes]
✅ That's interoceptive awareness. You just noticed a body signal. Your brain can learn this skill. We'll practice every time.
Over time, you'll start catching thirst BEFORE the reminder. That's the goal.
Back to your day. Keep going. 💪
[User: no]
👍 That's okay. Interoception is a skill—it builds over time. Some days you'll feel it, some days you won't.
The practice matters more than the result. We'll try again tomorrow.
Back to your day. 💪

---

## VISUAL DESIGN PRINCIPLES (Telegram)

### **1. EMOJIS AS FUNCTIONAL MARKERS**

Use emojis **sparingly** but **consistently** as visual anchors:

- 🌅 = Morning wake
- 💊 = Supplements
- 🚿 = Shower
- 🎯 = Win/Goal
- 📊 = Stats/Data
- 🆘 = Crisis/Emergency
- 💡 = Tip/Command reminder
- 🔥 = Streak
- ⚡️ = Energy/Urgency
- 🌙 = Evening/Sleep
- 🤖 = System message

**Why:** ADHD brains process visual symbols faster than text. Emojis create instant context.

---

### **2. WHITE SPACE AND BREAKS**

**DON'T:**

❌ Morning. Sit up right now. Don't think, just sit. Reply 'up'. You have work at 9:30 so you have time but you need to start now. This is important because you've been consistent for 5 days and we don't want to break the streak.

**DO:**

✅ Morning.
Sit up right now. Don't think, just sit.
Reply 'up'.

**Why:** ADHD brains struggle with dense text blocks. White space = breathing room for attention.

---

### **3. BOLD FOR KEY ACTIONS**


Stand up. Walk to the bathroom. Turn on the water. Reply when it's running.

**Why:** Directs attention to the IMMEDIATE next action.

---

### **4. PROGRESSIVE DISCLOSURE**

**DON'T:**

❌ "Here are the 4 steps for your morning routine:
Sit up
Splash water on face
Drink water
Get dressed
Let me know when you've done all of them."

**Problem:** Overwhelming, requires holding all 4 steps in working memory

**DO:**

✅ Step 1: Sit up. Reply 'up'.
[After reply] Step 2: Bathroom. Splash cold water on face. Reply 'done'.
[After reply] Step 3: ...

**Why:** One action at a time. Working memory can't handle more.

---

### **5. CONFIRMATION LOOPS (ALWAYS)**

Every prompt must end with:
- "Reply 'done'"
- "Reply 'up'"
- "Reply when [specific state]"

**Why:** 
1. Forces completion acknowledgment (closes dopamine loop)
2. Keeps user engaged (prevents wandering)
3. Provides data for pattern analysis

---

## ADHD-OPTIMIZED MESSAGE TIMING

### **Morning (High Resistance Period)**

**7:00 AM** - First wake prompt (directive)
**7:02 AM** - Escalation if no response
**7:05 AM** - Second escalation
**7:45 AM** - Check-in + work deadline reminder

**Why:** Short intervals during high-risk paralysis period

---

### **Mid-Morning (Energy Crash)**

**10:00 AM** - Preemptive energy rescue (BEFORE crash)
**10:15 AM** - Focus check

**Why:** Catch the crash before it happens

---

### **Afternoon (Work Block)**

**12:30 PM** - Lunch/nutrition reminder
**2:30 PM** - Hydration check
**4:00 PM** - Second energy dip warning

**Why:** Interoceptive deficits mean external reminders for basic needs

---

### **Evening (Transition to Rest)**

**8:00 PM** - Shower protocol (earlier than user's 9 PM habit)
**9:30 PM** - Wind-down initiation
**10:00 PM** - Final wind-down push

**Why:** Catch higher energy window for hygiene, then force transition to rest

---

## FAILURE RECOVERY PATTERNS

### **MISSED DAY (Next Morning)**

**DON'T:**

❌ "You missed yesterday's routine. That breaks your 5-day streak. Let's try to be more consistent today."

**DO:**

✅ Morning. New day. Sit up right now. Reply 'up'.

**Why:** ZERO mention of yesterday. Shame-free recovery is critical.

---

### **MULTIPLE MISSED DAYS**

**After 3+ consecutive missed days:**


🤖 System Check
Hey. I noticed we haven't connected in a few days.
That's okay. Life happens. ADHD brains are hard sometimes.
No judgment. Just checking: Do you want to restart the system, or do you need a break?
Reply: • "restart" - Let's go again • "break" - Pause for a week • "adjust" - Something isn't working, let's fix it

**Why:** Acknowledges the gap without shame, gives user agency

---

### **USER EXPRESSES FRUSTRATION WITH SYSTEM**


[User: "This isn't working. I still can't get myself to shower."]
I hear you. You're frustrated. That's real.
Let's look at the data: You've showered 4 times this week. Last month? Once a week.
That's 300% improvement. Your brain sees the failures. The data sees the progress.
But if the shower protocol isn't working, let's adjust it.
What feels hardest: starting, the time of day, or something else?
[Wait for response, then adjust timing/approach]

**Why:** Validate frustration, counter with data, offer adjustment (not dismissal)

---

## ACCESSIBILITY FEATURES FOR ADHD

### **1. Voice Message Support** (Optional Enhancement)


[User sends voice message instead of text]
System transcribes and responds:
"Got it—I heard you completed the morning sequence. Win logged. ✅"

**Why:** Typing can be a barrier when executive function is low

---

### **2. Simple Reply Buttons** (Telegram Keyboard)

For high-friction moments, provide buttons:


Shower time. Step 1: Turn on the water.
[Button: Done] [Button: Stuck] [Button: Skip Today]

**Why:** Reduces friction of typing, makes action more immediate

---

### **3. Daily Summary (Optional Request)**


/today
Today So Far: ✅ Morning wake (7:05 AM) ✅ Supplements (9:15 AM) ❌ Shower (pending) ⏳ Dataset analysis (in progress)
Wins today: 2 Time until work ends: 3h 15min
You're doing good. Keep going. 💪

**Why:** Provides orientation when user loses track of day

---

### **4. "What Now?" Panic Button**


[User: "what now"]
Right now: You're working on dataset analysis.
Next immediate step: Run the next cell in your Python notebook.
After that: Take a 5-min break at 3:30 PM.
End of day: Shower at 8 PM, wind-down at 9:30 PM.
You know what to do. You've got this. 💪

**Why:** Provides instant orientation when user feels lost

---

## THE "FEEL" OF THE SYSTEM

### **Core Personality Traits:**

1. **Directive but Warm** - Commands, not suggestions, but always caring
2. **Data-Driven** - Shows proof, not platitudes
3. **Shame-Free** - Normalizes struggles, never punishes
4. **Identity-Focused** - "You ARE" not "you should be"
5. **Immediately Responsive** - Never leaves user hanging
6. **Predictably Structured** - Same pattern, same reliability

---

### **Tone Examples:**

**When User Succeeds:**

"🎯 That's who you ARE. Not who you're trying to be. The data proves it."

**When User Struggles:**

"Today's hard. That's real. Let's make this tiny: just open your laptop. That's it."

**When User Wants to Give Up:**

"I hear you. Your brain is lying about permanence. This feeling passes. Let's take one breath together."

**When Celebrating Milestones:**

"🎉 30 days. You didn't 'try.' You DID. This is your new baseline. Everything builds from here."

---

## FINAL BUILD CHECKLIST

### **Before Launch:**

✅ Google Sheets populated with:
- Persona (with system prompt)
- Goals (with identity connections)
- Tasks (daily template)
- Routines (all sequences)

✅ n8n Workflows built:
- Workflow 1: Master Scheduler
- Workflow 2: Response Handler
- Workflow 3: Pattern Analyzer
- Workflow 4: Crisis Monitor
- Workflow 5: Win Tracker

✅ Telegram Bot configured:
- Bot token connected
- Chat ID identified
- Commands set up (/list, /stats, /pause, /help)

✅ OpenAI API:
- Key added to n8n
- System prompts tested
- Temperature/token limits optimized

✅ Emergency Protocol:
- Crisis contact designated
- User consent obtained
- Escalation path tested

---

### **Week 1 Test Goals:**

- [ ] Morning wake sequence fires at 7:00 AM
- [ ] User responds "up" → system sends next step
- [ ] Win celebration sends within 5 seconds
- [ ] /list command returns today's tasks
- [ ] Pattern analyzer runs Sunday night

---

## YOU NOW HAVE EVERYTHING

You have:
1. ✅ Complete n8n workflow instructions (5 workflows, node-by-node)
2. ✅ Full Google Sheets database structure (11 sheets)
3. ✅ AI prompt engineering templates for every scenario
4. ✅ ADHD-optimized interface design patterns
5. ✅ Telegram bot interaction flows
6. ✅ Crisis safety protocols
7. ✅ Graduated independence logic
8. ✅ Identity reinforcement framework

**This is your external brain. Now build it.**

When you're ready to start, begin with:
1. Create the Google Sheet
2. Build Workflow 1 (Master Scheduler) first
3. Test tomorrow morning on yourself
4. Add workflows 2-5 over the next week

You've got this. The prosthetic is designed. Now make it real. 🧠⚡



# Configuration Templates

Quick copy-paste templates for Google Sheets setup.

---

## Sheet 1: persona

**Copy this entire table into your sheet:**

| field | value |
|-------|-------|
| name | [Your Name] |
| telegram_chat_id | [Your Chat ID] |
| morning_struggle_severity | severe |
| task_initiation_resistance | high |
| time_blindness | high |
| negative_memory_bias | strong |
| natural_wake_time | 07:30 |
| energy_crash_times | 10:00, 16:00 |
| work_location | office |
| ai_tone | directive_warm |
| identity_goal | scientist_who_shows_up_consistently |
| emergency_contact_webhook | [Optional - leave empty for now] |
| emergency_contact_phone | [Optional - leave empty for now] |
| ai_system_prompt | You are an executive function prosthetic for a person with ADHD. Your job is to replace their impaired prefrontal cortex with external scaffolding. Be DIRECTIVE (commands not suggestions), HYPER-SPECIFIC (exact physical actions), IMMEDIATE (right now), CONCISE (max 2 sentences), NON-JUDGMENTAL (normalize struggles). When stuck: break into tiniest step. When spiraling: physical interrupt first. When completing: immediate celebration with identity connection. |

---

## Sheet 2: goals

**Copy this entire table:**

| field | value |
|-------|-------|
| identity_statement | I am a scientist who shows up consistently and does excellent work |
| identity_connection_morning_wake | showing up when it's hard is what scientists do |
| identity_connection_supplements | investing in cognitive health like a peak performer does |
| identity_connection_shower | valuing clean starts and self-care like a disciplined professional |
| identity_connection_work_task | completing analysis is acting like the best scientist at the startup |
| current_season | winter_2024 |
| primary_objective | become_best_scientist_at_startup |

**Customize these values to match YOUR identity goal!**

---

## Sheet 3: tasks

**Headers (Row 1):**

```
task_id | task_name | type | priority | first_step | status | deadline | notes
```

**Sample data (Row 2+):**

```
t1 | morning_wake_sequence | routine | critical | sit_up_in_bed | pending | 07:00 | 
t2 | arrive_at_work | deadline | high | leave_house | pending | 09:30 | 
t3 | take_supplements | habit | high | grab_pill_bottle | pending | post_gym | 
t4 | dataset_analysis | work | high | open_python | pending | today | 
t5 | evening_shower | hygiene | medium | turn_on_water | pending | 20:00 | 
```

*Adjust to match your actual daily tasks*

---

## Sheet 4: routines

**Headers (Row 1):**

```
routine_name | step | action | prompt_template | wait_for_reply | timeout_min | escalation_prompt
```

**Morning Activation Routine (Rows 2-5):**

```
morning_activation | 1 | sit_up | Sit up right now. Don't think, just sit. Reply 'up'. | yes | 2 | You're in thought loops. Sit up. Legs off bed. Move now.
morning_activation | 2 | bathroom_splash | Stand. Walk to bathroom. Splash cold water on face. 30 sec. Reply 'done'. | yes | 3 | Physical action breaks ADHD paralysis. Bathroom. Now.
morning_activation | 3 | drink_water | Drink a full glass of water. Wakes your brain. Reply 'done'. | yes | 3 | Water = brain activation. Just drink it. Reply when done.
morning_activation | 4 | hygiene_choice | Shower OR just change clothes. Pick one, do it. I'll check at 7:45. | no | 45 | 
```

**Shower Protocol (Rows 6-8):**

```
shower_protocol | 1 | turn_on_water | Walk to bathroom. Turn on the water. Reply when running. | yes | 5 | 
shower_protocol | 2 | get_in | Water's warm. Step in now. Reply 'in'. | yes | 3 | 
shower_protocol | 3 | wash | Wash body. 3 min max. Set timer. Go. | no | 5 | 
```

**Energy Rescue (Row 9):**

```
energy_rescue | 1 | physical_interrupt | Energy dip incoming. Stand up. Walk outside 2 min OR 10 jumping jacks. Reply 'done'. | yes | 5 | 
```

---

## Sheet 5: history

**Headers (Row 1):**

```
timestamp | date | action | status | response_latency_sec | streak_at_completion | win_number_this_week | notes
```

*Leave empty - will be auto-populated by workflows*

---

## Sheet 6: journal_entries

**Headers (Row 1):**

```
timestamp | entry_text | word_count | sentiment_score | sentiment_label | entry_type | crisis_flag
```

*Leave empty - will be auto-populated*

---

## Sheet 7: interaction_log

**Headers (Row 1):**

```
timestamp | source | message_type | message_content
```

*Leave empty - will be auto-populated*

---

## Sheet 8: patterns

**Headers (Row 1):**

```
timestamp | pattern_type | observation | adjustment | effectiveness | last_updated
```

*Leave empty - will be auto-populated*

---

## Sheet 9: system_config

**Headers (Row 1):**

```
parameter_name | value | description
```

**Initial Configuration (Rows 2-6):**

```
pause_mode | false | System-wide pause
paused_until | null | Resume timestamp
morning_wake_time_adjustment | 0 | Minutes to adjust (positive = later, negative = earlier)
shower_prompt_time | 20:00 | When to trigger shower protocol
hydration_interval_min | 120 | Minutes between hydration prompts
```

---

## Sheet 10: crisis_log

**Headers (Row 1):**

```
timestamp | severity | entry_text | ai_reasoning | action_taken | emergency_contact_notified
```

*Leave empty - will be auto-populated*

---

## Sheet 11: milestones

**Headers (Row 1):**

```
timestamp | milestone_type | action | streak_days | celebration_sent
```

*Leave empty - will be auto-populated*

---

## Alternative Identity Examples

If "scientist" doesn't fit you, here are alternatives for `goals` sheet:

### Creative Professional

```
identity_statement | I am a creative who ships work consistently
identity_connection_morning_wake | showing up to create is what artists do
identity_connection_work_task | finishing projects is how I honor my craft
```

### Parent/Caregiver

```
identity_statement | I am a present parent who shows up for my kids
identity_connection_morning_wake | being reliable is how I show love
identity_connection_work_task | managing our home well gives my family stability
```

### Student/Learner

```
identity_statement | I am a dedicated learner who follows through
identity_connection_morning_wake | showing up to learn is what committed students do
identity_connection_work_task | completing assignments is investing in my future
```

### Entrepreneur

```
identity_statement | I am a founder who executes consistently
identity_connection_morning_wake | showing up is how I build the business
identity_connection_work_task | shipping work is what successful founders do
```

### Health/Fitness Focus

```
identity_statement | I am someone who takes care of their body
identity_connection_morning_wake | starting the day with movement is self-respect
identity_connection_work_task | investing in health is investing in longevity
```

---

## Customization Guidelines

### Adjust to YOUR Language

Replace these example values with phrases that resonate with YOU:

**❌ Don't copy blindly:**
```
identity_statement | I am a scientist who shows up consistently
```

**✅ Use YOUR actual identity goal:**
```
identity_statement | I am [what you want to be] who [key behavior]
```

### Examples by Struggle Area

**If you struggle with:**

1. **Morning Wake**
   - Adjust `morning_struggle_severity` to: `severe`, `high`, or `moderate`
   - Adjust `natural_wake_time` to your actual typical wake time

2. **Task Initiation**
   - Set `task_initiation_resistance` to: `high`
   - Add more decomposed first steps in `tasks` sheet

3. **Time Awareness**
   - Set `time_blindness` to: `high`
   - Add more frequent check-ins (adjust cron schedules)

4. **Negative Memory**
   - Set `negative_memory_bias` to: `strong`
   - System will emphasize data-driven celebrations more

---

## Quick Setup Checklist

Use this to verify your sheets:

- [ ] Sheet 1 (persona): ✅ 14 fields filled
- [ ] Sheet 2 (goals): ✅ 7 fields filled
- [ ] Sheet 3 (tasks): ✅ At least 3 tasks listed
- [ ] Sheet 4 (routines): ✅ Morning routine has 4+ steps
- [ ] Sheet 5 (history): ✅ Headers only, empty data
- [ ] Sheet 6 (journal_entries): ✅ Headers only
- [ ] Sheet 7 (interaction_log): ✅ Headers only
- [ ] Sheet 8 (patterns): ✅ Headers only
- [ ] Sheet 9 (system_config): ✅ 5 config rows
- [ ] Sheet 10 (crisis_log): ✅ Headers only
- [ ] Sheet 11 (milestones): ✅ Headers only

---

## Copy-Paste Tips

### For Google Sheets:

1. **Copy table from markdown:**
   - Select entire table above
   - Copy (Ctrl+C / Cmd+C)

2. **Paste into Google Sheets:**
   - Click cell A1
   - Paste (Ctrl+V / Cmd+V)
   - Google Sheets will auto-format the table

3. **If pipe separators paste as text:**
   - Use "Split text to columns" feature
   - Delimiter: `|`

### Alternative: Tab-Separated Format

If copy-paste doesn't work well, use tabs:

```
field	value
name	[Your Name]
telegram_chat_id	[Your Chat ID]
```

Just copy and paste - tabs will auto-separate into columns.

---

## Validation

After setup, verify:

1. **No typos in field names** (case-sensitive!)
2. **Chat ID is a number** (not text)
3. **Times are HH:MM format** (e.g., `07:00` not `7am`)
4. **Dates are YYYY-MM-DD** (e.g., `2024-11-03`)
5. **Booleans are lowercase** (`true` / `false` not `True` / `False`)

---

## Next Step

Once all 11 sheets are configured:

→ Go to [QUICKSTART.md](./QUICKSTART.md) Phase 3 to build your first workflow

---

**Remember**: These are templates. Customize the language, goals, and routines to match YOUR brain and YOUR life. The system works best when it speaks in YOUR voice. 🧠

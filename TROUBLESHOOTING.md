# Troubleshooting Guide - ADHD Prosthetic System

Quick solutions to common issues.

---

## General Debugging

### Check Workflow Execution History

1. Open n8n workflow
2. Click **Executions** tab (left sidebar)
3. View recent runs (green = success, red = error)
4. Click any execution to see detailed logs

### Test Individual Nodes

1. Select node in canvas
2. Click **Execute Node** (top menu)
3. Check output data in right panel
4. Verify expected format

---

## Telegram Issues

### Bot Not Responding to Messages

**Symptom:** You send `/list` but bot doesn't reply

**Solutions:**

1. **Check Response Handler is Active**
   - Open `ADHD_Prosthetic_Response_Handler` workflow
   - Verify Active toggle is ON (top-right)
   
2. **Verify Telegram Trigger Node**
   - Check trigger type is `Update`
   - Updates set to `Message`
   - Credential is valid

3. **Test Bot Token**
   - Visit: `https://api.telegram.org/bot<TOKEN>/getMe`
   - Should return bot info (not error)
   
4. **Check Chat ID**
   - Compare chat ID in Google Sheet vs actual
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Find your chat in response

### Bot Sends Duplicate Messages

**Symptom:** Receive 2+ identical messages

**Cause:** Multiple workflows with same trigger

**Solution:**
- Check for duplicate workflows
- Deactivate test/backup workflows
- Keep only ONE Response Handler active

### Wrong Chat ID

**Symptom:** Bot works but messages go to wrong person

**Solution:**
1. Send message to YOUR bot
2. Get YOUR chat ID: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Update `persona` sheet → `telegram_chat_id`

---

## Google Sheets Issues

### Can't Read Sheet Data

**Symptom:** Node fails with "No data" or auth error

**Solutions:**

1. **Re-authorize OAuth2**
   - n8n → Credentials → Google Sheets OAuth2
   - Click **Reconnect**
   - Complete OAuth flow

2. **Check Sheet Name (Case Sensitive)**
   ```
   ✅ ADHD_Prosthetic_Brain
   ❌ adhd_prosthetic_brain
   ❌ ADHD Prosthetic Brain (no underscores)
   ```

3. **Verify Range Includes Headers**
   ```
   ✅ A1:B50 (includes row 1)
   ❌ A2:B50 (skips headers)
   ```

4. **Check Sheet Tab Name**
   - Tab must be exactly: `persona`, `goals`, `tasks`, etc.
   - No extra spaces
   - Case sensitive

### Can't Write to Sheet

**Symptom:** Append/Update operations fail

**Solutions:**

1. **Check Write Permission**
   - OAuth2 scope includes write access
   - Re-authorize if needed

2. **Verify Column Names Match**
   - Node column settings must match sheet headers exactly
   - Example: `timestamp` not `Timestamp`

3. **Test with Simple Data**
   - Try appending just one column
   - If works, add columns one by one to find issue

### Data Format Errors

**Symptom:** Dates or numbers don't save correctly

**Solutions:**

1. **Use ISO Format for Dates**
   ```javascript
   // ✅ Correct
   timestamp: new Date().toISOString()
   // ❌ Wrong
   timestamp: new Date()
   ```

2. **Parse JSON Strings**
   ```javascript
   // If data is string, parse it
   const data = JSON.parse($json.choices[0].message.content)
   ```

---

## OpenAI API Issues

### Rate Limit Errors

**Symptom:** "Rate limit exceeded" error

**Solutions:**

1. **Check API Usage**
   - Go to: https://platform.openai.com/usage
   - Verify not over quota

2. **Add Retry Logic** (in Code node before AI)
   ```javascript
   // Wait 1 second before calling AI
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

3. **Reduce Token Usage**
   - Lower `Max Tokens` setting (try 50-100)
   - Shorten system prompts
   - Use `gpt-3.5-turbo` for non-critical tasks

### Invalid API Key

**Symptom:** "Incorrect API key provided"

**Solutions:**

1. **Verify Key Format**
   - Should start with `sk-`
   - No extra spaces
   - Complete key copied

2. **Check Key Status**
   - Go to: https://platform.openai.com/api-keys
   - Verify key is active (not revoked)

3. **Regenerate Key**
   - Create new key
   - Update n8n credential
   - Delete old key

### Model Not Found

**Symptom:** "Model gpt-4o not found"

**Solutions:**

1. **Verify Model Access**
   - Check your OpenAI account tier
   - GPT-4 requires payment setup

2. **Use Available Model**
   - Try: `gpt-4` (standard)
   - Or: `gpt-3.5-turbo` (cheaper, faster)

3. **Check Model Name**
   ```
   ✅ gpt-4o
   ✅ gpt-4
   ✅ gpt-3.5-turbo
   ❌ gpt4
   ❌ GPT-4
   ```

### JSON Response Parsing Error

**Symptom:** Code node fails to parse AI response

**Solution:**

1. **Add Response Format**
   - In OpenAI node, set:
   - Response Format: `json_object`

2. **Wrap Parse in Try-Catch**
   ```javascript
   try {
     const data = JSON.parse($json.choices[0].message.content);
     return [{ json: data }];
   } catch (error) {
     console.error('Parse error:', error);
     return [{ json: { error: 'Failed to parse AI response' } }];
   }
   ```

---

## Workflow Timing Issues

### Cron Not Triggering

**Symptom:** Scheduled workflow doesn't run at expected time

**Solutions:**

1. **Verify Cron Expression**
   ```
   ✅ 0 7 * * * (7:00 AM daily)
   ✅ 0 20 * * 0 (8:00 PM Sundays)
   ❌ 7 0 * * * (wrong order)
   ```
   
   Test cron: https://crontab.guru/

2. **Check Timezone**
   - Verify timezone matches your location
   - Example: `Asia/Kolkata`, `America/New_York`

3. **Ensure Workflow is Active**
   - Active toggle must be ON
   - Check executions tab for history

4. **Test Manually**
   - Click "Execute Workflow"
   - If works manually but not on schedule, check n8n server time

### Wrong Time Zone

**Symptom:** Triggers 5 hours early/late

**Solution:**
1. Check server timezone vs your timezone
2. Update cron trigger timezone setting
3. Or adjust cron hour to compensate

---

## Data Issues

### Streak Calculation Wrong

**Symptom:** Says 5-day streak but you know it's 3

**Solutions:**

1. **Check History Sheet Date Format**
   - Dates must be consistent: `2024-11-03`
   - Not mixed: `11/3/24` or `Nov 3`

2. **Verify Status Values**
   ```
   ✅ completed
   ❌ Complete (capital C)
   ❌ done (wrong value)
   ```

3. **Test Calculation Code**
   ```javascript
   // Debug: Log dates being compared
   console.log('Checking date:', logDate, 'vs today:', today);
   ```

### History Not Logging

**Symptom:** History sheet stays empty after confirmations

**Solutions:**

1. **Check Append Node**
   - Verify it's connected in workflow
   - Check column names match sheet headers

2. **Test Response Handler Path**
   - Send `done` to bot
   - Check execution logs
   - Follow path from trigger to append

3. **Verify Sheet Name**
   - Must be exactly: `history` (lowercase)

---

## Crisis Detection Issues

### False Positive Crisis Alerts

**Symptom:** Normal messages trigger crisis response

**Solutions:**

1. **Adjust Detection Threshold**
   - In Switch node, modify negative keywords
   - Make pattern more specific:
   ```javascript
   // More specific
   {{ $json.message.text.toLowerCase().match(/(want to die|kill myself|end it all)/) !== null }}
   ```

2. **Add Sentiment Check**
   - Use sentiment score < 1 (not just keywords)
   - Require BOTH keyword AND low sentiment

### Crisis Not Detecting

**Symptom:** Severe messages don't trigger protocol

**Solutions:**

1. **Check Switch Order**
   - Crisis detection should be Output 5 (before general chat)
   - Reorder if needed

2. **Verify Workflow Connection**
   - Crisis Monitor workflow must be Active
   - Webhook URL correct in Response Handler

3. **Test Crisis Flow**
   - Use test phrase: "I feel worthless"
   - Check execution logs
   - Verify it routes to crisis path

---

## Performance Issues

### Slow Response Times

**Symptom:** Bot takes 10+ seconds to reply

**Solutions:**

1. **Check OpenAI Response Time**
   - High token limits = slower
   - Reduce Max Tokens to 50-100

2. **Simplify Workflow**
   - Remove unnecessary Google Sheet reads
   - Cache data when possible

3. **Check n8n Server**
   - Self-hosted: Check server resources
   - Cloud: Contact n8n support

### Hitting OpenAI Rate Limits

**Symptom:** Frequent rate limit errors

**Solutions:**

1. **Add Delays Between Calls**
   ```javascript
   // In Code node before AI
   await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec delay
   ```

2. **Batch Similar Requests**
   - Combine multiple prompts into one call
   - Process in groups

3. **Upgrade OpenAI Tier**
   - Go to: https://platform.openai.com/account/billing
   - Higher tiers = higher rate limits

---

## Testing Issues

### Can't Test Webhook Workflows

**Symptom:** No test button for Webhook trigger

**Solution:**

1. **Use Production Webhook**
   - Copy webhook URL from node
   - Use curl or Postman to send test POST:
   ```bash
   curl -X POST https://your-n8n.com/webhook/test \
     -H "Content-Type: application/json" \
     -d '{"action":"morning_wake_sequence","timestamp":"2024-11-03T07:00:00Z"}'
   ```

2. **Use Webhook Trigger Test**
   - Click "Listen for Test Event"
   - Send real request
   - Click "Use This Event"

### Mock Data for Testing

**Create Test Data in Code Node:**

```javascript
// Test persona data
return [{
  json: {
    name: "Test User",
    telegram_chat_id: "123456789",
    morning_struggle_severity: "severe",
    ai_system_prompt: "Test prompt"
  }
}];
```

---

## Emergency Fixes

### System Completely Broken

**Quick Reset:**

1. **Deactivate All Workflows**
   - Turn off Active toggle on all 5 workflows
   
2. **Test One at a Time**
   - Activate Master Scheduler only
   - Test manually
   - If works, activate next workflow

3. **Check Credentials**
   - Go to Credentials page
   - Re-test all three (Google, Telegram, OpenAI)

### Lost All Data

**Prevention:**

1. **Backup Google Sheet**
   - File → Make a Copy
   - Do this weekly

2. **Export Workflows**
   - n8n → Workflows → Select workflow
   - Export as JSON
   - Save to computer

**Recovery:**
- Restore from Google Sheet copy
- Import workflow JSON files

---

## Getting Help

### Before Asking for Help

Collect this info:

1. **Error Message** (exact text)
2. **Workflow Name** (which one failed)
3. **Node Name** (which step failed)
4. **Execution ID** (from executions tab)
5. **What You Expected** vs **What Happened**

### Where to Get Help

- **n8n Community**: https://community.n8n.io
- **n8n Docs**: https://docs.n8n.io
- **OpenAI Support**: https://help.openai.com
- **This Repository**: Check [BUILD_GUIDE.md](./BUILD_GUIDE.md)

---

## Prevention Tips

### Daily Checks

- [ ] Verify morning wake prompt arrived
- [ ] Respond to at least one prompt
- [ ] Check bot replies correctly

### Weekly Checks

- [ ] Review Sunday night summary
- [ ] Check all 5 workflows are Active
- [ ] Verify Google Sheet is backing up
- [ ] Check OpenAI usage/costs

### Monthly Checks

- [ ] Review all credentials (re-auth if needed)
- [ ] Check streak calculations are accurate
- [ ] Update identity goals if changed
- [ ] Backup everything (sheets + workflows)

---

## Still Stuck?

### Debug Checklist

- [ ] Workflow is Active
- [ ] All credentials valid
- [ ] Sheet names match exactly
- [ ] Column headers correct
- [ ] Cron expression valid
- [ ] Timezone correct
- [ ] Chat ID correct
- [ ] API keys have credits
- [ ] No network issues
- [ ] n8n server running

If ALL checked and still failing → Document error and seek help with info above.

---

**Remember:** This is complex automation. Expect 1-2 small issues during setup. That's normal. Debug methodically, one node at a time. 🔧

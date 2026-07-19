# Login Issue - Debugging Plan

## Problem Statement
Login is not working as intended. Need to identify root cause before attempting fixes.

---

## Step 1: Gather Evidence (YOU Tell Me)

**Please answer these questions:**

1. **What exactly happens when you try to login?**
   - [ ] Button stays on "Loading..." forever
   - [ ] Error message appears (what does it say?)
   - [ ] Page redirects but to wrong place
   - [ ] Nothing happens at all
   - [ ] Something else: ________________

2. **Do you see any error in the browser console?** (F12 → Console tab)
   - [ ] No errors
   - [ ] Yes, error says: ________________

3. **Does signup work?**
   - [ ] Yes, I can create new accounts
   - [ ] No, signup also fails

4. **After login attempt, are you redirected?**
   - [ ] No, stays on /login
   - [ ] Yes, to /chat
   - [ ] Yes, to /onboarding
   - [ ] Yes, but then back to /login

---

## Step 2: Check Points (I Will Investigate)

Once you tell me what happens, I will check:

| Check Point | What I'll Look For |
|-------------|-------------------|
| **Supabase Auth** | Is the user being created in Supabase? |
| **Session Cookie** | Is session being set after login? |
| **Middleware** | Is middleware redirecting incorrectly? |
| **API Route** | Is /api/chat working with auth? |
| **Client Config** | Are Supabase env vars correct? |

---

## Step 3: Possible Root Causes

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "Invalid credentials" | User doesn't exist in Supabase | Create user first via signup |
| Stays on /login after success | Session not persisting | Fix cookie/auth config |
| Redirects to /login after /chat | Middleware blocking | Fix middleware logic |
| "Email not confirmed" | Supabase requires email confirm | Disable email confirm in Supabase |
| Network error | Supabase URL wrong | Fix .env.local |

---

## Step 4: Your Action

**Please tell me:**
1. What symptom you see (from Step 1)
2. Any console errors
3. Whether you created a test account via signup first

Then I will investigate the specific cause and fix it.

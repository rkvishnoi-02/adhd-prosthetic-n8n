# Anchor MVP - Complete Testing Plan

## Test Credentials

```
Email: test@anchor.dev
Password: TestAnchor123!
```

---

## Test Execution Checklist

### 1. Authentication Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| A1 | Signup new user | 1. Go to `/signup` 2. Enter email/password 3. Click Sign Up | Redirects to login with success message | ⬜ |
| A2 | Login valid credentials | 1. Go to `/login` 2. Enter test credentials 3. Click Sign In | Redirects to `/chat` or `/onboarding` | ⬜ |
| A3 | Login invalid credentials | 1. Go to `/login` 2. Enter wrong password | Shows error "Invalid credentials" | ⬜ |
| A4 | Protected route redirect | 1. Visit `/chat` without login | Redirects to `/login` | ⬜ |
| A5 | Sign out | 1. Login 2. Click Sign Out | Returns to `/login` | ⬜ |

---

### 2. Onboarding Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| O1 | Welcome screen | Fresh login → onboarding | Shows "Welcome to Anchor" | ⬜ |
| O2 | Name required | Skip name field, click Continue | Shows error "Please enter your name" | ⬜ |
| O3 | Name entry | Enter name, Continue | Moves to Role step | ⬜ |
| O4 | Skip optional fields | Skip Role, Project, Why | Moves to Tutorial | ⬜ |
| O5 | Tutorial display | Reach Tutorial step | Shows 4 modes (@dump, @do, @clarity, @ground) | ⬜ |
| O6 | Finish onboarding | Click "Start Chatting" | Redirects to `/chat` | ⬜ |
| O7 | Identity saved | Complete onboarding | `GET /api/memory/identity` returns saved data | ⬜ |

---

### 3. Chat Interface Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| C1 | Chat page loads | Visit `/chat` after onboarding | Shows empty message area + input | ⬜ |
| C2 | Message input focus | Click input area | Input focused, ready to type | ⬜ |
| C3 | Send message (Enter) | Type message, press Enter | Message appears, input clears | ⬜ |
| C4 | Send button works | Type message, click Send | Message appears, input clears | ⬜ |
| C5 | User message bubble | Send any message | Right-aligned blue bubble | ⬜ |
| C6 | AI response appears | Send message, wait | Left-aligned gray bubble with response | ⬜ |
| C7 | Loading state | Send message | Shows loading indicator while waiting | ⬜ |
| C8 | Auto-scroll | Send multiple messages | Scrolls to newest message | ⬜ |
| C9 | Header shows email | Load chat page | Header shows logged-in email | ⬜ |

---

### 4. AI Mode Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| M1 | @dump mode trigger | Send "@dump I have so much on my mind" | AI listens, ends with "Anything else?" | ⬜ |
| M2 | @dump max 3 lines | Send @dump message | Response ≤ 3 lines | ⬜ |
| M3 | @do mode trigger | Send "@do write an email to my boss" | AI gives 3-5 numbered micro-steps | ⬜ |
| M4 | @do ends correctly | Send @do message | Ends with "Start with step 1." | ⬜ |
| M5 | @do max 7 lines | Send @do message | Response ≤ 7 lines | ⬜ |
| M6 | @clarity mode trigger | Send "@clarity should I quit my job?" | AI asks 1-2 clarifying questions | ⬜ |
| M7 | @clarity max 3 lines | Send @clarity message | Response ≤ 3 lines | ⬜ |
| M8 | @ground mode trigger | Send "@ground I'm overwhelmed" | AI gives ONE tiny physical action | ⬜ |
| M9 | @ground max 2 lines | Send @ground message | Response ≤ 2 lines | ⬜ |
| M10 | Implicit @ground detection | Send "I'm stuck and can't do anything" | AI detects overwhelm, uses @ground | ⬜ |
| M11 | Mode badge display | Send any @mode message | Shows correct mode badge on AI response | ⬜ |

---

### 5. Tone Validation Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| T1 | No "You got this" | Send any message | Response never contains "You got this" | ⬜ |
| T2 | No "Great job" | Send any message | Response never contains "Great job" | ⬜ |
| T3 | No "You should" | Send any message | Response never contains "You should" | ⬜ |
| T4 | No "Just do" | Send any message | Response never contains "Just..." | ⬜ |
| T5 | Short responses | Send various messages | Responses are 2-5 lines typically | ⬜ |
| T6 | Warm tone | Read responses | Feels conversational, not robotic | ⬜ |

---

### 6. Identity Memory Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| I1 | Identity persists | Complete onboarding → refresh page | Identity still available | ⬜ |
| I2 | AI uses name | Set name "Alex" → chat | AI may reference "Alex" | ⬜ |
| I3 | API GET works | Call `GET /api/memory/identity` | Returns user's identity data | ⬜ |
| I4 | API POST works | Call `POST /api/memory/identity` with data | Updates identity successfully | ⬜ |

---

### 7. Error Handling Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| E1 | Network error on send | Disconnect internet, send message | Shows error, doesn't crash | ⬜ |
| E2 | API error graceful | If API fails | Shows user-friendly error | ⬜ |
| E3 | Session expired | Let session expire, try action | Redirects to login | ⬜ |

---

### 8. UI/UX Tests

| ID | Test | Steps | Expected Result | Status |
|----|------|-------|-----------------|--------|
| U1 | Mobile responsive | Resize to 375px width | Layout adapts, still usable | ⬜ |
| U2 | Large text | Check input/messages | Text is 16px+ (readable) | ⬜ |
| U3 | Keyboard navigation | Tab through interface | Focus visible, logical order | ⬜ |
| U4 | Loading states | Trigger any async action | Clear loading indication | ⬜ |

---

## Manual Test Execution Order

1. **Start dev server**: `npm run dev`
2. **Create test account** (A1)
3. **Login** (A2)
4. **Complete onboarding** (O1-O7)
5. **Test chat basic** (C1-C9)
6. **Test each mode** (M1-M11)
7. **Verify tone** (T1-T6)
8. **Test identity** (I1-I4)
9. **Test errors** (E1-E3)
10. **Test UI** (U1-U4)

---

## Automated API Tests

```bash
# Test identity API
curl -X GET http://localhost:3000/api/memory/identity \
  -H "Cookie: [session_cookie]"

# Test chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: [session_cookie]" \
  -d '{"message": "@dump I feel overwhelmed"}'
```

---

## Test Results Summary

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Auth | 5 | - | - |
| Onboarding | 7 | - | - |
| Chat UI | 9 | - | - |
| AI Modes | 11 | - | - |
| Tone | 6 | - | - |
| Memory | 4 | - | - |
| Errors | 3 | - | - |
| UI/UX | 4 | - | - |
| **TOTAL** | **49** | **-** | **-** |

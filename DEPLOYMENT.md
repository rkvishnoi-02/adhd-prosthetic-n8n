# Anchor - Deployment Guide

Complete guide to deploy Anchor to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project created
- [ ] OpenAI API key
- [ ] Vercel account (free tier works)
- [ ] Git repository (GitHub, GitLab, or Bitbucket)

---

## Step 1: Prepare Supabase

### 1.1 Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 1.2 Verify Database

Ensure these tables exist (they should from Phase 1):
- `users`
- `user_memory`
- `messages`
- `sessions`

Check in **Database** → **Tables** in Supabase dashboard.

---

## Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new API key
3. Copy the key (starts with `sk-`)
4. **Important**: Add billing info to OpenAI account

---

## Step 3: Push to Git

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Anchor MVP"

# Push to GitHub (or GitLab/Bitbucket)
git remote add origin https://github.com/YOUR_USERNAME/anchor.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Project**
3. Select your Git repository
4. Click **Import**

### 4.2 Configure Environment Variables

In the **Environment Variables** section, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important**:
- Click **Add** after each variable
- Select all environments (Production, Preview, Development)

### 4.3 Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

## Step 5: Post-Deployment

### 5.1 Test the Deployment

1. Visit your Vercel URL
2. Click **Sign Up**
3. Create an account
4. Complete onboarding
5. Test all 4 modes:
   - `@dump I have too much to do`
   - `@do write an email`
   - `@clarity should I start with X or Y?`
   - `@ground everything is overwhelming`

### 5.2 Update Supabase Site URL

1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to your project in Vercel
2. **Settings** → **Domains**
3. Add your domain (e.g., `anchor.yourdomain.com`)
4. Follow DNS configuration instructions

### 6.2 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain:

```env
NEXT_PUBLIC_APP_URL=https://anchor.yourdomain.com
```

Redeploy for changes to take effect.

---

## Troubleshooting

### Build Fails

**Error**: "Missing environment variables"
- **Fix**: Ensure all 4 environment variables are set in Vercel

**Error**: TypeScript errors
- **Fix**: Run `npm run typecheck` locally first

### Authentication Not Working

**Error**: Users can't sign up/login
- **Fix**: Check Supabase Site URL matches Vercel URL

### AI Responses Not Working

**Error**: Chat API returns 500
- **Fix**: Verify OpenAI API key is correct and has billing enabled

### Database Errors

**Error**: "Failed to fetch messages"
- **Fix**: Check Supabase credentials and RLS policies

---

## Monitoring

### Vercel Analytics

1. Go to your project in Vercel
2. Click **Analytics** tab
3. View:
   - Page views
   - Response times
   - Error rates

### Supabase Logs

1. Go to Supabase Dashboard
2. **Logs** section
3. Filter by:
   - API logs (query errors)
   - Auth logs (login issues)

---

## Updating the App

### Push Changes

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically redeploys on push to `main` branch.

### Rollback

If deployment breaks:

1. Go to Vercel Dashboard
2. **Deployments** tab
3. Find previous working deployment
4. Click **⋯** → **Promote to Production**

---

## Security Checklist

Before going live:

- [ ] Environment variables are set (not hardcoded)
- [ ] `.env.local` is in `.gitignore`
- [ ] OpenAI API key has usage limits set
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enabled (automatic with Vercel)

---

## Performance Optimization

Already applied:

✅ Static page generation where possible
✅ Dynamic imports for heavy components
✅ Image optimization (Next.js automatic)
✅ Edge middleware for fast redirects
✅ Efficient database queries with indexes

---

## Cost Breakdown (Est. for <100 users)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Unlimited | $0 |
| Supabase | 500MB DB, 2GB bandwidth | $0 |
| OpenAI | Pay-per-use | ~$5-10/mo |

**Total**: ~$5-10/month for small scale

---

## Next Steps

After deployment:

1. **Share with users** - Get feedback
2. **Monitor usage** - Check Vercel Analytics
3. **Iterate** - Add more modes, features
4. **Scale** - Upgrade Supabase/OpenAI as needed

---

## Support

If you run into issues:

1. Check [Vercel Docs](https://vercel.com/docs)
2. Check [Supabase Docs](https://supabase.com/docs)
3. Review error logs in Vercel/Supabase dashboards

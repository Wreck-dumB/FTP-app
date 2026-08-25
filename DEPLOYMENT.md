# Deployment Guide

This guide walks you through deploying Forward Thinking Parents (FTP) to a production URL.

## Prerequisites

- A GitHub account and this repo linked.
- A Supabase account with a project (free tier is fine for testing).
- A Vercel account (free tier).
- Node.js 20+ and npm (for local testing).

## Step 1: Prepare Supabase

1. Log in to [Supabase](https://supabase.com).
2. Create a new project or use an existing one.
3. Go to **SQL Editor** and run migrations in order:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_invite_preview.sql`
   - `supabase/migrations/0003_security_hardening.sql`
4. Go to **Project Settings → API** and note:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `Anon/Publishable Key` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
5. Go to **Settings → Database → Connection Info** and note the `Service Role Key` (for server-side seeding only — keep secret).

## Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **New Project** and link your GitHub repo (`Wreck-dumB/FTP-app`).
3. Select **Next.js** as the framework (auto-detected).
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL`: Your deployed URL (e.g., `https://ftp-app.vercel.app`)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional, for server-side seeding) Your Supabase service role key
   - `SEED_SECRET`: (Optional, for server-side seeding) A random secret you generate (e.g., `openssl rand -hex 32`)
5. Click **Deploy**.
6. Once deployed, note your URL (e.g., `https://ftp-app.vercel.app`).

## Step 3: Seed Demo Data

### Option A: Server-side seeding (via deployed URL)

If you added `SEED_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel:

```bash
curl -X POST \
  -H "x-seed-secret: YOUR_SEED_SECRET" \
  https://ftp-app.vercel.app/api/seed
```

### Option B: Local seeding (requires service role key in .env.local)

```bash
npm ci
# Add SUPABASE_SERVICE_ROLE_KEY to .env.local
npm run seed:demo
```

## Step 4: Test the app

1. Visit your deployed URL.
2. Click **Try the demo** or **Sign up**.
3. Create a family and invite another user.
4. Test calendar navigation (use arrow keys).

## Step 5: Monitor & Maintain

- Add error monitoring (e.g., Sentry) to catch issues.
- Set up automated backups for your Supabase database.
- Monitor CI/CD in GitHub Actions (`.github/workflows/ci.yml` runs on every push).

## Troubleshooting

- **Build fails**: Check that all migrations are applied to Supabase.
- **Auth errors**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.
- **Seed endpoint 401**: Check `SEED_SECRET` is set and matches the header sent.
- **Calendar doesn't render**: Ensure Tailwind CSS is compiled (should be automatic in Next.js 16).

## Next Steps

- Implement the remaining features (swap requests, notifications).
- Add custom domain (Vercel → Domains → Add).
- Set up email notifications (use Supabase Webhooks + a service like SendGrid).
- Add analytics (Plausible, Posthog, or GA4).

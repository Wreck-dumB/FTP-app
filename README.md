# Forward Thinking Parents (FTP)

A co-parenting coordination app for separated parents: shared custody calendar, schedule swap requests, notifications, and notes — so you don't have to message each other directly to coordinate schedule changes.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Supabase** (Postgres, Auth, Realtime)
- **Tailwind CSS v4**
- Hosted on **Vercel**

## Prerequisites

- Node.js 20 LTS
- A free [Supabase](https://supabase.com) project
- A free [Vercel](https://vercel.com) account (for deploy)

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=       # from Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # from Supabase → Project Settings → API
NEXT_PUBLIC_SITE_URL=           # e.g. https://your-app.vercel.app (localhost:3000 in dev)
```

## Database setup

Apply migrations in order via the Supabase SQL editor (Dashboard → SQL Editor):

1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_invite_preview.sql`
3. `supabase/migrations/0003_security_hardening.sql`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npx tsc --noEmit   # type check
npm run lint
```

## Current status

Milestone 3 of 11 complete: auth, family setup, and invite flow. Working toward the custody calendar and swap requests.

| Milestone | Status |
|-----------|--------|
| Auth (signup / login / logout) | ✅ Done |
| Family setup + membership | ✅ Done |
| Invite flow (email link) | ✅ Done |
| Child profiles | 🔲 Planned |
| Custody schedule engine | 🔲 Planned |
| Calendar view | 🔲 Planned |
| Swap requests | 🔲 Planned |
| Notifications | 🔲 Planned |
| Notes / reminders | 🔲 Planned |
| Dashboard polish | 🔲 Planned |
| Deploy + real-world test | 🔲 Planned |

## Two-account testing

Use Gmail `+` aliases (e.g. `you+parentA@gmail.com` / `you+parentB@gmail.com`) in two browser profiles to simulate both co-parents.

## Security

See `AUDIT_REPORT.md` for the full security review (2026-07-02). Critical and high findings are resolved in migration `0003_security_hardening.sql`.

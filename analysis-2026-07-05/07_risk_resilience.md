# 07 — Risk & Resilience

Bus-factor-of-one realities, in descending order of "how much would this hurt this week."

## 1. Work at risk RIGHT NOW (highest urgency, trivially fixable)

- **Milestone 3 is unpushed — 23 days.** `git branch -vv` → `[origin/main: ahead 1]`. The entire invite flow (commit 97c5060, 2026-06-26) exists on exactly one Windows machine. A disk failure today costs the last 40% of everything built.
- **`AUDIT_REPORT.md` is uncommitted** (created 2026-07-02). The most valuable non-code artifact in the repo isn't even in local git, let alone on GitHub.
- **The 968-line plan file** (`C:\Users\Drust\.claude\plans\nifty-munching-gosling.md`) — the master plan for TWO businesses (FTP and SparkPlay, including its full security architecture) — is a single file, on a single machine, in no git repo, with no evidence of any backup. This is arguably the highest-value single document the owner possesses and it has zero redundancy.

**Fix for all three: under five minutes.** Commit, push, and copy the plan into a repo (or any synced/backed-up location).

## 2. Half-deployed / will-break-silently

- **Nothing is deployed**, which is currently a *mitigation*: the two critical RLS holes (audit C1/C2 — any authenticated user can insert themselves into any family, `0001_initial_schema.sql:355-361`, verified present 2026-07-05) are only reachable if the Supabase project's URL+anon key are in circulation. The hosted Supabase instance **does already exist** (`.env.local` configured 2026-06-11), so the vulnerable policies are live on a real database today — with, presumably, only test data. **The silent failure mode:** Milestone 11 arrives months from now, the app gets real families, and nobody remembers migration 0003 never happened. The audit must be executed *before* any deploy, and nothing currently enforces that ordering except memory.
- **`NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000`** in production (audit L2, `src/app/auth/actions.ts:28`) — invite links and confirm emails would silently point at localhost on first deploy. Classic will-break-silently.
- **NavBar 404s** (`/calendar`, `/requests`, `/notes`) — already broken, silently, for every would-be tester.

## 3. Secrets hygiene — GOOD (paths only, per rules)

- `.env.local` present and properly excluded (`.gitignore` has `.env*`); never committed (verified: no env file in tracked history).
- Only the anon (publishable) key is used anywhere; no service-role key in the repo (audit's "found healthy" list, corroborated).
- `.env.local.example` exists and documents all three vars — genuinely good practice.
- One note: the Supabase keys' only local home is `.env.local` on this machine; recovery exists via the Supabase dashboard, so this is inconvenience-grade, not loss-grade.

## 4. Single-machine risk

Everything happens on one Windows 11 machine: the repo (partially pushed), the plan file (not backed up at all), Claude session memory, and `.claude` settings. A two-week illness strands nothing *organizational* (solo project, no one waiting) — but a machine failure during those two weeks loses M3, the audit, and both businesses' planning corpus permanently. The GitHub remote is the only off-machine artifact and it is 23 days stale.

## 5. Two-week-illness test

What breaks if the owner disappears for a fortnight? No users, no deploys, no cron jobs, no clients — **nothing external breaks**, which is the one upside of $0 shipped. What decays: the audit ages from "honest open" to "quietly aging" (per 03's pattern, that flip is already the repo's established failure mode), and the Supabase free-tier project may pause from inactivity (hosted free-tier instances pause after ~1 week idle — worth knowing before a real deploy relies on it).

## 6. No CI / no tests as a resilience issue

Beyond quality: with zero automated checks, the *only* regression detector is the owner's manual habit inside rare work bursts. Combined with agent-driven development (large generated changes), unreviewed-and-untested is the exact combination that produces silent breakage between sessions. Audit L4 specs the fix.

## What's working (receipts)
- Secrets discipline (`.gitignore`, example file, anon-key-only).
- A remote exists and 3 of 4 commits are on it.
- RLS enabled on all 10 tables with family-scoped SELECTs (audit "found healthy") — the *read* side of the security model is solid.

## What's not (receipts)
- Unpushed M3 (23 days), uncommitted audit, unbacked-up plan file — items 1 above.
- Live database with known-critical policies and no forcing function to fix before deploy.
- Zero automation; resilience currently equals "the owner remembers."

## Improvements (ranked by leverage)
1. **Commit + push everything, and back up the plans directory** (into a repo or synced storage) · evidence: §1 · effort **S** — do this before reading further.
2. **Apply migration 0003 (audit C1/C2/H2) to the live Supabase project now**, while it holds only test data — the cost of fixing RLS rises permanently the day real family data lands · effort **S/M**.
3. **CI on push** (also in 05) — makes GitHub not just a backup but a verifier · effort **S**.
4. **Add a pre-deploy checklist to the repo** ("0003 applied; SITE_URL set; L2 env guard in place") so the deploy-months-later failure mode has a tripwire · effort **S**.

## STOP doing
Stop ending work sessions with the repo ahead of its remote. Every other risk in this report is speculative; this one is a 23-day-old standing fact with a 10-second fix.

## Top-3 for this area
1. Push + commit + back up the plan file (today).
2. Migration 0003 on the live DB before anything else ships.
3. CI so the remote verifies what it stores.

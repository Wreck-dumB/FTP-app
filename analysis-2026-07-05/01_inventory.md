# 01 — Inventory (read first; all other reports stand on this)

**Analyst:** Claude (Fable 5), whole-repo review, 2026-07-05
**Scope:** `d:\Projects\First idea` — this is a **single repo**, not a parent folder of projects. Other projects referenced in evidence (SparkPlay, etc.) live elsewhere and were NOT readable; see 00_OVERVIEW "what this analysis could not see."

## What this repo is

**Forward Thinking Parents (FTP)** — a co-parenting / shared-custody coordination web app. `package.json` name: `ftp-app`. Stack: Next.js 16.2.9 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres/Auth via `@supabase/ssr`). Intended hosting: Vercel (per plan; no deployment evidence in repo).

**State: half-built, stalled.** Milestones 1–3 of an 11-milestone plan are committed; last feature commit 2026-06-26; nothing since except an (uncommitted) audit report on 2026-07-02.

## Git

- Remote: `https://github.com/Wreck-dumB/FTP-app.git`
- Branch `main`, **ahead of `origin/main` by 1 commit** — Milestone 3 (2026-06-26) was never pushed. GitHub's last state is Milestone 2 (2026-06-12), 23 days stale.
- Uncommitted right now: `AUDIT_REPORT.md` (19.9 KB, written 2026-07-02).
- Full history (only 4 commits):

| Commit | Date/time | Subject |
|---|---|---|
| dabf720 | 2026-06-11 22:47 | Initial Next.js scaffold |
| 790a25c | 2026-06-11 23:48 | Add Supabase auth (Milestone 1) and initial DB schema |
| 36b614c | 2026-06-12 00:10 | Milestone 2: family setup, membership, dashboard linking |
| 97c5060 | 2026-06-26 09:11 | Milestone 3: invite flow (family_invites + accept-invite) |

- **Cadence:** one late-night burst (22:47 → 00:10 across Jun 11–12), one morning session two weeks later (Jun 26), then nothing. Three active days in 3.5 weeks.

## File map (source ≈ 1,936 lines total incl. SQL)

| Path | What it is | Lines |
|---|---|---|
| `supabase/migrations/0001_initial_schema.sql` | All 10 tables, RLS on every table, 5 security-definer functions | 505 |
| `supabase/migrations/0002_invite_preview.sql` | `get_invite_preview()` for anon invite pages | 24 |
| `src/proxy.ts` | Next 16 middleware-replacement: session refresh + route gate | 58 |
| `src/app/auth/actions.ts`, `auth/callback/route.ts` | login/signup/logout server actions, email-confirm callback | 69 |
| `src/app/(auth)/login`, `signup`, `accept-invite/[token]` | Auth + invite-acceptance pages | ~332 |
| `src/app/(app)/dashboard`, `family`, `family/setup`, layout | Protected pages: dashboard stub, family mgmt, setup | ~353 |
| `src/lib/supabase/` (`client/server/family.ts`) | Supabase clients + data-access helpers | 89 |
| `src/lib/types/` (`database.types.ts`, `domain.ts`) | Hand-written DB types | 325 |
| `src/lib/utils/dates.ts` | 4 pure date helpers | 28 |
| `src/components/layout/NavBar.tsx` | Nav — **links to `/calendar`, `/requests`, `/notes`, none of which exist** | 37 |
| `AUDIT_REPORT.md` | Security/code audit dated 2026-07-02, severity-ranked, uncommitted | 224 |
| `README.md` | **Stock create-next-app template**, zero project-specific content | 37 |
| `AGENTS.md` / `CLAUDE.md` | Agent guardrail: "Next.js 16 differs from training data, read bundled docs" | — |
| `.claude/settings.json` | Permission allowlist — see note below | — |

**Schema built far ahead of UI:** migration 0001 already defines `custody_schedules`, `custody_schedule_blocks`, `custody_overrides`, `swap_requests`, `notifications`, `notes` and the `accept_swap_request`/`decline_swap_request` functions — none of which have any page, component, or client code yet. 7 of 10 tables are UI-orphans today.

## Docs / plans / notes

- **Plan file (outside repo):** `C:\Users\Drust\.claude\plans\nifty-munching-gosling.md` (968 lines). Contains the full FTP MVP plan (11 milestones, data model, RLS approach, verification strategy) **plus three later plans for SparkPlay** — a separate business/repo (`D:\Projects\sparkplay`) whose plans (parent portal, staff RBAC, migrations planned through `0020_...`) dwarf the FTP section in size and recency.
- **No TESTING.md** (the FTP plan, line 111, commits to maintaining one). No tests. No CI. No `.github/`.

## Secrets (paths only — not read)

- `d:\Projects\First idea\.env.local` — present, correctly gitignored (`.env*` in `.gitignore`). `.env.local.example` documents 3 vars (Supabase URL/anon key, site URL). No service-role key anywhere in the repo (confirmed by the 2026-07-02 audit and by grep of tracked files).

## Oddity worth flagging

`d:\Projects\First idea\.claude\settings.json` — this repo's Claude permission allowlist is dominated by **another project's commands**: `python search.py`, `python -m pokeinvest*`, `bigw_check.py`, `toymate_check.py`, `price_compare.py`, etc. (the Pokémon-card investing tool). Evidence that Claude Code sessions for at least one unrelated project were run from inside this repo's folder, accumulating permissions here.

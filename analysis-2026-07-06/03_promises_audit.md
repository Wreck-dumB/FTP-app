# 03 — Promises / Commitments Audit

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

No client/collaborator evidence exists in any repo. Audit is on self-commitments: TODOs, roadmaps, half-wired features, README-stated next steps, plan-file milestones.

Verdict system: **DELIVERED** / **HONEST OPEN** / **QUIETLY AGING**

---

## SparkPlay

### DELIVERED
- Generate activities from materials on hand — `src/app/(app)/generate/` built (commit `b242463`, 2026-06-18)
- EYLF outcome linking with validation — 17 outcomes seeded in `eylf_outcomes`, validated server-side before insert (`src/lib/anthropic.ts`)
- Save activity to library — `save.ts` server action, `activities` table (`0001_initial_schema.sql`)
- Observation logging — `observations` table, `/observations` route (`b242463`, 2026-06-18)
- Materials inventory — `materials` table, `/materials` route, stock tracking (`0014_materials_stock_and_food.sql`, 2026-06-29)
- Child profiles with current interests and additional needs — `children` table, `0005_additional_needs.sql` (2026-06-26)
- Policy builder with AI generation — `policies` table + AI route (`65d41b0`, 2026-06-26)
- Risk assessments — `0002_risk_assessments.sql`, `/risk-assessments` route (`65d41b0`)
- Safe work procedures — `0003_swp_and_policies.sql`, `/safe-work-procedures` route (`65d41b0`)
- Program planner — `0004_programs.sql`, `/programs` route with cultural calendar (`82d9d5e`, 2026-06-26)
- Developmental milestones (0–18 years) — `0006_developmental_milestones.sql`, `0007_milestones_to_18.sql` (`b838845`, 2026-06-28)
- QIP generator — `0009_quality_improvement_plans.sql`, `/qip` route (`3898db5`, 2026-06-29)
- Forms library — `0010_form_templates.sql`, `/forms` route (`c97fdd3`, 2026-06-29)
- Enrolment records — `0011_enrolment_records.sql` (`c97fdd3`)
- Incident reports — `0012_incident_reports.sql`, `/incident-reports` route (`c97fdd3`)
- Digital permission slips — `0013_permission_slips.sql`, `/permission-slips` route (`c97fdd3`)
- Recipe generator — `0015_recipes.sql`, `/recipes` route (`238419c`, 2026-06-29)
- Parent portal Phase 1 (linking, per-child invites) — `0008_parent_portal_core.sql`, `/parent/` routes (`b898845`, 2026-06-28)
- Staff RBAC — `0016`–`0020` migrations, `/staff` route (`71578a5`, 2026-06-30)
- White noise player (persistent across navigation) — `WhiteNoiseProvider.tsx`, `/white-noise` route (this session)
- Generator count selector (3/5/7/10) — `GenerateForm.tsx`, `api/generate/route.ts` (this session)
- Quick list pinning — `GenerateForm.tsx` (this session)
- EYLF outcomes dropdown — `GenerateForm.tsx` (this session, just completed)

### HONEST OPEN (known, stated, no timeline)
- Document upload + AI feedback — explicitly noted in session memory (`project_sparkplay_pending.md`), no code started
- Parent portal Phase 2–4 (observation sharing, messaging, community wall) — in plan file, no migrations or routes
- Sign-in/out register — plan mentions "front desk capability tier", no code
- Parent-reported sickness with document upload — plan file, no code

### QUIETLY AGING
- **SparkPlay has never been deployed.** The plan file says "Deploy & personal trial" is Milestone 10; 22 commits in, this has never appeared in any commit message. The production Supabase project exists (referenced in session as `jjxrwbxrkfpiaiiqrmth`), but no Vercel URL is anywhere in the repo. No deploy evidence.
- **19 commits have never been pushed to origin.** The remote exists. Everything since the initial scaffold is local-only. No commit since 2026-06-18 is safely backed up. Receipt: `git status` shows `main` 19 ahead of origin.
- **No real README.** Stock `create-next-app` template. After 22 feature commits, there is no description of what SparkPlay is, what env vars it needs, or how to run it. Someone cloning this repo would have no idea what it is.
- **No tests of any kind.** EYLF code validation is described as critical in the plan ("wrong framework links are a real compliance/trust risk") — no test exists for it.

---

## FTP — Forward Thinking Parents

### DELIVERED
- Milestone 1: Auth (signup, login, logout, session middleware) — `790a25c`, 2026-06-11
- Milestone 2: Family setup, membership, dashboard linking — `36b614c`, 2026-06-12
- Milestone 3: Invite flow (family_invites + accept-invite) — `97c5060`, 2026-06-26
- Security audit produced — `AUDIT_REPORT.md`, 2026-07-02 (untracked, not committed)

### HONEST OPEN
- Milestones 4–11 are explicitly planned and sequenced in the plan file; no code exists for any of them. This is an honest open — the plan is detailed, the build order is clear, the project is paused not abandoned. Receipt: commit `97c5060` is the last feature commit; plan file has detailed specs for all remaining milestones.

### QUIETLY AGING
- **`AUDIT_REPORT.md` produced 2026-07-02, zero remediation steps done as of 2026-07-06 (4 days).** The document describes itself as written for an implementing agent to execute. It has not been executed. The critical vulnerabilities (C1, C2) it describes are live in the real Supabase instance. Receipt: `AUDIT_REPORT.md` is untracked (`git status`); finding C1 at `0001_initial_schema.sql:355-357`.
- **`AUDIT_REPORT.md` is not committed.** It's the single most valuable recent artifact in this repo and it's in the working tree only. One disk event loses it.
- **NavBar links to three routes that 404.** `/calendar`, `/requests`, `/notes` — identified in audit `L1`, in the repo since `36b614c` (2026-06-12), 24 days later still broken. Receipt: `src/components/layout/NavBar.tsx` links these routes; none have a `page.tsx`.
- **README is stock create-next-app.** Flagged in audit `L3`. Still unchanged. 24 days.
- **The plan file lives outside the repo.** The 1,000+ line master plan (`~/.claude/plans/nifty-munching-gosling.md`) is on one machine, not committed anywhere, not backed up.
- **Analysis from yesterday (2026-07-05) produced 10 recommendations. Zero are evidenced as actioned.** Top recommendation was "push and commit everything today." This analysis is being run in the same state.

---

## ADHDan Hub/Store

### DELIVERED
- Full storefront code: home, shop grid, product pages, cart drawer, checkout, success/cancel pages, brand manifesto
- Original brand SVGs (`BoltBrainMark`, `SkateBoltIcon`, `ChilliDropIcon`, `PaintSplashIcon`)
- 6 POD products defined in `content/products.ts`
- Stripe checkout session API (`/api/checkout`)
- Stripe webhook → Printful auto-fulfillment (`/api/webhooks/stripe`)
- `scripts/sync-printful.ts` automated product creation
- `EDITING.md` guide for non-technical self-editing
- `content/check-content.ts` validation script
- Multi-section hub evolution (ConElevent, Eating, Art, FTP cross-link)

### HONEST OPEN
- Eating section is a placeholder — one food post ("Homemade chilli oil"), no actual recipe content. The README structure implies more content will come. No clear timeline.

### QUIETLY AGING
- **7 steps in the README punch list, 0 executed.** The README documents exactly what needs to happen to go live: create Printful account, create Stripe account, deploy to Vercel, add Stripe webhook, run `npm run printful:setup`, place test order. None of these have been done — `src/data/printful-sync.generated.json` doesn't appear to exist, no Vercel config, no domain. Receipt: `README.md` steps 1–7; `git status` shows uncommitted content.
- **No git remote.** Code exists on one machine only. Receipt: `git remote -v` returned nothing.
- **Uncommitted work since June 26.** `EDITING.md`, `content/`, `scripts/check-content.ts` are untracked. `package.json`, `scripts/render-art.ts`, `src/app/globals.css`, `src/data/posts.ts`, `src/data/products.ts` are modified. Receipt: `git status`.

---

## Paper Trading Bot

### DELIVERED
- Working bot baseline with Alpaca paper API, SQLite log, scheduler, SMA strategy
- Scheduler bugfix (`6ea865c`, 2026-06-26 10:00)
- Accurate README with explicit scope warnings

### HONEST OPEN
- README says "edit `config.py` freely" — the strategy is acknowledged as a demo placeholder and the user implicitly accepted this scope. This is a fair open.

### QUIETLY AGING
- **No remote backup.** One machine. Clean working tree but zero redundancy. Receipt: `git remote -v` empty.

---

## Pokemon Card Investing Tool

### DELIVERED
v1–v14 per README: all described features are evidenced in the file tree (`tool/pokeinvest/`, `tool/webapp.py`, `tool/templates/`, scheduled tasks). The README's "planned next steps" (eBay Marketplace Insights API, live TCGplayer/Cardmarket) are appropriately marked as future.

### HONEST OPEN
- eBay Developer API access (noted in README "Planned next steps") — clearly flagged, waiting on third-party approval. Fair.

### QUIETLY AGING
- **No remote backup.** Three scheduled jobs run hourly, building real `data/card_history.json` price history. This accumulating data has no backup. Receipt: `git remote -v` empty; README describes daily `Pokeinvest-TrackWatchlist` job writing to `data/card_history.json`.
- **`tool/discord_webhook.txt` is committed to git.** (Flagged; not read.) This is a credentials file in a git repository with no remote — risk is currently contained but if a remote is ever added, this becomes a credential leak. Receipt: `Get-ChildItem D:\Projects\pokemon-card-investing\tool\ -Name` shows `discord_webhook.txt`.

---

## Cross-portfolio QUIETLY AGING items

| Item | Receipt | Days old |
|------|---------|----------|
| SparkPlay never deployed | No Vercel URL; plan item "Milestone 10" never committed | 19 days |
| SparkPlay 19 commits never pushed | `git status`: 19 ahead of origin | Up to 19 days |
| FTP AUDIT_REPORT.md unexecuted | Untracked file; 0 of 7 steps done | 4 days |
| FTP dead NavBar links | `NavBar.tsx:15-23`; audit L1 | 24 days |
| FTP plan file off-repo | `~/.claude/plans/nifty-munching-gosling.md` | 25 days |
| ADHDan not deployed | README 7-step punch list; no Vercel config | 10 days |
| ADHDan no remote | `git remote -v` empty | 13 days |
| Pokemon tool no remote | `git remote -v` empty | 10 days |
| Pokemon `discord_webhook.txt` in git | File present in `tool/` | 10 days |
| Yesterday's analysis recommendations | 10 recommendations, 0 actioned in 1 day | 1 day |

The last row is the uncomfortable one. This analysis is the second in two days. The first produced a top-10 list. The top item was "push and commit everything, today." The current state shows this did not happen.

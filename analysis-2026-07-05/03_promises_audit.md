# 03 — Promises / Commitments Audit

No clients, collaborators, or external users appear anywhere in this repo — no issue tracker, no correspondence, no user-facing deployment. So per the brief, this audits **self-commitments**: the plan file, the README, the UI's own implied promises, and the audit report's implied follow-through. Verdicts: **DELIVERED / HONEST OPEN / QUIETLY AGING**.

## DELIVERED (with receipts)

| Commitment | Receipt |
|---|---|
| Milestone 0 — scaffold, repo, env setup | dabf720 (2026-06-11); `.env.local.example` documents all 3 vars |
| Milestone 1 — auth (signup/login/logout, session proxy, protected layout) | 790a25c; `src/proxy.ts`, `src/app/(app)/layout.tsx` |
| Milestone 2 — family setup, membership, dashboard linking | 36b614c; `/family/setup`, `create_family_with_owner` |
| Milestone 3 — invite flow | 97c5060; `0002_invite_preview.sql`, `/accept-invite/[token]` |
| "Each milestone independently testable / builds clean" | Audit header (2026-07-02): tsc, eslint, next build all clean |
| Plan's RLS-approach commitments (security-definer RPCs for invites/swaps, notifications server-side only) | `0001_initial_schema.sql:196-320,475-482` — implemented as designed |

Three milestones in, everything committed matches what the plan said it would be. When work happens, it's honest work.

## HONEST OPEN (acknowledged, recent, not yet overdue)

| Commitment | Evidence | Status |
|---|---|---|
| AUDIT_REPORT.md execution (7-step order, "implement everything except [DECISION] directly") | `AUDIT_REPORT.md:202-212`, dated 2026-07-02 | 3 days old; zero of 7 steps started (no migration 0003, no `safeNext`, `family.ts` unchanged — all verified 2026-07-05). Still "open" rather than "aging" — but it flips to aging fast, because it blocks everything else in a custody-data app. |
| M1 [DECISION] — bind invite acceptance to invited email? | `AUDIT_REPORT.md:134-136` | A product decision only the owner can make. Undecided, unanswered. |
| Milestones 4–11 | Plan lines 90–98 | Open and unstarted; no false claims made about them anywhere. |

## QUIETLY AGING (the uncomfortable list)

1. **"GitHub repo for backups/deploys" (plan, Milestone 0).** The repo exists — but Milestone 3 (2026-06-26) **was never pushed**. `git branch -vv`: `[origin/main: ahead 1]`. The backup promise has been silently broken for 23 days; GitHub still thinks this project is at Milestone 2. The audit report isn't even committed, let alone pushed. A backup that's three weeks stale on a single Windows machine is a promise kept in name only.

2. **The NavBar promises features that 404.** `src/components/layout/NavBar.tsx:15-23` links every logged-in user to `/calendar`, `/requests`, `/notes` — none exist. Committed 2026-06-12 (M2), so these links have been dead for 23 days. This is the repo's own UI making a "coming soon" claim with no date and no progress since June 26. (Also flagged as audit L1 — still unfixed.)

3. **"Maintain `TESTING.md` with a full two-user end-to-end checklist… re-run after major changes" (plan line 111).** Never created. Three milestones and one invite flow later, there is no written record that the two-account verification the plan mandated was ever performed.

4. **"Recurrence engine gets unit tests before any UI is built on top of it" (plan line 110).** Not yet violated (M5 not started) — but there is **no test runner in `package.json` at all**, so the promise currently has no mechanism. Flagged now so it doesn't get quietly dropped when M5 lands.

5. **"Verify: deploy 'hello world' to Vercel" (plan, Milestone 0).** No evidence this ever happened: no `.vercel/`, no URL in any file, README untouched. Milestone 0 was marked done by moving on, not by meeting its own acceptance criterion.

6. **README (audit L3, and basic hygiene).** Still the stock create-next-app template 24 days after the project stopped being a stock scaffold. Anyone (including future-you on a new machine) cloning `Wreck-dumB/FTP-app` gets zero instructions for Supabase setup, migrations, or env vars.

7. **The implicit big one: "You want to start a business" (plan line 4, memory).** FTP was "First idea" — the folder is literally named that. The plan file's own later sections show where the energy went: three subsequent, much larger plans for a *different* business (SparkPlay), while FTP's last feature commit ages. Nobody wrote "FTP is paused" anywhere. That's the quietest drop of all: not a decision, just a drift.

## What's working
Delivered-vs-claimed integrity is high: commit messages match content, milestones map 1:1 to the plan, and the audit report is brutally honest about the code's flaws (receipts: all of §DELIVERED above).

## What's not
The aging list is entirely *meta*-work: backups, testing records, README, an explicit pause/continue decision. The pattern isn't overpromising features — it's under-maintaining the promises *around* the features.

## Improvements (ranked by leverage)
1. **Push, today** — `git push` erases aging item #1 in 10 seconds · evidence: `ahead 1` since 2026-06-26 · effort **S**.
2. **Make the FTP pause/continue decision explicit** — one paragraph in the repo (STATUS.md or README): paused-until-X, or next-milestone-by-Y · evidence: aging item #7 · effort **S**.
3. **Fix or gate the dead NavBar links** — audit L1 already contains the fix · effort **S**.
4. **Answer the one [DECISION]** (invite email binding) so the audit becomes 100% agent-executable · effort **S**.

## STOP doing
Stop treating verification steps ("deploy hello world," "maintain TESTING.md," "re-run checklist") as optional trailing chores. Every quietly-aging item above is a verification/ops promise, not a feature promise — the pattern is consistent and it's the exact category that bites silently later.

## Top-3 for this area
1. `git push` (and commit the audit report).
2. Write the explicit FTP status decision down in the repo.
3. Kill the 404 links.

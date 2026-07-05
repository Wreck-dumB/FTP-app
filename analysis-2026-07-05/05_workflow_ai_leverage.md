# 05 — Workflow & AI Leverage

Owner context (from session memory, no [OPTIONAL CONTEXT] provided): solo, new to coding, day job in early childhood education, builds with Claude Code daily, relies on the agent for implementation calls.

## How this person actually works (from evidence)

- **Plan-first, and the plans are genuinely good.** The FTP plan (968-line plan file, §1) has a data model, RLS strategy, build order with per-milestone verification, and future-phase boundaries. This is better planning discipline than most professional teams show.
- **Bursts, not cadence.** Commits at 22:47/23:48/00:10 (one night) and 09:11 (one morning, two weeks later). Work happens in rare, deep sessions around a day job — which means anything requiring "come back tomorrow" tends not to happen (see the unpushed commit, the unexecuted audit).
- **Big-bang milestone commits.** Each commit is an entire milestone (M2 = setup+membership+dashboard in one commit). Fine solo, but it means an interrupted session leaves large uncommitted/unpushed state — exactly the current condition (`AUDIT_REPORT.md` uncommitted, M3 unpushed 23 days).
- **Agent-aware engineering culture, unusually so for a beginner:** `AGENTS.md` warns future agents that Next.js 16 diverges from training data and points to `node_modules/next/dist/docs/` — a real, learned guardrail. The audit report (2026-07-02) is *written as a prompt for a Sonnet-class implementing agent*, with acceptance criteria per finding and [DECISION] markers separating product calls from implementation. Session memory + plan files are actively maintained.

## AI-leverage level: **delegated-tasks, verging on orchestrated — but the loop doesn't close**

Chat-assistant → **delegated-tasks** ✔ (whole milestones, audits, and multi-plan design docs are delegated) → orchestrated-agents ✘.

The evidence for "doesn't close": the owner commissioned a comprehensive audit explicitly formatted for hands-off agent execution (`AUDIT_REPORT.md:22-28`, "Instructions for the implementing agent") — and then **no agent was ever pointed at it**. Three days later, zero of seven steps exist. The artifact generation is orchestration-grade; the dispatch and follow-through are manual, and the human is the bottleneck in a loop they already built the tooling to automate.

Same pattern at smaller scale: the plan mandates re-running a TESTING.md checklist after major changes (never created), and `npx tsc --noEmit`/`eslint` are allowlisted in `.claude/settings.json` — the verification commands are pre-approved, but there's no CI to run them when the human isn't in the loop.

## Where the human is the bottleneck (and a tool could run the loop)

1. **Executing their own generated work orders.** The audit's steps 1–6 are marked "implement everything except [DECISION] directly." That is a single Claude Code session the owner just has to start. Biggest single unclosed loop.
2. **Verification.** No CI (`.github/` absent), no tests, no TESTING.md. Every "does it still build" depends on a human (or an agent asked ad hoc) remembering. A GitHub Actions workflow running `tsc --noEmit && eslint && next build` on push is ~20 lines and the audit already specced it (L4).
3. **End-of-session hygiene.** Push, commit stragglers, update STATUS. This is precisely what burst-workers drop at 00:10 at night. A Claude Code Stop-hook or a session-end habit ("never end a session ahead of origin") closes it.
4. **Cross-project permission bleed** (`.claude/settings.json` here is full of Pokémon-tool commands) suggests sessions get launched from whatever folder is open. Cheap fix: keep per-project folders' settings clean; put truly global allowances in user-level settings — the owner's own memory (`feedback_permissions.md`) already records this preference, and this repo violates it.

## What's repeated by hand that should be scripted/automated

- Applying migrations by pasting into the Supabase SQL editor (plan line 633 documents this as the process). Fine at n=2 migrations; SparkPlay's plans run to `0020_...` — adopt `supabase db push` / CLI migration flow before that pain compounds.
- Two-account E2E testing (plan line 108): a repeated 10-step manual ritual with no checklist file. At minimum write it down (it was promised); ideally make it a Playwright script an agent maintains.

## The single biggest upgrade available

**Close the generate→execute loop: when an agent produces an executable artifact (audit, plan, punch list), the same session — or an immediately-dispatched one — executes it, and CI guards the result.** Concretely, this week: one Claude Code session pointed at `AUDIT_REPORT.md` ("execute steps 1–6, answer step 7's question to me at the end"), plus the 20-line CI workflow. Everything about how this owner works says artifacts age silently once the burst ends; automation that survives between bursts is worth more to them than any additional generation quality.

## What's working (receipts)
- Plan quality and reuse discipline (plan lines 133–142); AGENTS.md guardrail; audit-as-agent-prompt format; memory hygiene (8 curated memory files with an index).

## What's not (receipts)
- Generated work orders don't get executed (audit, 3 days, 0/7 steps).
- No automation survives between sessions (no CI, no hooks, no scheduled anything in this repo).
- Session hygiene collapses at burst-end (`ahead 1` for 23 days; audit uncommitted).

## Improvements (ranked by leverage)
1. **Dispatch the audit to an agent now** · evidence above · effort **S** (one prompt).
2. **Add CI** (tsc/eslint/build on push) · audit L4 already specs it · effort **S**.
3. **End-of-session rule: commit + push, always** — consider a hook that warns when ending ahead of origin · evidence: 23-day unpushed milestone · effort **S**.
4. **Adopt Supabase CLI migrations before SparkPlay's migration count makes paste-and-pray expensive** · plan line 633 · effort **M**.

## STOP doing
Stop commissioning new analysis artifacts (audits, plans — including, yes, this one) before the previous artifact's actions are executed. The repo now contains more unexecuted expert guidance than executed code changes since June 26.

## Top-3 for this area
1. Run the audit through an agent this week.
2. CI on push.
3. Never end a session with unpushed commits.

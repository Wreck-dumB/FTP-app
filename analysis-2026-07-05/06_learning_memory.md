# 06 — Learning & Memory

## Do lessons persist? Verdict: yes — unusually well — but in the wrong place.

This owner has one of the better solo learning loops I've seen evidence of:

- **Lessons are captured with cause and rule.** Plan file line 140: the `database.types.ts` pattern "**must include `Relationships: []` per table… this caused a real TS bug in FTP; don't repeat it**" — a bug hit once, converted into a checked rule for the next project. That is exactly what a learning system is for.
- **Patterns are promoted, not re-derived.** SparkPlay's plan (lines 133–142) explicitly lists which FTP files to copy (Supabase SSR clients, proxy, auth actions, protected layout, tsconfig/eslint versions) instead of re-solving them. The invite/security-definer pattern from `0001`/`0002` is re-adapted per-child in the parent-portal plan (line 258) with the philosophy named ("narrow function over broad policy").
- **Security lessons compound visibly.** FTP's migration 0001 shipped UPDATE policies without `with check` (the audit's C2/H2). The SparkPlay parent-portal plan, written later, is saturated with exactly the countermeasures: "Deliberately NO update policy," `with check` everywhere, per-phase verification gates with real test accounts, an explicit threat model. The FTP mistakes were *learned from* — they just weren't *fixed where they were made* (0003 still doesn't exist).
- **Even incidents persist:** the plan records a prompt-injection attempt found in cached FTP build files (line 227) — noticed, disregarded, documented.
- **Session memory is curated:** 8 memory files with an index, including behavioral feedback (autonomy preferences, permissions rules).

**Same problem solved twice?** No clear instance found. The one near-miss is the reverse: a problem solved *forward* (RLS `with check` discipline in SparkPlay plans) while the original instance stays broken (FTP C1/C2). The repo doesn't re-learn — it learns and moves on without back-porting.

## The gap: everything lives outside the repo

The plan, the lessons, the status, the decisions — all in `C:\Users\Drust\.claude\plans\` and `C:\Users\Drust\.claude\projects\...\memory\`. The repo itself carries a **stock README**, no STATUS, no DECISIONS, no TESTING.md. Consequences:

- The knowledge isn't backed up with the code (GitHub has the code minus M3; nothing has the plan file — single-machine artifact, see 07).
- The knowledge is only accessible *through Claude on this machine*. A different tool, a different machine, or the owner reading GitHub in a browser sees none of it.
- The repo's one in-repo knowledge artifact done right is `AGENTS.md` (the Next.js 16 warning) — proof the owner knows the pattern; it just wasn't extended to product knowledge.

## Cheapest memory habit that would compound

**When a decision or lesson is made, write one line in the repo it belongs to, then commit it with the work.** Concretely three files, all tiny:
1. `STATUS.md` — state / next action / last-touched (also the fix for the portfolio drift in 04).
2. `DECISIONS.md` — append-only, one line per decision ("2026-06-1x: invites are bearer-token; email binding deferred — see audit M1").
3. A real `README.md` — setup steps that currently exist nowhere (audit L3 already outlines the sections).

That's the whole habit. It converts the already-excellent Claude-side memory into repo-side memory that survives machines, tools, and time — and it costs ~2 minutes per session.

## What's working (receipts)
- Bug→rule conversion (plan line 140); pattern promotion (lines 133–142); security-lesson compounding (parent-portal RLS style vs 0001's); incident logging (line 227); curated session memory (MEMORY.md index).

## What's not (receipts)
- Repo-side memory is a stock README, 24 days stale (audit L3, still unfixed).
- Lessons don't trigger back-porting: `with check` discipline exists in newer plans while `0001_initial_schema.sql:359-361` stays vulnerable.
- The 968-line plan file — the single richest knowledge artifact — has zero backups (one copy, one machine, outside any git repo).

## Improvements (ranked by leverage)
1. **Copy the plan file's FTP section into the repo** (e.g. `docs/PLAN.md`) and commit — instant backup + repo-side memory · effort **S**.
2. **Adopt the 3-file habit** (STATUS / DECISIONS / real README) · effort **S**.
3. **When a lesson is learned in project B about a pattern from project A, file a one-line fix task against A** — the C1/C2 back-port rule · effort **S** per instance.

## STOP doing
Stop keeping operational knowledge exclusively in `~/.claude`. It's a cache, not an archive: point-in-time, machine-local, invisible to git. (The memory files even warn about their own staleness.)

## Top-3 for this area
1. Plan file into the repo, committed.
2. STATUS.md + DECISIONS.md habit.
3. Back-port lessons to the project that taught them.

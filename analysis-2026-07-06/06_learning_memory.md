# 06 — Learning & Memory

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

---

## Where lessons are stored

### What's working: the Claude Code session memory system

The `~/.claude/projects/d--Projects-First-idea/memory/` directory contains structured memory files that persist across sessions:

- `feedback_autonomy.md` — "proceed on routine decisions without asking, only flag plan/design deviations"
- `feedback_permissions.md` — "Edit+Write must always be in global settings.json allow list"
- `project_ftp_overview.md` — FTP project context
- `project_sparkplay_pending.md` — SparkPlay pending features (document upload, parent portal phases)
- `project_paper_trading_bot.md`, `project_pokemon_card_investing.md`, `project_adhdan_merch_store.md`, `project_adhdan_streaming.md` — project contexts
- `MEMORY.md` — index

This is a genuinely good system. The `AGENTS.md` in each project provides AI-facing context about framework conventions (Next.js 16 breaking changes). The session memory means Claude Code doesn't need re-briefing on project decisions, preferences, or status.

**But all of it lives in `~/.claude` on one machine, outside any git repo.** This is the critical limitation: the memory system is better than notes in a notebook, but it shares the same single-machine risk as everything else.

---

## Evidence of the same problem solved twice

### FTP → SparkPlay RLS learning (positive transfer, receipt)

SparkPlay's RLS design is demonstrably more sophisticated than FTP's. FTP's RLS had two critical vulnerabilities (C1, C2 in `AUDIT_REPORT.md`): the family_members INSERT policy allowed any authenticated user to insert themselves into any family. SparkPlay uses `has_service_role(_owner_user_id, _min_role)` — a security-definer helper that re-derives authorization from the database's own tables at every request, not a client-supplied value. The lesson from FTP's gap was learned and applied.

**Receipt:** `AUDIT_REPORT.md:34-54` (C1 finding) vs `sparkplay/supabase/migrations/0016_staff_rbac_foundation.sql` (has_service_role pattern). The lesson transferred forward.

### Where the same mistake persists (negative: FTP lesson not back-ported)

**The FTP RLS vulnerabilities are still live.** The lesson learned (RLS gaps are dangerous) did not trigger fixing the project that taught the lesson. The back-port never happened. The correct sequence would have been: discover problem in FTP → fix FTP → apply better pattern in SparkPlay. The actual sequence was: discover problem in FTP → document it → build better pattern in SparkPlay → leave FTP broken.

**Receipt:** `AUDIT_REPORT.md` exists and is detailed. `0001_initial_schema.sql:355-357` still contains the vulnerable INSERT policy. No `0003_security_hardening.sql` exists.

### READMEs not updated as features ship (repeated across all projects)

Four of five projects have stock `create-next-app` READMEs or no README after significant feature work. This is the same mistake made in FTP, SparkPlay, and effectively adhdan-store (which has a real README but it was written once and hasn't been updated as features were added). The lesson "write the README" does not appear to have landed anywhere except the pokemon tool (which has an extremely detailed per-version changelog in the README).

**Receipt:** `First idea/README.md` — stock; `sparkplay/README.md` — stock; both flagged in their respective audits/plans.

---

## Does the repo re-learn things?

Partially. The session memory system captures some lessons. The AGENTS.md captures the Next.js 16 breaking-changes lesson and appears in every project — that lesson clearly landed.

But the learning is **unidirectional and AI-facing.** Lessons go into `~/.claude/memory/` where they help Claude Code give better future answers. They do not go into:
- The project's git history (commits don't explain why decisions were made)
- The project's README or DECISIONS.md (no such files exist in any project)
- Test coverage (what was broken once becomes testable — but no tests exist)

The RLS lesson is the clearest example: it improved the *next* project's design, but didn't produce a test that would catch the same error in any project, and didn't fix the project where it was found.

---

## What's the cheapest memory habit that would compound

**Write one sentence at the end of each session in a `DECISIONS.md` at the root of each active repo.**

Example format:
```
2026-07-05: EYLF outcomes changed from grid to dropdown — 17 outcomes too wide for form
2026-07-06: White noise placed in app layout (not page) so it persists across navigation
```

This is not a big habit. It takes 30 seconds. It:
- Creates a searchable decision log that survives machine failure (it's in git)
- Gives future sessions (human or AI) a "why" for non-obvious choices
- Creates an automatic record of what changed in each session without needing to read the diff
- Would have prevented the "why does this work this way?" cold-start problem

The pokemon tool already does something close to this — its README has a per-version changelog that reads almost exactly like this. It's the most re-readable of all the project docs.

**The secondary habit worth forming:** After any analysis or audit document is produced, write a companion `ACTION.md` with just the top 3 items and a checkable checkbox. Not a full plan — three items, checkboxes. Analyses without actions are expensive documentation.

---

## What to STOP doing

**Stop storing architectural knowledge only in session memory.** The session memory is one machine, one tool, one vendor. Any of these disappears and the context for every project disappears with it. The AGENTS.md files (Next.js warnings) are a good example of the right habit — they're committed to git and tool-agnostic. Apply that same habit to decisions.

---

## Top 3 for this area

1. **Add `DECISIONS.md` to SparkPlay and maintain it per session** — receipts for non-obvious decisions, 30 seconds/session, survives everything. First step: create the file with the last 5 decisions you can remember.
2. **Execute the FTP audit** — the lesson was learned (SparkPlay is better), but it hasn't been applied to the project that taught it. Back-porting is the cheapest way to prove a lesson was actually learned. First step: open FTP repo, dispatch Claude Code with `AUDIT_REPORT.md`.
3. **Commit the `~/.claude/plans/nifty-munching-gosling.md` plan file into the relevant repos** — or at minimum, add it to a synced notes service. It's the most critical single file in the operation and it's only on one machine. First step: `git add` a copy of the relevant section to each project's root.

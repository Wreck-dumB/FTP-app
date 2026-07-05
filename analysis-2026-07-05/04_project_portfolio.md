# 04 — Project Portfolio

**Scope caveat:** only the FTP repo was readable. But the evidence *inside* this folder (the shared plan file, this repo's `.claude/settings.json`, session memory) names five sibling projects, so the portfolio view below is FTP-in-detail plus siblings-by-evidence. Sibling states are inferred, not audited.

## The portfolio, as visible from here

| Project | Evidence | Apparent state |
|---|---|---|
| **FTP** (this repo) | 4 commits, plan §1 | Half-built: 3/11 milestones, stalled since 2026-06-26 |
| **SparkPlay** | Plan §2–4 (846 of the plan file's 968 lines); memory: doc-upload feature confirmed 2026-07-03 | **Alive** — three successive plans (MVP → parent portal → staff RBAC), migrations planned through `0020`, active 2 days ago |
| **Pokémon card investing** | This repo's `.claude/settings.json`: `pokeinvest`, `bigw_check.py`, `price_compare.py`, `track_watchlist.py`… | Working tool, research phase done (memory) |
| **Paper trading bot** | Memory | New/standalone |
| **ADHDan merch store** | Memory: "README has manual setup punch list" | Built, blocked on manual setup steps |
| **ADHDan streaming/OBS** | Memory | Side project |

Six projects, one person, evidence of **zero shipped to real users** across everything visible from this folder (SparkPlay is trialed personally at the owner's workplace per the plan — closest thing to shipped; still one user, the builder).

## Build-vs-ship ratio

For FTP specifically: ~1,936 lines of build, 0 lines shipped. Portfolio-wide, the visible pattern is **start → plan deeply → build the foundation → start the next thing**. Receipts:
- FTP: excellent plan (June 11), foundation built in one night, one more milestone two weeks later, then silence — while the *same plan file* grew three SparkPlay plans behind it.
- The plan file is a literal stratigraphy of attention: FTP plan (lines 1–120), then SparkPlay MVP, then SparkPlay parent portal, then SparkPlay staff RBAC — each newer section longer and more sophisticated than the last. FTP's section is now 12% of its own plan file.

## Per-project: what blocks the natural next state

**FTP → next state is a decision, then either M4 or an explicit pause.**
- Blocking (if continuing): AUDIT_REPORT.md step 1–2 (security), then Milestone 4. Nothing technical blocks this — the audit is agent-executable, the schema for M4–7 already exists. The blocker is purely allocation of the owner's attention, which the git cadence shows is elsewhere.
- Blocking (if pausing): 10 minutes — push the branch, commit the audit, write STATUS.md. Currently it's in the worst state: neither advancing nor safely parked (unpushed commit, unfixed criticals, dead links).

**SparkPlay → appears to be the real primary project.** The design work in the plan file (RLS-per-phase verification gates, threat models) is markedly more mature than FTP's — the owner's skills are compounding *there*. Not audited here.

**Pokémon tool → working; its natural next state is "used on a schedule"** (it has watchlist/tracking scripts). No blocker visible from here.

**ADHDan merch → blocked on a human punch list** per memory (Stripe/Printful setup). Classic 90%-built-0%-live.

## Alive vs zombie

- **Alive:** SparkPlay (activity 2 days ago).
- **Stalled-but-warm:** FTP (audit 3 days ago shows intent; no feature motion in 9+ days, no push in 23).
- **Unknown from here:** Pokémon, trading bot, merch, streaming.
- **Zombie risk:** FTP becomes a zombie the moment the audit report ages out like the NavBar links did. It is 1–2 weeks of neglect away.

## What the docs say matters vs what the commits say

The memory/docs say FTP is "a business." The commits say FTP got 3 days of attention in 3.5 weeks and SparkPlay got the design depth. The docs and behavior disagree, and nobody has reconciled them in writing. That reconciliation — not code — is this portfolio's most overdue artifact.

## The honest "archive this" candidate

**FTP itself is the candidate — for an explicit *pause*, not deletion.** The case: SparkPlay has a live personal user (the owner's workplace), a real differentiator validated by research, and momentum; FTP has a crowded competitor space (OurFamilyWizard, TalkingParents, 2houses…), no users, and stalled cadence. Two early-stage businesses at once, solo, around a day job, is one too many. The counter-case: FTP's remaining work is mostly UI over a finished schema, and its plan is genuinely good. Either answer is defensible; **having no answer is the only wrong state**, and that's the current state.

If nothing else: ADHDan streaming/OBS is a hobby, not a portfolio item — keeping it mentally filed as "project" inflates the WIP count for no gain.

## What's working
- Plans are high quality and each project has one (plan file, memory index).
- Pattern reuse across projects is deliberate and documented (plan lines 133–142: SparkPlay explicitly imports FTP's proven auth/proxy/types patterns, including a recorded TS bug to not repeat). The portfolio compounds *technically* even when individual projects stall.

## What's not
- WIP limit is effectively 6; ship count is 0.
- Attention shifts are silent — no project ever gets a written "paused/dropped" verdict, so each keeps a background claim on attention (and each stalls in an unsafe state, per FTP's unpushed/unfixed condition).

## Improvements (ranked by leverage)
1. **Institute a one-line status ritual:** every project folder gets STATUS.md with `state: active|paused|archived`, `next action`, `last touched` · evidence: FTP's silent drift, memory's growing project list · effort **S**.
2. **Pick the ONE business** (evidence favors SparkPlay) and demote the other to explicitly-paused · evidence: plan-file stratigraphy, git cadence · effort **S** (emotionally M).
3. **Ship one thing to one real external user this month** — cheapest candidate visible: finish the ADHDan merch punch list, or deploy FTP's skeleton · evidence: portfolio-wide ship count of 0 · effort **M**.

## STOP doing
Stop starting new projects while zero are shipped. The memory index gained the paper-trading bot and Pokémon tool *after* FTP stalled. Every new start re-divides the same solo attention that already can't push a commit.

## Top-3 for this area
1. Write STATUS.md in FTP (active-or-paused, decided).
2. Concentrate business energy on one of FTP/SparkPlay explicitly.
3. Get one project — any project — into a stranger's hands.

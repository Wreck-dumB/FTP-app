# 05 — Workflow & AI Leverage

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

---

## How they actually work

**Evidence sources:** git commit timing, commit message patterns, Claude Code session memory (`~/.claude/projects/`), Claude settings, AGENTS.md in each project, the session memory showing conversation patterns.

### Work pattern
Commits cluster in bursts: multiple commits in a single evening or early morning, then silence for days. This is consistent with a day-job constraint — real work happens in ~2–4 hour blocks after hours or on weekends.

June 26 was a notable burst day: commits appeared across FTP, adhdan-store, paper-bot, and pokemon-tool in the same day — a "tidy and initialize" session rather than deep feature work. SparkPlay's cadence suggests more sustained late-night sessions (~2 commits/day at peak, June 26–30).

**The session memory shows Claude Code is used as a persistent pair programmer,** not a one-shot tool. The memory system captures user preferences, feedback, project context, and decisions across sessions. The `AGENTS.md` files in each project explicitly instruct the AI to read current docs before writing code.

### Actual workflow loop (inferred from commits + session patterns)
1. Open Claude Code in a project
2. Describe feature or problem
3. Claude Code implements, user reviews/approves/redirects
4. Commit (or don't — the uncommitted work evidence shows commits are sometimes deferred)
5. End session, often mid-state

The "end session mid-state" pattern is the most expensive habit. Session memory partially compensates, but uncommitted work and un-pushed commits mean the loop never formally closes.

---

## Current AI leverage level: **delegated tasks** (with strong capability for orchestrated agents, rarely exercised)

**Evidence:** The FTP security audit (`AUDIT_REPORT.md`) was written explicitly formatted as an agent-executable work order ("written so a Sonnet-class agent can action it without additional context"). It has not been executed. This is the clearest signal: the capability for orchestrated-agent execution is understood and partly wired, but the trigger discipline isn't there.

**What's working well:**
- Full feature generation from specification — SparkPlay's 22 commits represent genuine AI-generated code that compiles, types-checks, and functions
- Design-level AI participation — the RLS design, security-definer patterns, and RBAC architecture all show collaborative decision-making, not just code generation
- Knowledge persistence across sessions — the memory system means "Claude knows the project context" without re-briefing
- Tool use / structured output — the Anthropic API integration in SparkPlay uses forced tool use and structured JSON output, which is more sophisticated than basic chat-completion usage
- Audit commission — the FTP audit was produced at a level that would cost $2,000–$5,000 from a specialist

**What's working poorly:**
- **Execution discipline** — work orders get written and not dispatched. This is the biggest leverage gap.
- **Loop closure** — sessions end before commits; commits end before pushes. AI does the building but the developer does the ops, and the ops keep getting skipped.
- **No automated validation** — TypeScript checks are run manually when needed; no CI means regressions go undetected between sessions.
- **No end-of-session ritual** — the work pattern would benefit from a simple close ritual (commit, push, update TODO). Currently absent.

---

## Where they're the bottleneck

The AI is doing the building. The human is the bottleneck for:

1. **Pushing commits** — git push requires one command. 19 SparkPlay commits are local-only. This is a 10-second action that has not happened in 19 days.
2. **Executing audits** — `AUDIT_REPORT.md` was written for agent execution. Opening a Claude Code session and pasting "Execute steps 1–6 from AUDIT_REPORT.md" would likely complete in under 2 hours. This has not happened.
3. **Account setup for ADHDan** — Printful, Stripe, Vercel. These require human authentication and judgment, not code. But they're blocking a complete deployable product.
4. **Deciding FTP status** — No AI can make this call. Writing a STATUS.md with a verdict takes 5 minutes.
5. **Deployment** — `vercel --prod` or equivalent for SparkPlay. One command, one URL.

**The pattern:** the AI is being used maximally for generation and minimally for the operational tail of each task (the last 5% of a task that turns "built" into "live"). The human is the bottleneck for the exact 5% that matters most.

---

## What they repeat by hand that could be a script/automation

1. **Git push** — there is a Stop hook capability in Claude Code settings. A hook that runs `git status` and warns on un-pushed commits at session end is achievable and would take 10 minutes to set up.
2. **TypeScript check before commits** — manual `npx tsc --noEmit` is done when remembered. A pre-commit hook or a PostToolUse hook on Write/Edit that flags type errors would catch them earlier.
3. **Searching for where something is in the codebase** — session memory stores patterns, but there's no documented architecture map in any repo. A brief `ARCHITECTURE.md` or even an up-to-date comment in `src/lib/` would reduce cold-start research time.
4. **Re-explaining project context** — the `AGENTS.md` + session memory system handles this well already. This is one of the stronger workflow habits.
5. **Pokemon tool data collection** — this is already automated (Windows Task Scheduler). The gap is the data has no off-machine backup.

---

## The single biggest upgrade available at current level

**Install a Claude Code Stop hook that enforces session closure: check for uncommitted changes, unpushed commits, and report both.**

Receipt for why this matters: SparkPlay has 19 unpushed commits over 19 days. The single risk that could wipe all of this is a disk failure. The single change that eliminates it is `git push` — a command that takes 3 seconds. The reason it doesn't happen is that it's not part of the session-end ritual.

A Stop hook configured in `~/.claude/settings.json` that runs `git status` and reports "X uncommitted files, Y commits ahead of origin" at the end of every Claude Code session would surface this information exactly when the developer is wrapping up. This is the highest-leverage available change because:

- Effort: Small — 20 minutes, or a Claude Code `/config` session
- Evidence: The exact gap it closes is the #1 risk across 4 of 5 projects
- It doesn't change how work is done, it adds a friction point at the right moment
- It works even if the underlying habit (push daily) never improves

This doesn't replace the discipline of pushing — it creates a ten-second opportunity to push that currently doesn't exist.

---

## What to STOP doing

**Stop running full portfolio analyses before actioning the previous one.**

Receipt: `analysis-2026-07-05/` was generated yesterday. Its top-10 list had "Push and commit everything, today" as #1. Today's `git status` shows nothing has been pushed. This analysis is the second in two days; the first produced a comprehensive action list that went unused. The insight-to-action ratio is worse than zero — it builds a false sense of progress.

Each analysis takes ~30–60 minutes of AI context and produces a document that goes unread. The correct action after yesterday's analysis was to close the laptop, open a terminal, run `git push` for both repos with remotes, and commit/push the `AUDIT_REPORT.md`. That's it. A comprehensive re-analysis the next day doesn't help.

**Future rule:** One analysis per project, then work from it until it's clearly wrong. Don't re-analyze; do.

---

## Top 3 for this area

1. **Add a Stop hook for git status** — 20-minute setup, eliminates the 19-day "never pushed" risk pattern permanently. First step: open Claude Code, run `/config`, configure `Stop` hook with `git status` command.
2. **Execute `AUDIT_REPORT.md` steps 1–6 in one session** — the document is formatted for agent execution. Open FTP repo, prompt Claude Code with the audit. Estimated: 1–2 hours. This closes a critical security gap and clears a 4-day-old unclosed loop.
3. **Adopt session-end ritual: commit, push, one-line status update** — not a hook, just a habit. End every session with these three actions before closing the tab. This is the root cause behind all three risk findings in report 07.

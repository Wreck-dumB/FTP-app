# 07 — Risk & Resilience

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

---

## Bus factor: one machine, one developer, limited redundancy

Everything in this portfolio runs on a single Windows 11 machine. Four of five scheduled jobs (Pokemon tool), two live Supabase databases, and every line of code all depend on this one machine being operational.

---

## Uncommitted / at-risk work inventory

### SparkPlay — CRITICAL RISK
**8 modified files + 2 untracked directories, not committed.**

Files modified in current session (none committed):
- `src/app/(app)/forms/page.tsx` — heading rename
- `src/app/(app)/generate/GenerateForm.tsx` — EYLF dropdown, count selector, quick list (multiple sessions of work)
- `src/app/(app)/layout.tsx` — WhiteNoiseProvider integration
- `src/app/(app)/recipes/RecipeGeneratorForm.tsx` — count selector, quick list
- `src/app/api/generate/route.ts` — count param
- `src/app/api/recipe/route.ts` — count param
- `src/components/layout/NavBar.tsx` — white noise indicator, forms rename
- `src/lib/anthropic.ts` — makeActivitiesTool, count scaling

Untracked (new files):
- `src/app/(app)/white-noise/` — full white noise page (new)
- `src/components/providers/` — WhiteNoiseProvider (new)

**These represent multiple Claude Code sessions of work. A power failure or disk event tonight loses them permanently.**

### SparkPlay — HIGH RISK: 19 commits never pushed
Receipt: `git status` shows `main` 19 ahead of origin. The origin (GitHub) still shows the initial scaffold as the latest commit. 19 commits spanning 2026-06-18 to 2026-07-01 — essentially the entire project — exist only on this one machine.

### FTP — MODERATE RISK
`AUDIT_REPORT.md` is untracked. 2 commits ahead of origin (the analysis folder commit + 1 other). The audit document is the most valuable artifact in this repo and it's not in git.

### ADHDan — HIGH RISK: no git remote + uncommitted work
No remote configured. 5 modified files + 3 untracked items uncommitted. The entire codebase exists on one machine with no backup of any kind.
Receipt: `git remote -v` returns nothing.

### Pokemon Tool — HIGH RISK: no remote, live data accumulating
No remote configured. Four scheduled tasks are running and writing to `data/card_history.json` daily — accumulating unique price history data that cannot be reconstructed. The entire v14 codebase and all accumulated data exist on one machine.
Receipt: `git remote -v` returns nothing; README describes `Pokeinvest-TrackWatchlist` writing daily to `data/card_history.json`.

### Paper Bot — LOW RISK
Clean working tree, no remote, but no live data accumulating. Loss would be recoverable from the two commits' code. Low risk.

---

## Secrets hygiene

| File | Risk |
|------|------|
| `D:\Projects\sparkplay\.env.local` | Supabase URL + anon key + Anthropic API key — correct location, gitignored, not read |
| `D:\Projects\First idea\.env.local` | FTP Supabase URL + anon key — correct location, gitignored |
| `D:\Projects\adhdan-store\.env.local` | Stripe keys + Printful key — correct, gitignored |
| `D:\Projects\paper-trading-bot\.env` | Alpaca paper API keys — correct, .gitignore present |
| `D:\Projects\pokemon-card-investing\tool\discord_webhook.txt` | **FLAG: webhook URL in git repository** |
| `C:\Users\Drust\.claude\settings.json` | Supabase PAT — correct location (noted in session memory as never to copy to project dirs) |

**The one concrete secrets issue:** `tool/discord_webhook.txt` is committed to the pokemon tool's git repository. Currently this is a local-only repo, so the exposure is contained. But if a remote is ever added (which it should be for backup), this URL is in the git history and would be immediately public. Fix before adding a remote: `git filter-repo` to remove the file from history, add `tool/discord_webhook.txt` to `.gitignore`.

---

## Half-deployed things that will break silently

**SparkPlay Supabase instance (`jjxrwbxrkfpiaiiqrmth`):** The database exists and is live (referenced in session memory as the production Supabase project). It has 20 migrations. It may have real educator data in it from development/testing. The codebase that reads it has never been deployed — but the database is live. If a Supabase project is "free tier," there are data retention and pausing policies. A free Supabase project that's unused for a period may be paused by Supabase, silently deleting data.

**FTP Supabase instance:** Same concern. Database is live with critical RLS vulnerabilities (C1, C2). Not a half-deployment in the usual sense — but a live database with known exploitable holes is a worse state than "not deployed."

**Pokemon Tool scheduled tasks:** Four Windows Task Scheduler jobs run hourly/daily on this machine. They fire Discord webhook notifications to presumably a real Discord server. If the machine is offline, the jobs silently fail. If the webhook URL rotates or expires, the jobs fail silently. Neither failure mode is currently handled.

---

## Two-week illness scenario

If this machine went offline for two weeks:

| Project | What breaks | Recoverable? |
|---------|------------|--------------|
| SparkPlay | All 19+ commits lost. Session work since last commit also lost. Supabase DB may pause (free tier). | Partial — Supabase may recover if not paused; code is gone |
| FTP | 2 commits lost, AUDIT_REPORT.md lost. Supabase DB may pause. | Partial |
| ADHDan | Entire codebase lost. No remote, no backup. | No |
| Pokemon Tool | 4 scheduled jobs stop firing. Discord alerts stop. Accumulated price history lost. | Code is gone; history is gone |
| Paper Bot | Code is gone. No active data loss. | Code reconstructable from scratch |

**The honest answer is: most of what's been built in the last 25 days has no meaningful backup.**

---

## What to STOP doing

**Stop treating "it's in git locally" as a backup.** A git repository on one machine is not a backup — it's a second copy on the same failure domain. The backup is the remote. `git push` is the backup action. Four of five projects don't have remotes; two of the ones that do are 2–19 commits ahead.

---

## Top 3 for this area

1. **Push SparkPlay to origin immediately** — `git push origin main` from the sparkplay directory. After this, 19 commits worth of work are safe. This should happen before this analysis session ends. First step: commit the current session's work, then push.
2. **Add GitHub remotes to adhdan-store and pokemon-tool** — but fix `discord_webhook.txt` in the pokemon tool first (remove from history or at minimum add to .gitignore before the first push). Adhdan-store is straightforward: new GitHub repo, `git remote add origin`, `git push`. First step: create both GitHub repos.
3. **Check SparkPlay's Supabase free tier status** — free Supabase projects pause after inactivity. If the project is on a free plan and hasn't been accessed recently, confirm it's not at risk of being paused. Upgrade to the Pro tier if SparkPlay is meant to be a real product. First step: log into the Supabase dashboard and check the project status.

# 04 — Project Portfolio

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

---

## Build-vs-ship ratio

| Project | Features built | Deployed to users | Ratio |
|---------|---------------|-------------------|-------|
| SparkPlay | 22 commits, 50+ routes, 20 migrations, AI integration, RBAC, parent portal | 0 | **∞:0** |
| ADHDan Hub | Full storefront + checkout + fulfillment automation + multi-section brand hub | 0 | **∞:0** |
| Pokemon Tool | v14, 14 major iterations, 11 scrapers, web app, 4 scheduled jobs | Self only | **∞:0.1** |
| FTP | 3 of 11 milestones, clean auth + family + invite | 0 | **∞:0** |
| Paper Bot | Working skeleton | Self only (paper account) | **∞:0.1** |

**Summary:** Five projects, zero external users, zero revenue, zero deployed instances with a public URL. The build-to-ship ratio is unmeasurable because the denominator is effectively zero.

---

## Per-project: state, blocker, alive vs zombie

### SparkPlay — **ALIVE (the anchor)**

- **Current state:** Most mature project. Full SaaS-grade feature set for early childhood educators. Last commit July 1 (5 days ago). 8 modified files + 2 untracked directories (this session's work) not yet committed.
- **What's blocking its natural next state (personal trial → deploy):**
  1. 19 commits never pushed — data loss risk stops comfortable iteration
  2. Never deployed to Vercel — no URL means no trial user (even yourself using a production build)
  3. No README — makes returning to it cold harder than it should be
  4. Uncommitted session work — ongoing risk
- **Alive or zombie:** Alive. Commits every 2–3 days. Clear problem space. Genuine enthusiasm visible in the feature set (white noise, EYLF dropdown, quick list — these are *user experience* improvements, not scaffolding).
- **Honest "archive this" candidate:** No. This is the right project to push.
- **What would make this real in the next 2 weeks:** Push all commits, deploy to Vercel, use it yourself for one week at work. That's it.

---

### FTP — **ZOMBIE (stalled 10 days, security holes live, predecessor to SparkPlay)**

- **Current state:** Milestone 3 of 11. Auth + family + invites work. NavBar links to 3 nonexistent routes. Two critical RLS vulnerabilities in the live Supabase instance. Security audit produced but unexecuted. Last feature commit: June 26 (10 days ago).
- **What's blocking its natural next state:**
  1. Active inattention — every day since June 26 has gone to SparkPlay
  2. Critical security work (`AUDIT_REPORT.md`) produced but not dispatched to an agent
  3. No deployed instance means no forcing function for real testing
  4. The plan is 11 milestones; committing to finishing it means deprioritizing SparkPlay (a different product for the same target audience in some respects)
- **Alive or zombie:** Zombie. The last-commit-date is the wrong signal here; the tell is that the security audit sat for 4 days unexecuted. When a project's critical maintenance gets skipped for another project's features, the project is functionally parked.
- **The uncomfortable question:** FTP and SparkPlay are both education/family apps built with identical stacks on identical infrastructure. They address different problems, but they compete for the same finite builder hours. The plan file contains both in one document (`nifty-munching-gosling.md`). There is no written decision about which one is "the" business.
- **What should happen:** Either (a) dispatch an agent to execute `AUDIT_REPORT.md` steps 1–6, add a clear `STATUS.md` saying "FTP is on hold, SparkPlay is active," and archive-but-preserve; or (b) decide FTP is done and archive it. Do not maintain it in a half-audited, never-deployed, never-pushed state indefinitely.

---

### ADHDan Hub — **DORMANT (code-complete, nearest to deployable of any project)**

- **Current state:** Full-featured personal hub. 6 POD products, checkout, fulfillment automation, multi-section brand hub, non-technical editing guide. 0 steps of the README's 7-step punch list executed. Uncommitted changes since June 26.
- **What's blocking its natural next state (go live):**
  1. Account setup not done (Printful, Stripe) — no technical blocker, pure to-do
  2. Vercel not deployed — one command (`vercel --prod`) once env vars are set
  3. Artwork at 150 DPI (testing quality) — README explicitly says bump to 300 DPI before real sales
  4. No git remote — if the machine dies today, everything is lost
- **Alive or zombie:** Dormant. There is no active development happening, but it's not abandoned — the EDITING.md and content restructure (uncommitted since June 26) show intentional maintenance. The issue is the 7-step deploy punch list, not motivation.
- **Honest assessment:** This is the fastest path to something live in this entire portfolio. Estimated 4–8 hours to deploy a real working store. The technical risk is near zero — the code is done. The only effort is account creation and config.
- **What should happen:** Commit the uncommitted work, push to a new GitHub remote, create the Stripe/Printful accounts, deploy to Vercel. This could be done in an afternoon.

---

### Pokemon Tool — **IN PRIVATE PRODUCTION (personal use, actively running)**

- **Current state:** v14. Four Windows Task Scheduler jobs running hourly/daily. Accumulating real price history data. Used for actual investing research. No remote backup.
- **What's blocking its natural next state:**
  - The "natural next state" for this project is just continuing to use it — it's already doing what it was built for. There's no intended external user.
  - The real blocker is resilience: one machine failure loses 14 versions of code + accumulated `data/card_history.json` price history.
- **Alive or zombie:** Alive and in use. This is the healthiest project in terms of "built for a purpose and delivering on it."
- **Honest assessment:** The single change needed here is adding a GitHub remote. Everything else is fine.
- **Risk note:** `tool/discord_webhook.txt` is committed to git. If a remote is ever added without cleaning history, the webhook URL is public. Fix before adding a remote.

---

### Paper Trading Bot — **SKELETON (demo-grade, not in active use)**

- **Current state:** 2 commits (June 26), demo strategy, no evidence of regular use.
- **What's blocking its natural next state:**
  - The strategy is explicitly a demo. Using it meaningfully requires replacing the SMA crossover with something researched.
  - No regular use is evidenced — no commit since the scheduler bugfix.
- **Alive or zombie:** Skeleton. The tool works, but there's no signal that it's running or being iterated on.
- **Honest "archive" candidate:** Yes. This is the cleanest archive candidate: it builds, runs, has an honest README, has no external dependencies at risk, and can be resumed trivially if motivation returns. Archiving it doesn't mean deleting it — it means adding `STATUS: skeleton/learning project, not in active development` to the README and not counting it as a live obligation.

---

## Git cadence: what they work on vs what the plan says matters

The plan file (`nifty-munching-gosling.md`) allocates roughly equal attention to FTP and SparkPlay as two separate businesses. The git cadence tells a completely different story:

- SparkPlay: 22 commits across 19 days, averaging >1 commit/day
- FTP: 4 feature commits across 15 days in June, then stopped
- Everything else: 2–3 commits in a single day (June 26), then dormant

**What they actually work on:** SparkPlay, with occasional multi-project burst days (June 26 saw commits across FTP, adhdan-store, paper-bot, and pokemon-tool simultaneously — a "tidy the portfolio" day).

**What the docs say matters:** FTP and SparkPlay equally, plus the ADHDan brand.

**The gap:** FTP is described in the plan as a business; it has not received a feature commit in 10 days. SparkPlay is getting all the energy and is the natural candidate for "the project."

---

## Honest archive candidate

**Paper trading bot** is the cleanest archive candidate. It's functional, has an accurate README, poses no maintenance risk, and has no active use signal. Archiving it reduces mental overhead without losing anything.

**FTP** is the most important decision point, but "archive" is the wrong word — "decide" is the right one. The choice is: (a) execute the audit and continue, or (b) explicitly pause with a status note. Either is better than the current indefinite drift.

# 01 — Inventory

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06 · Scope: All five repos under `D:\Projects\`

---

## Folder map

| Path | What it is |
|------|-----------|
| `D:\Projects\First idea` | FTP (Forward Thinking Parents) co-parenting web app — Next.js 16 + Supabase |
| `D:\Projects\sparkplay` | SparkPlay educator tool — Next.js 16 + Supabase + Anthropic API |
| `D:\Projects\adhdan-store` | ADHDan personal hub — Next.js 16, POD store + multi-section personal site |
| `D:\Projects\paper-trading-bot` | Python Alpaca paper-trading bot — SMA crossover demo |
| `D:\Projects\pokemon-card-investing` | Pokemon TCG investing tool — Python CLI + Flask web app |

---

## Per-project snapshot

### 1. SparkPlay (`D:\Projects\sparkplay`) — **Working, actively developed, uncommitted work at risk**

- **What it is:** Early childhood educator SaaS. Generates EYLF-linked activity ideas from materials on hand, manages children/observations/policies/QIP/risk assessments/forms/recipes/programs, parent portal (Phase 1), staff RBAC (Director/2IC/Staff).
- **Stack:** Next.js 16.2.9 · TypeScript · Tailwind v4 · Supabase (Postgres + Auth + Storage) · Anthropic Claude API
- **State:** Most mature project. 22 commits, June 18–July 1 (19 days). 50+ pages/routes. 20 database migrations. Full vertical slice from auth through parent portal through staff management.
- **Git status:** Branch `main`. **Remote: `github.com/Wreck-dumB/Educator-tool.git`.** 19 commits ahead of origin (last push was at initial scaffold, commit `40f736e`, June 18). Effectively nothing after the first day has been pushed. 8 modified files + 2 untracked directories as of session (white noise, nav rename, EYLF dropdown, count selector, quick list — several sessions of work).
- **Pages/routes built:**
  - Auth: `/login`, `/signup`, `/onboarding`
  - Core: `/generate`, `/activities`, `/children`, `/observations`, `/materials`, `/milestones`
  - Governance: `/policies`, `/risk-assessments`, `/safe-work-procedures`, `/qip`
  - Forms: `/forms`, `/incident-reports`, `/permission-slips`
  - Programs: `/programs`
  - Recipes: `/recipes`
  - Staff: `/staff`
  - Parent portal: `/parent/`, `/parent/permission-slips`, `/parent/signup`, `/parent/accept-invite/[token]`
  - White noise: `/white-noise`
- **Docs:** `AGENTS.md` (Next.js breaking-changes warning). No real README (stock `create-next-app`). No `TESTING.md`. No deployment URL recorded.
- **Tests/CI:** None.

---

### 2. FTP — Forward Thinking Parents (`D:\Projects\First idea`) — **Stalled at 22% of plan, security holes known but unpatched**

- **What it is:** Co-parenting coordination tool: shared calendar, swap requests, notifications, notes. Designed for separated parents managing custody schedules.
- **Stack:** Next.js 16.2.9 · TypeScript · Tailwind · Supabase
- **State:** Milestone 3 of 11 done (auth, family setup, invite flow). Last feature commit: `97c5060`, 2026-06-26. Then stalled. An analysis folder `analysis-2026-07-05` was generated 2026-07-05 (yesterday) but none of the top-10 recommendations from it are evidenced as actioned.
- **Git status:** Branch `main`. Remote: `github.com/Wreck-dumB/FTP-app.git`. **2 commits ahead of origin** (the analysis commit + 1 more). `AUDIT_REPORT.md` is untracked.
- **What's built:** Auth (signup/login/logout), family creation, family membership, invite flow (email-link), dashboard skeleton, NavBar (with three dead routes: `/calendar`, `/requests`, `/notes`).
- **What's planned but missing:** Calendar, swap requests, notifications, notes/reminders, child profiles UI, custody schedule engine, deploy.
- **Security:** `AUDIT_REPORT.md` (2026-07-02) identifies 2 Critical + 2 High + 7 Medium/Low vulnerabilities. C1: any authenticated user can insert themselves into any family (RLS). C2: members can move their row to any other family or escalate role. Both verified live. None of the 7 prescribed remediation steps have been executed.
- **Docs:** `AUDIT_REPORT.md` (substantial, written as an agent-executable work order). `CLAUDE.md` → `AGENTS.md` (Next.js warning). Master plan file (`~/.claude/plans/nifty-munching-gosling.md`, 1,000+ lines, **NOT committed to this repo**). README is stock template.
- **Tests/CI:** None.

---

### 3. ADHDan Store / Hub (`D:\Projects\adhdan-store`) — **Code-complete, not deployed, no remote backup**

- **What it is:** Personal multi-section hub: Merch (print-on-demand via Printful+Stripe), ConElevent (content/posts), Eating (food/recipes), Art (originals/prints), FTP cross-link. Evolved from a pure merch store into a personal brand aggregator.
- **Stack:** Next.js 16 · TypeScript · Tailwind · Stripe checkout · Printful fulfillment API
- **State:** Code-complete per README: full storefront, cart, checkout flow, Stripe webhook → Printful auto-fulfillment, 6 POD products, original brand SVGs, `scripts/sync-printful.ts` for automated product creation. README is a detailed, honest "what you need to do next" punch list.
- **Git status:** Branch `master`. **No remote configured.** 2 commits total (initial scaffold June 23, "Commit the ADHDan personal hub build" June 26). 5 modified files + 3 untracked items (including `EDITING.md`, `content/`, `scripts/check-content.ts`) — **uncommitted work since June 26**.
- **Deployment:** Not deployed. No `.vercel` config. The README instructs manual Vercel setup with env vars; none of those steps are evidenced as done.
- **Docs:** `README.md` is genuinely useful — real setup instructions, the exact punch list. `EDITING.md` is a non-technical editing guide. `AGENTS.md` (Next.js warning).
- **Tests/CI:** None.

---

### 4. Paper Trading Bot (`D:\Projects\paper-trading-bot`) — **Working skeleton, demo-grade only**

- **What it is:** Python bot that connects to an Alpaca paper (simulated) account and runs a simple SMA (simple moving average) crossover strategy. Intended for personal learning/experimentation, not real trading.
- **Stack:** Python 3 · Alpaca API · SQLite · APScheduler
- **State:** Functional baseline. 2 commits (initial baseline June 26 00:03, scheduler bugfix June 26 10:00). Strategy is explicitly labelled a demo (`strategy.py` comment: "not tuned for profitability and is not a recommendation"). Watches SPY and QQQ.
- **Git status:** Branch `master`. **No remote configured.** Clean working tree.
- **Docs:** `README.md` is accurate and honest about scope.
- **Tests/CI:** None. No live data validation.

---

### 5. Pokemon Card Investing Tool (`D:\Projects\pokemon-card-investing`) — **Sophisticated personal tool, actively used, no remote backup**

- **What it is:** Personal tool to identify undervalued Pokemon TCG cards/sealed products across Australian retailers. CLI tools + local web app + scheduled Discord webhook alerts.
- **Stack:** Python 3 · Flask web app · requests/BeautifulSoup scraping · Pokemon TCG API · Discord webhooks · Windows Task Scheduler
- **State:** Mature. v14, 3 commits, June 26. Built iteratively across 14 major versions. Covers: price ranking (sealed + singles), 11 AU retailer scrapers, Discord alerts, watchlist with price history, investment scoring, cross-retailer price comparison, advance notice from Drop Store calendar, full 20,359-card database.
- **Git status:** Branch `master`. **No remote configured.** Clean working tree.
- **Live automation:** Three Windows Task Scheduler jobs running hourly/daily (`Pokeinvest-BigWCheck`, `Pokeinvest-AUStockCheck`, `Pokeinvest-TrackWatchlist`). A fourth (`Pokeinvest-AdvanceNotice`) runs daily. These fire regardless of any Claude session — they're genuinely in production.
- **Docs:** README is detailed per-version changelog. `tool/README.md` exists. `tool/discord_webhook.txt` noted (flag: do not read — likely contains webhook URL credentials).
- **Tests/CI:** None. Some in-code synthetic validation tests noted in README.

---

## External references noted (not read)

- `.env.local` files in sparkplay and First idea (Supabase credentials)
- `.env.local` in adhdan-store (Stripe/Printful keys)
- `paper-trading-bot/.env.example` → `.env` (Alpaca API keys)
- `pokemon-card-investing/tool/discord_webhook.txt` (webhook credentials)

---

## Git remotes summary

| Project | Remote | Branch ahead of origin |
|---------|--------|----------------------|
| SparkPlay | github.com/Wreck-dumB/Educator-tool.git | **19 commits** |
| FTP | github.com/Wreck-dumB/FTP-app.git | **2 commits** |
| adhdan-store | None | N/A |
| paper-trading-bot | None | N/A |
| pokemon-tool | None | N/A |

**Three of five projects have no remote at all. The two that have remotes are significantly ahead of them.**

---

## Commit cadence summary

All five projects began between June 11–26, 2026. Total active development window: ~25 days.

SparkPlay: 22 commits, daily or near-daily, last commit July 1 (5 days ago). Active.  
FTP: 5 commits including one analysis commit, last feature commit June 26. Stalled 10 days.  
adhdan-store: 2 commits, last June 26. Dormant.  
paper-trading-bot: 2 commits, last June 26. Dormant (but clean).  
pokemon-tool: 3 commits, last June 26. Dormant (but live automation still running).

**The work pattern is clearly: build something to an acceptable milestone, pivot to SparkPlay, don't return.**

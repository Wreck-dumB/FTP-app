# 02 — Value Ledger

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

**Market rate sources (AU, accessed 2026-07-06):**
- Mid-level full-stack developer: AUD $66–80/hr (lancebase.io/freelance-web-developer-hourly-rate-australia)
- Senior/specialist: AUD $80–180/hr (devstree.com.au/dedicated-developer-rates-in-australia-for-market-insights-trends)
- Agency SaaS MVP (auth + DB + API): AUD $40,000–$90,000 standard; $90,000–$150,000+ with AI integration (decipherzone.com/blog-detail/saas-product-development-cost-australia; mintodes.com/blog/how-much-does-it-cost-to-build-an-mvp-2026)

**Rate used for time-based estimates:** AUD $75/hr (mid-senior, consistent with AI-assisted solo dev)

**Honesty notes applied throughout:**
- "Built" ≠ "deployed to production with real users" — discount applied accordingly
- AI-assisted development is faster than solo; hours reflect design + iteration + debugging, not wall-clock typing
- Prototype-grade (no tests, no CI, no real README) vs production-grade distinction made explicitly
- Uncommitted or unpushed work is flagged as "at risk" value, not guaranteed

---

## SECTION A — Shipped (deployed to production with real external users)

**Nothing in this portfolio is deployed to production with real external users as of 2026-07-06.**

No Vercel URL is recorded for any project. No deployment evidence exists in any repo. This section is empty by the analysis rules. The correct answer is $0 in delivered revenue or confirmed user value.

This is the single most important fact in this report.

---

## SECTION B — Working (deployed to a staging URL or demonstrably runnable, no external users yet)

### B1. SparkPlay — educator activity generator and centre management platform

**What exists:** Full authenticated SaaS application. 50+ pages/routes. 20 database migrations covering: EYLF-linked activity generation (Anthropic API, structured output, tool use), children profiles, saved activity library, observation logging, materials inventory, developmental milestones, program planner with cultural calendar, risk assessments, safe work procedures, policy builder with AI generation, QIP generator, forms library (EYLF-aware), enrolment records, incident reports (child + staff), digital permission slip signing (versioned, append-only), recipe generator (AI), materials stock tracking, parent portal (Phase 1: linking, permission slip signing), staff RBAC (Director/2IC/Staff with invite flow), white noise player, quick-list pinning, count selector for generation.

**Quality grade:** Prototype+ moving toward MVP. TypeScript passes `tsc --noEmit`. Code is clearly structured, security design is thoughtful (RLS with `has_service_role()`, `is_linked_parent()`, security-definer functions). Not production-grade: no tests, no CI, no real README, significant uncommitted work, never deployed.

**Time-based estimate:**
- Active build: 22 commits across 19 days, sessions likely 2–5 hours. Reasonable estimate: **80–100 hours** of meaningful design + iteration time.
- At AUD $75/hr: **$6,000–$7,500**
- Adjusted for AI leverage (honest): the raw feature count would take a solo mid-senior developer ~300–400 hours without AI assistance. AI-assisted execution compresses this, but the design decisions, iteration, debugging, and direction-setting are still human time. The $6,000–$7,500 represents what was paid for; the deliverable represents significantly more.

**Comparable (agency) estimate:**
- A digital agency in AU quoting this feature set (auth, 20 migrations, AI generation, RBAC, parent portal) without the AI generation would quote $60,000–$90,000.
- With the Anthropic API integration (structured tool use, recipe + activity + policy + QIP generators): $90,000–$130,000.
- Honest discount for prototype-not-production status: **40% off** → comparable value: **$54,000–$78,000**

**Caveat:** None of this is realised value. It's the cost to reproduce, not the value delivered. Until it has paying users, the economic value is closer to zero.

---

### B2. ADHDan Hub/Store — personal brand platform with POD fulfillment

**What exists:** Complete Next.js storefront. Home page (bento grid, animated brand elements, original SVGs). Merch section (6 POD products: 2 tees, hoodie, long sleeve, snapback, sticker pack). Cart drawer, Stripe checkout session, Stripe webhook → Printful auto-fulfillment. ConElevent (content/posts), Eating (food/recipes placeholder), Art (originals/prints), FTP cross-link. Custom brand SVGs (`BoltBrainMark`, `SkateBoltIcon`, `ChilliDropIcon`, `PaintSplashIcon`). `EDITING.md` guides for non-technical self-editing. `scripts/sync-printful.ts` for automated product creation.

**Quality grade:** Prototype+. Code-complete, the README is honest and accurate. Uncommitted changes since June 26 (EDITING.md, content/ restructure, check-content.ts) add functionality. Not deployed, no Stripe/Printful accounts connected, no env vars set, no `printful-sync.generated.json`.

**Time-based estimate:**
- 2 commits + uncommitted work, ~20–30 hours.
- At AUD $75/hr: **$1,500–$2,250**

**Comparable estimate:**
- Agency quote for a similar POD storefront (brand identity + checkout + fulfillment integration + content sections): $15,000–$25,000
- Discount 40% for prototype: **$9,000–$15,000**

**What's missing to go live:** Stripe account, Printful account, deploy to Vercel, run `npm run printful:setup`, one test order. Estimated real-world effort: **4–8 hours of account setup + testing**. This is the highest-leverage near-term deployable thing in the entire portfolio (lowest delta between current state and "live").

---

### B3. Pokemon Card Investing Tool — AU retail price intelligence and alerting

**What exists:** 14 iterated versions. CLI tools: `search.py` (card + sealed product search, price comparison, watchlist), `investment_picks.py` (cross-retailer ranking), `price_compare.py` (cross-retailer within-10% detection), `release_dates.py` (Drop Store advance notice), `track_watchlist.py` (daily price history). Web app (`webapp.py`) with search, watchlist chart, picks, calendar, price compare, sell listings pages. 11 retail scrapers (Big W, 8 Shopify stores, Toymate). Discord webhook alerts. Windows Task Scheduler integration (4 active scheduled jobs). Full Pokemon TCG card database (20,359 cards, 173 sets).

**Quality grade:** Personal-use production. This tool is genuinely running — scheduled tasks fire hourly. It does what it says. Not production-grade for a third party (no auth, no error handling guarantees, hardcoded data paths, no tests), but that was never the intent.

**Time-based estimate:**
- v14 across 3 commits June 26, but clearly built iteratively. Estimated **40–60 hours** of design + code + testing.
- At AUD $75/hr: **$3,000–$4,500**

**Comparable:** A custom business intelligence scraping tool with alert infrastructure and a web UI would quote $20,000–$35,000 from a specialist agency. This is a working personal tool, so comparable value is academic.

---

### B4. FTP — Forward Thinking Parents co-parenting app

**What exists:** Auth (signup/login/logout/session), family creation (via security-definer RPC), family membership, email invite flow, dashboard skeleton, NavBar. 3 database migrations. TypeScript clean, builds clean. Security audit (`AUDIT_REPORT.md`) identifying and describing all issues with agent-executable fixes.

**Quality grade:** Prototype (early). The foundation is clean and the security design is thoughtful — but it covers 3 of 11 planned milestones. The NavBar links to three routes that 404 (`/calendar`, `/requests`, `/notes`). Critical RLS vulnerabilities are identified and unpatched.

**Time-based estimate:**
- 4 feature commits across 15 days, likely 20–25 hours.
- At AUD $75/hr: **$1,500–$1,875**

**Comparable:** An agency quote for the equivalent (auth + family setup + invite) as a module of a larger app: $8,000–$15,000. Prototype discount makes this $5,000–$9,000 comparable. **The security audit itself has standalone value:** an agent-ready audit document written at this quality would cost $2,000–$5,000 from a specialist.

---

### B5. Paper Trading Bot

**What exists:** Python bot with Alpaca paper API, SMA crossover strategy, SQLite trade log, APScheduler scheduler. Functional baseline. Explicitly demo-grade strategy.

**Quality grade:** Functional skeleton. The README is honest and complete.

**Time-based estimate:** ~6–10 hours. At AUD $75/hr: **$450–$750**

**Comparable:** Similar educational-grade trading bot: $500–$2,000 freelance. This is accurately priced as a learning project.

---

## SECTION C — Planned (documented intent only, no code)

**Nothing in this portfolio is "planned but not started."** All five projects have working code. The items in Section C are features within existing projects:

- FTP Milestones 4–11 (custody calendar, swap requests, notifications, notes, deploy) — no code, only plan
- SparkPlay document upload + AI feedback feature (noted in memory, no code yet)
- SparkPlay parent portal Phases 2–4 (observation sharing, messaging, wall) — no code
- ADHDan: Eating section is placeholder content only

These are not valued here; they are planned work, not delivered work.

---

## Summary table

| Project | Section | Time Est. (hrs) | Time-based AUD | Comparable AUD (discounted) | Status |
|---------|---------|----------------|----------------|-----------------------------|--------|
| SparkPlay | B | 80–100 | $6,000–$7,500 | $54,000–$78,000 | Working, never deployed |
| ADHDan Hub | B | 20–30 | $1,500–$2,250 | $9,000–$15,000 | Working, never deployed |
| Pokemon Tool | B | 40–60 | $3,000–$4,500 | (personal tool; n/a) | In local production use |
| FTP | B | 20–25 | $1,500–$1,875 | $5,000–$9,000 | Working, stalled, security holes |
| Paper Bot | B | 6–10 | $450–$750 | (learning project; n/a) | Working, demo-grade |
| **Total** | | **166–225** | **$12,450–$16,875** | | |

**The honest number:** ~$13,000–$17,000 of time invested. ~$54,000–$78,000 of comparable reproduction cost for SparkPlay alone. **$0 in realised revenue or demonstrable external value** because nothing is deployed.

The gap between those numbers is the mission-critical problem. This is not a skills gap. It is a deployment gap.

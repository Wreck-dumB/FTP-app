# 02 — Value Ledger

Everything in this repo, honestly priced. Rule applied throughout: **shipped ≠ in-progress ≠ planned**, and prototype-grade work is discounted as such. All figures AUD.

## Market-rate basis (web-sourced 2026-07-05)

- AU freelance rates: junior $50–80/h, mid-level $80–120/h, full-stack $80–150/h — [lancebase.io](https://lancebase.io/freelance-web-developer-hourly-rate-australia/), [abbacustechnologies.com](https://www.abbacustechnologies.com/web-developer-rates-in-australia-for-2026/) (accessed 2026-07-05).
- AU agency MVP quotes: simple MVP AUD $15k–40k; local-agency lean SaaS MVP $80k–150k; offshore $15k–50k — [decipherzone.com](https://www.decipherzone.com/blog-detail/saas-product-development-cost-australia), [mintodes.com](https://mintodes.com/blog/how-much-does-it-cost-to-build-an-mvp-2026), [appinventiv.com](https://appinventiv.com/blog/mvp-app-development-in-australia/) (accessed 2026-07-05).

## SHIPPED (in users' hands)

**Nothing. $0.**
No deployment exists in evidence: no `.vercel/` directory, no production URL anywhere in the repo, README is the stock template, and plan Milestone 11 ("Deploy & real-world test") is 8 milestones away. Receipt: `README.md` (stock), plan file lines 87–98, absence of any deploy config in the file map (01_inventory).

## IN PROGRESS (built, working locally, not shipped)

### Asset A — Auth + family/invite foundation (Milestones 1–3)
What exists and works (per commits dabf720…97c5060 and the 2026-07-02 audit's verification: `tsc`, lint, and `next build` all clean):
signup/login/logout with email confirm, session-refreshing proxy, protected layout, family creation, member listing, email-token invite flow with anon-safe preview (`0002_invite_preview.sql`), accept-invite page.

- **Time-based:** a mid-level dev familiar with Supabase SSR patterns would take roughly 25–40 hours to reach this point at this quality. At $80–120/h → **$2,000–4,800**.
- **Comparable-based:** this is roughly the "accounts + team/tenant + invites" slice of an agency MVP — commonly the first 2 of 8–16 weeks. Against a $15k–40k simple-MVP quote, the delivered slice ≈ **$3,000–7,000**.
- **Honest discount:** prototype-grade. The 2026-07-02 audit found **2 critical RLS holes** (any authenticated user can join any family — `0001_initial_schema.sql:355-361`), an open redirect (`src/app/auth/actions.ts:11,19`), error-swallowing data access (`src/lib/supabase/family.ts` — verified: all four functions ignore `error`), no tests, no CI. An acquirer's technical diligence would demand the audit's fix list be completed before calling this production-grade. **Discounted value: ~$1,500–3,500.**

### Asset B — Database schema + RLS + RPC layer (all 11 milestones' worth)
`0001_initial_schema.sql` is the single most valuable file in the repo: 10 tables covering the entire MVP domain (custody cycles, overrides, swaps, notifications, notes), family-scoped RLS on all of them, and 5 security-definer functions including an atomic `accept_swap_request`. The recurrence design (pattern + overrides instead of materialized calendar rows, plan line 51) is genuinely sound modeling.

- **Time-based:** 10–15 hours of competent data-modeling + RLS work → **$800–1,800** at mid rates.
- **Discount:** the two critical policies (C1/C2) mean the RLS layer fails its one job until migration 0003 exists. Value survives mostly as design, not as security. **Discounted: ~$600–1,200.**

### Asset C — Documentation & process artifacts
- `AUDIT_REPORT.md` — a severity-ranked, file:line-precise security audit with per-finding acceptance criteria, written to be executable by an agent. A security review of this scope from a contractor would bill 4–8 hours ($400–1,000+). Real but **unrealized** value — zero findings actioned in the 3 days since (no `0003` migration, no `safeNext`, `family.ts` unchanged).
- FTP section of the plan file — a solid product/tech spec (~120 lines). Comparable "discovery phase" work is quoted at $5k–15k by agencies ([mintodes.com](https://mintodes.com/blog/how-much-does-it-cost-to-build-an-mvp-2026)); this is a lean solo version, call it **$500–1,500** of equivalent value — but note it lives outside the repo (risk, see 07).

**In-progress subtotal (discounted, skeptical-accountant version): ≈ AUD $3,000–6,500** of embodied build value. The undiscounted "what would an agency charge to get here" number is $4,500–10,000 — the ~40% haircut *is* the security debt, test debt, and README/ops debt.

## PLANNED (worth $0 until built — listed to size the gap)

Milestones 4–11: child profiles, recurrence engine, calendar, swap-request UI, notifications, notes, dashboard, deploy. That's the part an agency would price at the *remaining* $12k–30k of a simple-MVP quote — and it includes every feature a user would actually pay for. The differentiating product (calendar + swaps) is 0% built in UI terms, even though its schema and RPCs already exist (Asset B).

## What's working (receipts)
- Build health is real: audit header records `tsc --noEmit`, `eslint`, `next build` all clean at 97c5060.
- The schema-first approach front-loaded the hardest thinking; Milestones 4–7 are mostly UI on top of existing tables.

## What's not (receipts)
- $0 shipped after 3.5 weeks; the only user-visible "product" is a dashboard stub that says features will appear "once they're built" (`src/app/(app)/dashboard/page.tsx:18-20`).
- The valuation above is capped by the audit's unfixed criticals — for a **custody app**, C1/C2 aren't line items, they're disqualifiers until fixed.

## Improvements (ranked by leverage)
1. **Execute AUDIT_REPORT.md steps 1–2** (migration 0003 + safeNext) — converts ~$1.5–3k of discount back into value · evidence: audit §CRITICAL/§HIGH verified against live code · effort **S** (the audit was explicitly written for an agent to execute).
2. **Ship Milestone 11 early as a walking skeleton** (deploy what exists to Vercel behind the existing auth) — turns $0 shipped into a live URL and surfaces env/deploy issues while the app is small · evidence: plan M0 promised a hello-world deploy that never evidently happened · effort **S/M**.
3. **Build Milestone 5 (recurrence engine) next, with the promised unit tests** — it's the highest-value asset per hour (pure logic, schema already done, plan line 110 already commits to tests) · effort **M**.

## STOP doing
Stop writing schema/design for features 8 milestones ahead of the UI. Asset B is nice, but 7 of 10 tables have sat UI-orphaned since June 11 while accruing audit findings (H2 exists *only* because unused tables have live, flawed UPDATE policies). Design-ahead created attack surface, not value.

## Top-3 for this area
1. Fix the criticals (recovers the discount).
2. Deploy the skeleton (moves the first item out of "$0 shipped").
3. Don't add another table until an existing one has a screen.

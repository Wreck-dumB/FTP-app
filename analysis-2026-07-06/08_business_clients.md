# 08 — Business / Clients

**Analyst:** Claude (Sonnet 4.6) · 2026-07-06

No evidence of current clients, revenue, or active business relationships exists in any repo. No invoices, contracts, client credentials, API keys for client systems, or communication artifacts are present.

---

## Revenue intent: where it exists

Three of five projects have explicit revenue intent or commercial infrastructure:

### SparkPlay — **Clearest commercial intent, most developed, $0 revenue**

The plan file describes a SaaS business: educators pay for access, potentially centre-based licensing. The tool has the feature depth of a paid SaaS (RBAC, parent portal, AI generation, governance documents). The landing page (`src/app/page.tsx`) has login/signup CTAs.

**Pricing gap:** No pricing page, no subscription infrastructure (no Stripe), no trial-to-paid conversion flow. The plan mentions "trial it personally at own workplace" as Milestone 10. No pricing has been decided, documented, or built. For a product this mature (50+ routes, RBAC, parent portal), the absence of any pricing design is notable. An app at this feature level in the AU EdTech market would typically be priced $30–$80/month per centre, or $10–$20/month per educator.

**The gap between what report 02 says this is worth ($54,000–$78,000 to reproduce) and what it earns ($0) is entirely the deployment gap.** There is no structural reason this can't have paying users — the only missing piece is a production deploy and someone using it.

### ADHDan Hub — **Immediate revenue possible, $0 revenue**

Stripe checkout is wired. Printful fulfillment is automated. 6 products are defined at real prices ($32–$58 for apparel, ~$8 stickers). The README says this can self-fulfill a sale with zero manual intervention once deployed.

**Estimated time to first possible revenue:** 4–8 hours of account setup. This is the highest-leverage commercial opportunity in the portfolio by that metric — no new code needed, just configuration.

**Pricing:** Already set in `content/products.ts` — $32 tees, $58 hoodie. These are reasonable for AU POD pricing; Printful's typical base cost for a tee is ~$15–18 AUD, yielding ~$14–17 margin per sale. The pricing is not undercutting itself.

**Missing:** No email capture is wired (README: "`/api/subscribe` currently just logs signups server-side"). No social presence or promotion evident in any file. A store with no audience has no customers regardless of how good the code is.

### Pokemon Tool — **Personal use, no revenue intent, no risk**

Explicitly personal. No pricing, no external users, no commercial gap to close. This section doesn't apply.

---

## Undeployed assets audit

| Asset | What blocks revenue | Time to fix | Revenue potential |
|-------|--------------------|-----------|--------------------|
| SparkPlay (full SaaS) | No Vercel deploy, no pricing, no Stripe | ~8–16 hrs (deploy + pricing + Stripe) | Medium-high if educators actually use it |
| ADHDan Store | No Stripe/Printful accounts, no Vercel deploy | ~4–8 hrs (account setup only) | Low-moderate (hobby/brand merch) |
| ADHDan email capture | `/api/subscribe` logs only, no ESP | ~2 hrs (wire Resend/Mailchimp) | Enables future marketing |
| FTP | Security holes, 8 milestones unbuilt | Months | None until MVP is complete |

---

## Pricing discipline assessment

**SparkPlay:** Pricing hasn't been thought about at all. For an AU early childhood education tool, the reference market is: Storypark (widely used, $99–$299/month per service), Xplor (enterprise, $300+/month), and newer tools in the $20–$80/month range. SparkPlay's feature set (especially the AI generation + EYLF + RBAC) differentiates it. A price of $29–$49/month per service (with a free trial) would be reasonable for a beta phase and would cover infrastructure costs at very modest usage. This decision doesn't need to be made today, but it needs to exist before any deploy.

**ADHDan:** Pricing is set and appropriate. No change needed.

---

## What to STOP doing

**Stop building features before deploying.** SparkPlay has 50+ routes, RBAC, a parent portal, and a white noise player. It has never been used by a single real educator. Features built on zero user feedback may be entirely the wrong features — or entirely right, but there's no way to know without a real user. The next feature to build should be the deploy, not document upload.

---

## Top 3 for this area

1. **Deploy SparkPlay to Vercel with a free trial flow** — receipt: 50+ routes, zero users; plan file says "trial personally" is Milestone 10 but this is artificially late. Push to Vercel now, use it yourself at work. First step: commit + push all work, then `vercel --prod` from the sparkplay directory.
2. **Deploy ADHDan Hub to go live** — highest-leverage commercial action in the portfolio given the 4–8 hour remaining effort. Set up Printful + Stripe, deploy, place one test order. First step: create a Printful account (free, takes 10 minutes).
3. **Write a one-page pricing + positioning decision for SparkPlay** — not a full business plan; just the answer to: "who pays, how much, what's free." This decision gates every future commercial feature. First step: write it as a `PRICING.md` in the repo.

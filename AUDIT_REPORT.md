# Codebase Audit Report — Forward Thinking Parents (FTP)

**Date:** 2026-07-02
**Scope:** Entire repository at commit `97c5060` (Milestone 3: invite flow)
**Verification status at audit time:** `npx tsc --noEmit` ✅ clean · `npm run lint` ✅ clean · `npm run build` ✅ clean (Next.js 16.2.9, Turbopack)

---

## Audit prompt used

> Conduct a comprehensive audit of this codebase (a Next.js 16 + Supabase co-parenting MVP). Before judging any Next.js usage, read the bundled docs in `node_modules/next/dist/docs/` — this Next.js version differs from training data (e.g., Middleware is now `proxy.ts`). Audit across these axes:
> 1. **Security** — auth flows, open redirects, server-action authorization, secret handling, injection surfaces.
> 2. **Database / RLS** — every RLS policy and security-definer function in `supabase/migrations/`: can a user read or write rows outside their family? Check INSERT `with check`, UPDATE policies missing `with check` (Postgres reuses USING for new rows), and whether RPC state machines can be bypassed by direct table writes.
> 3. **Framework correctness** — Next 16 conventions (proxy, async `searchParams`/`params`, server actions, revalidation, error/loading boundaries).
> 4. **Correctness & robustness** — swallowed errors, dead links, inconsistent invariants (e.g., one-family-per-user), edge cases in invite lifecycle.
> 5. **Operational readiness** — env-var footguns, README accuracy, tests, CI.
>
> Verify the codebase compiles (`tsc --noEmit`), lints, and builds. Produce a severity-ranked report (Critical/High/Medium/Low) with exact `file:line` references, a concrete fix per finding, and acceptance criteria, written so a Sonnet-class agent can action it without additional context.

---

## Instructions for the implementing agent

- **Read `AGENTS.md` first.** This project's Next.js (16.2.9) has breaking changes vs. your training data. Consult `node_modules/next/dist/docs/` (App Router section: `01-app/`) before writing any Next.js code. Notably: Middleware is renamed **Proxy** (`src/proxy.ts`), and `params`/`searchParams` are **Promises** that must be awaited.
- **Never edit existing migration files** (`0001`, `0002`) — they may already be applied. All schema/policy changes go in a **new** migration, e.g. `supabase/migrations/0003_security_hardening.sql`.
- When you change RLS or functions, mirror any signature changes in `src/lib/types/database.types.ts` (hand-written types, see header comment in that file).
- After all changes, verify: `npx tsc --noEmit`, `npm run lint`, `npm run build` must all pass.
- Findings marked **[DECISION]** need product-owner confirmation before implementing; implement everything else directly.

---

## CRITICAL

### C1. Any authenticated user can insert themselves into any family (RLS)

**File:** `supabase/migrations/0001_initial_schema.sql:355-357`

```sql
create policy "Users can insert their own membership"
  on public.family_members for insert
  with check (user_id = auth.uid());
```

The policy only checks `user_id = auth.uid()` — it does **not** check family membership or an invite. Any authenticated user who learns a `family_id` (UUIDs can leak via URLs, logs, support screenshots) can call PostgREST directly with the anon key and insert themselves into that family **with any role, including `parent`** (the column CHECK allows it). That grants full read/write access to that family's children, custody schedules, and notes — catastrophic for a custody app.

The app never inserts into `family_members` from the client; memberships are only created inside the `security definer` RPCs `create_family_with_owner` and `accept_family_invite`, which **bypass RLS entirely**. The policy is therefore pure attack surface.

**Fix (new migration 0003):**
```sql
drop policy "Users can insert their own membership" on public.family_members;
```
Then confirm the app still works: family creation and invite acceptance go through the two RPCs, which are unaffected by RLS.

**Acceptance criteria:** a direct `POST /rest/v1/family_members` with a valid user JWT is rejected; `create_family_with_owner` and `accept_family_invite` still succeed.

### C2. Members can move their membership row into any family / escalate role (RLS)

**File:** `supabase/migrations/0001_initial_schema.sql:359-361`

```sql
create policy "Members can update their own membership row"
  on public.family_members for update
  using (user_id = auth.uid());
```

There is no `with check`, so Postgres reuses the USING expression for the new row — which still passes as long as `user_id` stays the caller's. A user can therefore `UPDATE` their own row and set `family_id` to **any other family** (same break-in as C1) or set `role = 'parent'` (privilege escalation within their own family).

**Fix (new migration 0003):** the update policy exists so members can edit their `display_name`/`color`. Lock the sensitive columns with column-level grants:
```sql
revoke update on public.family_members from authenticated;
grant update (display_name, color) on public.family_members to authenticated;
```
(Keep the row policy as-is; column grants now prevent touching `family_id`, `user_id`, `role`.)

**Acceptance criteria:** updating own `display_name`/`color` succeeds; any UPDATE that includes `family_id`, `user_id`, or `role` is rejected with a permissions error.

---

## HIGH

### H1. Open redirect via `next` parameter (login, signup, auth callback)

**Files:**
- `src/app/auth/actions.ts:11,19` — `login()` does `redirect(next)` with `next` taken raw from form data. `redirect()` accepts absolute URLs, so `/login?next=https://evil.example` sends a freshly-authenticated user to an attacker site (classic phishing pivot).
- `src/app/auth/actions.ts:27,34` — `signup()` embeds the same unvalidated `next` into `emailRedirectTo`.
- `src/app/auth/callback/route.ts:7,13` — `NextResponse.redirect(`${origin}${next}`)`. With `next=@evil.example`, the result `http://host@evil.example` parses host = `evil.example` (userinfo trick). `next=//evil.example` is also risky depending on URL normalization.

**Fix:** add a shared sanitizer, e.g. in `src/lib/utils/redirects.ts`:
```ts
/** Only allow same-origin path redirects. */
export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("@"))
    return fallback;
  return value;
}
```
Apply it in `login()`, `signup()`, and `auth/callback/route.ts` before any `redirect(...)` and before embedding `next` in `emailRedirectTo`.

**Acceptance criteria:** `next` values of `https://evil.example`, `//evil.example`, `@evil.example`, `/\evil.example` all fall back to `/dashboard`; a legitimate `next=/accept-invite/<token>` still round-trips through login → redirect correctly.

### H2. Direct table UPDATE lets members bypass invite/swap state machines (RLS)

**Files:** `supabase/migrations/0001_initial_schema.sql:372-374` (family_invites), `:471-473` (swap_requests), `:346-348` (families)

All three UPDATE policies are `using (public.is_family_member(...))` with no `with check` and no column restrictions. Consequences:

- Any member can set `family_invites.status = 'accepted'` directly, or extend `expires_at` arbitrarily, without going through `accept_family_invite`.
- Any member can flip `swap_requests.status` directly (e.g., mark their own request `accepted`) **without** the corresponding `custody_overrides` being written — the whole point of the `accept_swap_request` RPC is that these happen atomically. In a custody context, a silently "accepted" swap with no override is a real-world scheduling dispute.
- Any member can rewrite `families.created_by`.

**Fix (new migration 0003):** column-level grants, keeping state transitions RPC-only:
```sql
revoke update on public.family_invites from authenticated;
grant update (status) on public.family_invites to authenticated; -- needed for revokeInvite

revoke update on public.swap_requests from authenticated;
grant update (message) on public.swap_requests to authenticated; -- or nothing; see note

revoke update on public.families from authenticated;
grant update (name) on public.families to authenticated;
```
Note on invites: the app's `revokeInvite` (`src/app/(app)/family/actions.ts:69-78`) updates `status` directly, so `status` must stay updatable — but then a member could still set `status='accepted'` by hand. That is now harmless: acceptance-by-status-flip doesn't create a membership (only the RPC does), so the worst case is a cosmetically mislabeled invite. If you want it airtight, replace `revokeInvite`'s table update with a small `revoke_family_invite(_id uuid)` security-definer RPC that only allows `pending → revoked`, and revoke UPDATE on the table entirely.
Note on swap_requests: cancellation by the requester ("cancelled" status) will eventually need either an RPC or a scoped policy — the swap UI isn't built yet, so an RPC (`cancel_swap_request`) is the recommended pattern when that milestone lands.

**Acceptance criteria:** a member cannot change `family_invites.expires_at`, `swap_requests.status`, or `families.created_by` via direct PostgREST update; `revokeInvite` still works from the Family page.

---

## MEDIUM

### M1. [DECISION] Invite acceptance ignores the invited email

**File:** `supabase/migrations/0001_initial_schema.sql:222-254` (`accept_family_invite`)

The RPC matches on token + pending + unexpired but never compares the caller's email to `invited_email`. Anyone holding the link joins the family. The UI (`src/app/(app)/family/page.tsx:102-105`) explicitly says links are copied and sent manually, so bearer-token semantics may be intended — but for a custody app, consider binding: add `and lower(auth.jwt() ->> 'email') = lower(_invite.invited_email)` check (raise a clear exception otherwise). **Ask the product owner before implementing;** if bearer semantics are kept, document the decision in the README.

### M2. `accept_family_invite` burns the invite even when membership wasn't created

**File:** `supabase/migrations/0001_initial_schema.sql:242-248`

`insert ... on conflict (family_id, user_id) do nothing` followed by unconditionally setting `status='accepted'`. If the accepting user is already a member (e.g., double-submit, or accepting a second invite), the invite is consumed with no effect. Low-harm but confusing. **Fix:** check `found` / row count after insert; if no row inserted, still mark accepted but this is fine to leave — the better fix is to raise `'You are already a member of this family'` so the UI explains it. Also consider marking *other* pending invites for the same (family, email) accepted/expired at the same time, and preventing duplicate pending invites at creation (`createInvite` in `src/app/(app)/family/actions.ts:54-59` happily creates duplicates — add a partial unique index `on family_invites (family_id, lower(invited_email)) where status = 'pending'` in migration 0003 and map the conflict error to a friendly message).

### M3. Data-access layer swallows all database errors

**File:** `src/lib/supabase/family.ts` (all four functions)

Every query destructures `{ data }` and ignores `error`. A DB outage or RLS misconfiguration renders as "family has no members" / `null` family rather than an error — and `getCurrentFamilyMember()` returning `null` on error **redirects a logged-in user with a family into `/family/setup`** (`src/app/(app)/dashboard/page.tsx:5-8`), where they could create a duplicate family. **Fix:** destructure `{ data, error }` and `throw error` (or throw a wrapped `Error`) in all four functions, then add error boundaries (M4) to present failures. `getCurrentFamilyMember` must distinguish "no membership row" (return `null`) from "query failed" (throw).

### M4. No `error.tsx`, `not-found.tsx`, or `loading.tsx` anywhere

**Files:** `src/app/**` (absent)

Any thrown error (including the throws introduced by M3) hits Next's default error screen. **Fix:** add at minimum `src/app/error.tsx` (client component, generic "something went wrong" + reset button), `src/app/(app)/error.tsx`, and `src/app/not-found.tsx`, styled consistently with the existing gray/blue Tailwind look. Read `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md` first for the current conventions.

### M5. One-family-per-user is assumed by the app but not enforced by the schema

**Files:** `src/lib/supabase/family.ts:13-18` (`limit(1).maybeSingle()`), `supabase/migrations/0001_initial_schema.sql:196-219` (`create_family_with_owner`)

The schema allows a user to belong to many families (unique is `(family_id, user_id)`, not `user_id`), and `create_family_with_owner` never checks for an existing membership — but the app picks an arbitrary membership with `limit(1)` (no `order by`, so nondeterministic). A user in two families would see one at random. **Fix (short-term, matches MVP):** in `create_family_with_owner`, raise an exception if `exists (select 1 from family_members where user_id = auth.uid())`; add the same guard at the top of `accept_family_invite` with a friendly message. Add `order by created_at` to `getCurrentFamilyMember` as a determinism backstop. (Multi-family support is a product decision for later.)

### M6. Raw Supabase/Postgres error messages surfaced to end users

**Files:** `src/app/(app)/family/actions.ts:26,62`, `src/app/(auth)/accept-invite/[token]/actions.ts:24`, `src/app/auth/actions.ts:16,39`

`error.message` is URL-encoded into `?error=` and rendered verbatim. Postgres errors leak constraint/function names ("duplicate key value violates unique constraint family_invites_..."), and the same `?error=` channel renders **any** attacker-crafted string inside the app's styled alert box (phishing text injection — React escapes HTML, but plain text like "Your account is locked, call 1-800-…" renders fine). **Fix:** switch to short error **codes** in the query string (`?error=invite_expired`) and map codes → friendly copy in the page components; log the raw message server-side with `console.error`. Unknown/absent codes render a generic message — this simultaneously kills the arbitrary-text injection.

### M7. Proxy login redirect drops the intended destination

**File:** `src/proxy.ts:39-43`

An unauthenticated hit on `/family` redirects to `/login` with no `next`, so after login the user always lands on `/dashboard`. The login action already supports `next` (H1 sanitizer applies). **Fix:** `url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search)` before redirecting.

---

## LOW

### L1. NavBar links to routes that don't exist
**File:** `src/components/layout/NavBar.tsx:15-23` — `/calendar`, `/requests`, `/notes` 404. These are future milestones; either remove the links until built or render them as disabled "coming soon" spans.

### L2. `NEXT_PUBLIC_SITE_URL` silently falls back to localhost in production
**Files:** `src/app/auth/actions.ts:28`, `src/app/(app)/family/page.tsx:33` — invite links and email-confirm redirects would point to `http://localhost:3000` if the env var is missing in prod. **Fix:** create `src/lib/env.ts` exporting `siteUrl` that throws at startup when `process.env.NODE_ENV === "production"` and the var is unset; use it in both places. Also add a `.env.example` documenting `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

### L3. README is the stock create-next-app template
**File:** `README.md` — no mention of Supabase setup, migrations, or required env vars. Rewrite with: project description, prerequisites, env vars (referencing `.env.example`), how to apply `supabase/migrations/`, and dev/build commands.

### L4. No tests or CI
Nothing under test anywhere. Cheapest wins first: unit tests for `src/lib/utils/dates.ts` (pure functions, timezone edge cases around DST) and for the H1 `safeNext` sanitizer. RLS policy tests (via `supabase test` / pgTAP or a script hitting a local Supabase) are the highest-value tests this project can have given C1/C2 — add once the 0003 migration exists. Add a GitHub Actions workflow running `tsc --noEmit`, `eslint`, `next build`, and tests.

### L5. Server actions don't explicitly verify auth
**Files:** `src/app/(app)/family/actions.ts:8-30` (`createFamily`), `:69-78` (`revokeInvite`), `src/app/(auth)/accept-invite/[token]/actions.ts`
The bundled Next docs (`01-app/01-getting-started/07-mutating-data.md`, warning block) say to verify authentication inside **every** server function since they're directly POST-able. These actions currently rely on RLS/RPC failure for unauthenticated callers (safe but produces ugly raw errors). **Fix:** start each with a `getUser()` check and `redirect("/login")` — `createInvite` already models this pattern at `src/app/(app)/family/actions.ts:47-52`.

### L6. `color` and text inputs stored without validation
**Files:** `src/app/(app)/family/actions.ts:13`, `src/app/(auth)/accept-invite/[token]/actions.ts:11`, rendered at `src/app/(app)/family/page.tsx:55` as an inline style. Browsers drop invalid CSS values and React sets properties individually, so risk is minimal — but validate `^#[0-9a-fA-F]{6}$` (fall back to `#3b82f6`) and cap `name`/`display_name` length (e.g., 80 chars) in the actions, plus `varchar`/`check` constraints in migration 0003 if desired.

### L7. Invite `expires_at` is client-settable on insert
**File:** `supabase/migrations/0001_initial_schema.sql:368-370` — the INSERT policy doesn't constrain `expires_at`, so a member could hand-craft an invite valid for years. Members-only and low impact; fold a column grant into the 0003 migration (`revoke insert`, `grant insert (family_id, invited_email, invited_role, invited_by)`) if convenient.

---

## Suggested execution order for the implementing agent

1. **Migration `0003_security_hardening.sql`**: C1, C2, H2, M2 (partial unique index), M5 (guards in both RPCs), optionally L7. One migration, heavily commented.
2. **H1 + M7**: `safeNext` util, apply in 3 call sites + proxy `next` preservation.
3. **M3 + M4**: throw on DB errors, add error/not-found boundaries.
4. **M6**: error-code mapping across all actions/pages (subsumes the L5 pattern — do L5 in the same pass).
5. **L1, L2, L3, L6**: quick cleanups.
6. **L4**: tests + CI.
7. **M1**: present the email-binding question to the product owner; implement per answer.

After each numbered step: `npx tsc --noEmit && npm run lint`, and `npm run build` at the end. If you change SQL function signatures, update `src/lib/types/database.types.ts` (Functions block starts at line 272).

## What was checked and found healthy

- `src/proxy.ts` correctly uses the Next 16 `proxy` convention (named export + matcher); public-path logic is exact-match safe (`/` doesn't wildcard).
- All pages correctly `await` the Promise-based `params`/`searchParams` (Next 16 requirement).
- Supabase SSR client setup (`server.ts`, `client.ts`, proxy cookie handling) follows the current `@supabase/ssr` `getAll`/`setAll` pattern; session refresh in proxy uses `getUser()` (not `getSession()`), which is the secure choice.
- `(app)/layout.tsx` re-verifies auth server-side rather than trusting the proxy — good defense in depth.
- Secrets: only the anon key is used anywhere; no service-role key in the repo; `.env*` is gitignored and nothing sensitive is committed.
- RLS is enabled on all ten tables; SELECT policies are correctly family-scoped; `get_invite_preview` (migration 0002) is a well-scoped security-definer that avoids opening invite SELECT to anon.
- `accept_swap_request` / `decline_swap_request` RPCs check membership and pending status correctly (the gap is direct-update bypass, H2 — not the RPCs themselves).
- Type-check, lint, and production build all pass with zero warnings.

# Pre-Launch Checklist

Complete this checklist before announcing FTP to early users.

## Database & Security ✅

- [ ] All three Supabase migrations applied (`0001` → `0002` → `0003`)
- [ ] Run `/api/health` endpoint and verify all checks pass
- [ ] Test RLS policies: log in as one user, verify other users' families are hidden
- [ ] Rotate Supabase keys if they were exposed anywhere
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.gitignore` and confirm not in any commits

## Deployment ✅

- [ ] Repo linked to Vercel and deployed
- [ ] All env vars set in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] Vercel deploy succeeds with green status
- [ ] Visit deployed URL and verify landing page loads
- [ ] CI workflow (`.github/workflows/ci.yml`) runs on push and passes

## Core Flows ✅

- [ ] Sign up works → receive email confirmation (if configured)
- [ ] Create family → invite another user
- [ ] Accept invite via email link
- [ ] Calendar page loads and is keyboard-navigable (arrow keys)
- [ ] Demo CTA on landing page points to a valid demo URL (or skip if not deployed yet)

## Privacy & Accessibility ✅

- [ ] Privacy summary visible on landing page
- [ ] Accessibility audit note linked from footer
- [ ] Run Lighthouse on `/calendar` and fix critical issues
- [ ] Test with keyboard only: Tab through all pages, arrow keys on calendar
- [ ] Test on mobile (iOS Safari, Android Chrome): responsive layout, touch-friendly buttons

## Operational ✅

- [ ] Health check endpoint available at `/api/health`
- [ ] Feedback form appears and submits (at minimum, console logs)
- [ ] Error boundary catches crashes gracefully (not tested yet — add before launch)
- [ ] Build completes without warnings: `npm run build` succeeds

## Demo Data ✅

- [ ] Seed demo users and family (via `npm run seed:demo` or `/api/seed`)
- [ ] Demo login works with seeded credentials
- [ ] Demo user can view calendar and create swaps (if implemented)

## Documentation ✅

- [ ] `DEPLOYMENT.md` is clear and complete
- [ ] `DEMO.md` explains how to seed data
- [ ] `STATUS.md` is up to date with current milestone
- [ ] `README.md` on landing is inviting and has quick-start

## Launch Go / No-Go ✅

- [ ] All checks above completed
- [ ] At least 2 external users have tested
- [ ] No critical bugs reported
- [ ] **Decision**: Ship to public URL or wait for more features?

---

**Post-Launch Monitoring**

- Set up Sentry for error tracking
- Monitor `/api/health` weekly
- Log user feedback from feedback form
- Track deploy times and error rates in Vercel dashboard

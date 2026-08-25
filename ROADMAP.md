# Prioritized Roadmap (short-term → medium-term)

Core MVP (next 2–4 weeks)
- Push repo and enable CI + basic tests (typecheck, lint).
- Deploy a public preview to Vercel for external testing.
- Finish custody schedule engine UX and calendar view (mobile-first).
- Implement swap requests end-to-end (create, respond, accept → override writes).
- Notifications: in-app and optional email reminders.

High value polish (4–8 weeks)
- Onboarding: demo mode, guided tour, reduce friction for adding other parent.
- Accessibility: fix keyboard navigation, color contrast, aria labels.
- Trust: publish privacy summary, apply audit fixes, add HSTS/CSP where relevant.
- Analytics and feedback collection.

Scale & ops (8–12 weeks)
- Monitoring (Sentry), automated backups, CI integration for DB migrations.
- SaaS considerations: multi-tenant pricing, billing (Stripe), account management.

Quick wins (<= 2 hours)
- Add `STATUS.md`, demo seed script (`scripts/seed-demo.js`).
- Add `DEMO.md` and a prominent demo CTA on the landing page.
- Add feedback form and link to contact/support email.

Estimates
- Each core flow (calendar UI, swap requests) ~3–7 days each depending on scope.
- Onboarding and demo seed: 1–2 days.
- Deploy + monitoring: 1–2 days.

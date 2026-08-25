# Security & Privacy Summary

Status
- A security audit is included in `AUDIT_REPORT.md`. Migration `0003_security_hardening.sql` must be applied before public deploy.

Immediate security actions
- Apply migrations `0001` → `0002` → `0003` on the Supabase project.
- Ensure RLS policies behave as intended by testing invite/accept and swap flows with non-member accounts.
- Rotate Supabase `anon` and `service_role` keys if they have been exposed.
- Do not commit `.env.local` or service keys into any repo. Add `.env.local` to `.gitignore` if not present.

Privacy & trust
- Publish a short privacy summary on the public landing page describing what personal data is stored, retention, encryption-at-rest, and who can access family data.
- For demo tenants, avoid using real PII; use synthetic emails and sample names.

Operational security
- Add Sentry (or similar) for error monitoring (don’t log sensitive data).
- Add automated backups for the database and document restore procedures.

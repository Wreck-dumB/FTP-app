# Status

Forward Thinking Parents (FTP) — current workspace snapshot.

- Milestone: 3 of 11 complete (auth, family setup, invite flow).
- Deploy status: Not deployed to a public URL. Do not deploy until migration `0003_security_hardening.sql` has been applied to your Supabase project and keys verified.
- Immediate recommended next steps:
  1. Commit and push local changes to a remote repository.
  2. Apply Supabase migrations `0001` → `0002` → `0003` in the project SQL editor.
  3. Rotate Supabase keys if `.env.local` was shared.
  4. Deploy a demo preview to Vercel with production env vars (see `DEMO.md`).

Deploy commands (example):

```bash
git add -A
git commit -m "Save session work"
git push origin main
# On Vercel: link repo, add env vars from .env.local, then deploy
```

# Demo and quick-start

This repository includes a helper script to seed a local or test Supabase project with realistic demo data.

Preconditions
- A Supabase project with service role key (sensitive). Do not expose this key publicly.
- Copy `.env.local.example` → `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

Seed demo data

```bash
npm ci
npm run seed:demo
```

What the script creates
- Two demo auth users (admin-created via service role)
- One family and two `family_members`
- One `child`
- One simple weekly `custody_schedule` and schedule blocks

Notes
- The script uses the Supabase Admin API and requires the service role key. Use only with a test project.
- After seeding, visit the app locally (`npm run dev`) and log in using the demo users via the Supabase Auth panel or by implementing a temporary magic-link flow.

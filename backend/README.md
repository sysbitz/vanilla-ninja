# Vanilla Ninja — Backend

This folder is **documentation + source-of-truth SQL** for the Lovable Cloud
(Supabase) backend that powers Vanilla Ninja.

> The actual database is provisioned by Lovable Cloud. The migrations applied
> to the live project mirror the files in [`./schema/`](./schema). Keep them
> in sync if you edit the schema.

## Tables

| Table | Purpose |
| --- | --- |
| `profiles` | Per-user public profile (display name, avatar, bio, level, xp). Auto-created on signup via `handle_new_user` trigger. |
| `level_progress` | One row per `(user_id, level_id)` tracking `completed`, `stars`, `attempts`, `solution_revealed`. |

## Auth

- Email + password (email confirmation **enabled** — users must verify before login).
- Email-redirect URL on signup is set to the site origin.
- `auth.users` rows automatically get a matching `public.profiles` row.

## Row-Level Security

All tables have RLS enabled. Policies in plain English:

- **profiles**
  - any signed-in user can read profiles (used for future leaderboards),
  - users can insert/update **only their own** profile.
- **level_progress**
  - users can read / insert / update / delete **only their own** rows.

## Frontend service layer

Code in [`src/services/`](../src/services) is the **only** place the rest of
the app talks to Supabase. Components import services, never the raw client.

```
src/services/
  authService.ts       sign up / in / out / session
  profileService.ts    read & update profile (name, bio, avatar, xp, level)
  progressService.ts   read all progress, upsert one level, merge local → cloud
```

## Files

- [`schema/001_init.sql`](./schema/001_init.sql) — initial schema, triggers, RLS.
- [`schema/002_harden_functions.sql`](./schema/002_harden_functions.sql) — pin `search_path` on helper functions.

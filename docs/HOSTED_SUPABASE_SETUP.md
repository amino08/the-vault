# Hosted Supabase Setup Checklist — The Vault

Use this with a **cloud Supabase project only** (no Docker, no local Supabase).

---

## Part A — Create project (Dashboard)

1. Go to https://supabase.com/dashboard/new/new-project
2. Name: `the-vault` (or your preference)
3. Choose region, set a **database password** (save it)
4. Wait until project status is **Active**

---

## Part B — Copy API keys into `.env.local`

Open **Project Settings → API** in the Supabase dashboard.

| Variable | Where to copy |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (e.g. `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API keys → anon → public** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project API keys → service_role → secret** (never expose client-side) |

Also set in `.env.local`:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `VAULT_ADMIN_EMAILS` | Your email (comma-separated if multiple admins) |

Restart dev server after saving: `npm run dev`

---

## Part C — Run SQL (SQL Editor)

Dashboard → **SQL Editor → New query**

**Recommended:** paste and run the entire contents of **`supabase/hosted-setup.sql`** in one go.

That file combines all migrations + storage in the correct order:

| # | Source file (included in hosted-setup.sql) |
|---|---------------------------------------------|
| 1 | `supabase/migrations/20250613000001_enums.sql` |
| 2 | `supabase/migrations/20250613000002_users.sql` |
| 3 | `supabase/migrations/20250613000003_commissions.sql` |
| 4 | `supabase/migrations/20250613000004_commission_support.sql` |
| 5 | `supabase/migrations/20250613000005_payments_design_production.sql` |
| 6 | `supabase/storage.sql` |

**Alternative:** run each migration file individually in the order above, then `storage.sql`, then **`20250614000001_grants_authenticated.sql`**.

**When storage runs:** Last — it creates the `commission-files` bucket and RLS policies. It depends on `public.commissions` and `public.is_staff()` from earlier steps.

Each run should end with **Success**. If you see “already exists” errors, the schema may already be applied — stop and note which step failed.

---

## Part D — Auth redirect URL

Dashboard → **Authentication → URL Configuration**

| Field | Value |
|-------|--------|
| **Site URL** | `http://localhost:3000` |
| **Redirect URLs** | `http://localhost:3000/auth/callback` |

Optional for easier local testing:

**Authentication → Providers → Email** → disable **Confirm email**

---

## Part E — Verify (after keys + SQL)

With `npm run dev` running:

| Step | URL | Expected |
|------|-----|----------|
| Sign up | `/account/signup` | Account created, redirect to `/account` |
| Login | `/account/login` | Sign in works |
| Create commission | `/create` | Form submits, redirect to commission detail |
| Account | `/account` | Commission listed |
| Admin | `/admin` | Accessible if email is in `VAULT_ADMIN_EMAILS` |

---

## What uses each key

| Key | Used for |
|-----|----------|
| Anon key | Browser + server client (RLS enforced) |
| Service role | Admin role bootstrap, initial status history (server-only) |
| `VAULT_ADMIN_EMAILS` | Promotes matching email to `admin` on login/signup |

---

When steps B–D are done, paste **“ready to test”** and we’ll walk through Part E together.

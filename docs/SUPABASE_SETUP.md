# Supabase Setup — 9 Steps

## Blocker: Supabase account required for steps 1–2

Cloud project creation requires your Supabase login. Two options:

### Option A — Automated (recommended)

```powershell
cd C:\Users\amino\Documents\GitHub\the-vault

# 1. Login (opens browser)
npx supabase login

# 2. Run setup script (creates project, .env.local, migrations)
.\scripts\setup-supabase.ps1 -AdminEmail "your@email.com"
```

### Option B — Manual dashboard

1. Create project at https://supabase.com/dashboard/new/new-project  
   Name: `the-vault` · Region: closest to you · Save DB password

2. **Project Settings → API** — copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. Paste into `.env.local` (already created from `.env.example`)

4. **SQL Editor** → paste entire contents of `supabase/full-schema.sql` → Run  
   (This replaces running 5 migration files + storage.sql separately)

5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

6. **Authentication → Providers → Email**:
   - Disable "Confirm email" for faster local testing (optional)

7. Set admin email in `.env.local`:
   ```
   VAULT_ADMIN_EMAILS=your@email.com
   ```

8. Restart dev server:
   ```powershell
   npm run dev
   ```

9. Test flow:
   - http://localhost:3000/account/signup
   - http://localhost:3000/create
   - http://localhost:3000/account
   - http://localhost:3000/admin (after signing up with admin email)

## Files prepared

| File | Purpose |
|------|---------|
| `.env.local` | Created — fill in Supabase keys |
| `supabase/full-schema.sql` | All migrations + storage in one file |
| `scripts/setup-supabase.ps1` | Full automated setup via CLI |

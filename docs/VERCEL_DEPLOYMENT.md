# Vercel Deployment — The Vault by Enter Aevum

Production target: **https://vault.enter-aevum.com**

GitHub repository: **https://github.com/amino08/the-vault** (branch: `main`)

---

## Deployment readiness report

**Audit date:** 2026-06-13  
**Verdict:** **Ready to import into Vercel** — no code or schema changes required.

| Check | Status | Notes |
|---|---|---|
| `npm run typecheck` | Pass | No TypeScript errors |
| `npm run build` | Pass | 27 routes compiled; Next.js 15.5.19 |
| GitHub `main` pushed | Pass | Latest commit on remote |
| App Router compatibility | Pass | All routes under `src/app/` |
| 3D builder (`/create`) | Pass | `RingPreview` loaded via `dynamic(..., { ssr: false })` |
| Supabase SSR / middleware | Pass | `@supabase/ssr` cookie pattern; Edge middleware ~90 kB |
| Hardcoded localhost in app code | Pass | Only env fallbacks when `NEXT_PUBLIC_APP_URL` unset |
| `vercel.json` required | No | Next.js preset is sufficient |

### Non-blocking warnings (safe to deploy)

- ESLint: unused vars in `render-engine.ts`, `checkout.ts` (future Stripe stub)
- Supabase Edge Runtime advisory at build time (middleware uses `@supabase/supabase-js` via SSR package — works on Vercel)

### Must configure in Vercel before go-live

These are **dashboard / Supabase settings**, not code changes:

1. Set all **required** environment variables (see §3).
2. Set `NEXT_PUBLIC_APP_URL=https://vault.enter-aevum.com` (no trailing slash).
3. Update **Supabase Auth** Site URL + Redirect URLs (see §4).
4. Confirm Supabase migrations + `commission-files` storage bucket are applied (see §4).
5. Add custom domain + Hostinger CNAME (see §5).

### Optional for full production behavior

| Variable | If missing |
|---|---|
| `VAULT_ADMIN_EMAILS` | Admin bootstrap skipped; `/admin` inaccessible |
| `RESEND_API_KEY` | Inquiry emails skipped (logged, no crash) |
| `NEXT_PUBLIC_AEVUM_CHECKOUT_URL` | Falls back to `https://aevumdigital.co` |
| Stripe vars | Webhook route returns 400; native Stripe not used in checkout flow today |

---

## Pre-flight (run locally before every deploy)

```bash
npm run typecheck
npm run build
```

Both must pass. Do **not** run `npm run build` while `npm run dev` is active — stop dev first to avoid corrupted `.next` output.

---

## 1. GitHub

Repository is live at:

```
https://github.com/amino08/the-vault
```

Branch: **`main`**

> **Note:** `.env.local` is gitignored. Never commit secrets. Use Vercel Environment Variables instead.

---

## 2. Vercel import

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New → Project** → import **`amino08/the-vault`**.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: `.` (repo root).
5. Build command: `npm run build` (default).
6. Output directory: `.next` (default — leave as Next.js preset).
7. Install command: `npm install` (default).
8. Node.js version: **20.x** (recommended; matches Next.js 15).

No `vercel.json` is required for this project.

After import, add environment variables **before** promoting to production traffic (§3), then redeploy if you add vars after the first build.

---

## 3. Environment variables (Vercel dashboard)

Set under **Project → Settings → Environment Variables** for **Production** (and Preview if you want staging).

Copy names from `.env.example`. Values come from Supabase, Resend, and your domain — never from the repo.

### Required — app will not function correctly without these

| Variable | Production value | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://vault.enter-aevum.com` | Your production domain (no trailing slash) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Settings → API → service_role (**server only**) |

**Critical:** If `NEXT_PUBLIC_APP_URL` is missing in production, auth email links and site metadata fall back to `http://localhost:3000`. Always set this in Vercel Production.

### Strongly recommended — production behavior

| Variable | Example / notes |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `The Vault by Enter Aevum` |
| `NEXT_PUBLIC_AEVUM_CHECKOUT_URL` | `https://aevumdigital.co` (default if unset) |
| `VAULT_ADMIN_EMAILS` | `you@enter-aevum.com,partner@enter-aevum.com` (comma-separated; bootstraps admin role on sign-in) |

### Optional — features degrade gracefully if unset

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Inquiry confirmation emails; skipped if missing |
| `RESEND_FROM_EMAIL` | From address for Resend (default: `commissions@entervault.com`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Future native Stripe (not used in checkout flow today) |
| `STRIPE_SECRET_KEY` | Future native Stripe |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook at `/api/webhooks/stripe` |

### Auto-set by Vercel (do not override unless you know why)

| Variable | Notes |
|---|---|
| `VERCEL_URL` | Deployment hostname; available at runtime |

### Local validation script

After filling `.env.local` locally:

```bash
node scripts/validate-supabase-env.mjs
```

Prints pass/fail without exposing secret values.

---

## 4. Supabase configuration

### Auth — production URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

| Setting | Value |
|---|---|
| **Site URL** | `https://vault.enter-aevum.com` |
| **Redirect URLs** | Add all of the following: |

```
https://vault.enter-aevum.com/auth/callback
https://vault.enter-aevum.com/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

Keep localhost entries for local development.

**Email confirm redirect** (sign-up) uses:

```
{NEXT_PUBLIC_APP_URL}/auth/callback
```

Ensure `NEXT_PUBLIC_APP_URL` matches production exactly (no trailing slash).

**Auth callback route:** `/auth/callback` — exchanges OAuth/code for session, bootstraps user profile and admin role.

### Database & storage (one-time, hosted Supabase)

Apply before testing commissions in production:

1. Run all SQL in `supabase/migrations/` (or `supabase db push` if linked).
2. Run `supabase/storage.sql` in the SQL editor (storage policies).
3. If snapshot uploads fail, run `supabase/migrations/20250615000001_builder_snapshot_storage.sql`.

Required bucket: **`commission-files`** (private; PNG snapshots from `/create`).

See also: `docs/HOSTED_SUPABASE_SETUP.md`.

---

## 5. Custom domain — vault.enter-aevum.com

### In Vercel

1. **Project → Settings → Domains**
2. Add: `vault.enter-aevum.com`
3. Vercel will show the required DNS record(s).

### In Hostinger (DNS)

For a **subdomain**, Vercel expects a **CNAME**:

| Type | Name / Host | Target / Points to | TTL |
|---|---|---|---|
| **CNAME** | `vault` | `cname.vercel-dns.com` | 3600 (or Auto) |

- Full hostname: `vault.enter-aevum.com`
- Do **not** use an A record for the subdomain unless Vercel explicitly instructs otherwise.
- If Hostinger asks for “Host”, enter `vault` (not the full domain).

DNS propagation can take 5 minutes to 48 hours. Vercel shows **Valid Configuration** when ready.

After DNS is valid, confirm `NEXT_PUBLIC_APP_URL` is `https://vault.enter-aevum.com` and **redeploy**.

---

## 6. Deployment checklist

### Pre-import (done)

- [x] `npm run typecheck` passes locally
- [x] `npm run build` passes locally
- [x] Code pushed to GitHub `main` — https://github.com/amino08/the-vault/tree/main

### Vercel import & first deploy

- [ ] Import `amino08/the-vault` in Vercel (Next.js preset, Node 20.x)
- [ ] Set all **required** env vars in Vercel **Production**
- [ ] Set `NEXT_PUBLIC_APP_URL=https://vault.enter-aevum.com`
- [ ] Set `VAULT_ADMIN_EMAILS` with owner/admin emails
- [ ] Trigger deploy; confirm build succeeds on Vercel

### Supabase & domain

- [ ] Supabase Site URL + Redirect URLs updated (§4)
- [ ] Migrations + storage policies applied on hosted Supabase
- [ ] Custom domain `vault.enter-aevum.com` added in Vercel
- [ ] CNAME `vault` → `cname.vercel-dns.com` in Hostinger
- [ ] SSL certificate issued (automatic on Vercel)
- [ ] Redeploy after env/domain changes

### Post-deploy smoke tests

- [ ] `/` — homepage loads
- [ ] `/create` — 3D configurator renders (WebGL client-side)
- [ ] `/account/login` — sign-in works
- [ ] Sign-up email confirm → `/auth/callback` → `/account`
- [ ] Save Draft (authenticated) + Begin Commission → Aevum checkout redirect
- [ ] Admin access with `VAULT_ADMIN_EMAILS` account → `/admin`
- [ ] Optional: inquiry emails if `RESEND_API_KEY` set

---

## 7. Redeploy

**Automatic:** push to `main` → Vercel rebuilds Production.

**Manual:** Vercel Dashboard → Deployments → ⋯ → **Redeploy**.

After changing environment variables, **Redeploy** is required for new values to take effect.

---

## 8. Rollback

1. Vercel → **Deployments**
2. Find the last known-good deployment
3. ⋯ → **Promote to Production**

Previous deployment becomes live immediately. Database/Supabase state is unchanged — rollback is app-only.

---

## 9. Architecture notes

| Area | Status | Detail |
|---|---|---|
| Next.js 15 App Router | Compatible | 27 routes; static + dynamic mix |
| Middleware (Supabase session) | Edge | Refreshes session; protects `/account/*` and `/admin/*` |
| 3D ring builder (`/create`) | Client-only | Single dynamic import: `RingConfigurator` → `RingPreview` with `ssr: false` |
| Three.js on Vercel | Compatible | `transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"]`; `reactStrictMode: false` for stable WebGL |
| Server Actions | Enabled | 10 MB body limit for snapshot upload |
| Supabase SSR | Standard pattern | `createServerClient` in middleware + server components; `@supabase/ssr` ^0.5.2 |
| Secrets | Server-only | `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_*` are not `NEXT_PUBLIC_*` |
| Localhost in code | Fallback only | `site.ts` and auth `emailRedirectTo` use `NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"` |
| External URLs | Production-safe | Checkout defaults to `https://aevumdigital.co`; Instagram link is public |
| `vercel.json` | Not required | Defaults sufficient |

### Localhost audit (application source)

| Location | localhost? | Production impact |
|---|---|---|
| `src/config/site.ts` | Fallback if env unset | Set `NEXT_PUBLIC_APP_URL` in Vercel |
| `src/features/auth/actions.ts` | Fallback if env unset | Same — breaks email confirm links if unset |
| `src/config/aevum-checkout.ts` | No | Uses `https://aevumdigital.co` default |
| `src/app/auth/callback/route.ts` | No | Uses request `origin` (correct on Vercel) |
| Docs / `.env.example` | Dev references only | Not deployed |

---

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| Auth redirect loop | Check Supabase redirect URLs and `NEXT_PUBLIC_APP_URL` |
| Email links go to localhost | Set `NEXT_PUBLIC_APP_URL` in Vercel Production and redeploy |
| “Invalid API key” | Verify Supabase URL/anon key in Vercel env |
| Admin pages 403 | Add your email to `VAULT_ADMIN_EMAILS`, redeploy, sign in again |
| Snapshot upload fails | Apply storage migration; check `commission-files` bucket policies |
| Emails not sending | Set `RESEND_API_KEY`; verify domain in Resend |
| Webpack runtime errors in dev | Run `npm run dev:clean` — stale `.next` cache |
| Build fails on Vercel | Set Node 20.x; run `npm run build` locally first |
| 3D blank on `/create` | Usually client WebGL; check browser console; not a Vercel SSR issue |

---

## Support contacts

- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Auth URLs:** [supabase.com/docs/guides/auth/redirect-urls](https://supabase.com/docs/guides/auth/redirect-urls)
- **Vercel custom domains:** [vercel.com/docs/projects/domains](https://vercel.com/docs/projects/domains)

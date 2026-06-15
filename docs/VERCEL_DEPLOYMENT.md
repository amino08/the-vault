# Vercel Deployment — The Vault by Enter Aevum

Production target: **https://vault.enter-aevum.com**

---

## Pre-flight (run locally before every deploy)

```bash
npm run typecheck
npm run build
```

Both must pass. Do **not** run `npm run build` while `npm run dev` is active — stop dev first to avoid corrupted `.next` output.

---

## 1. GitHub push

The project must be a git repository connected to GitHub before Vercel import.

```bash
cd the-vault
git init
git add .
git commit -m "Prepare The Vault for Vercel production"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/the-vault.git
git push -u origin main
```

> **Note:** `.env.local` is gitignored. Never commit secrets. Use Vercel Environment Variables instead.

---

## 2. Vercel import

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New → Project** → import `the-vault` repository.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: `.` (repo root).
5. Build command: `npm run build` (default).
6. Output directory: `.next` (default — leave as Next.js preset).
7. Install command: `npm install` (default).
8. Node.js version: **20.x** (recommended; matches Next.js 15).

No `vercel.json` is required for this project.

---

## 3. Environment variables (Vercel dashboard)

Set these under **Project → Settings → Environment Variables** for **Production** (and Preview if you want staging).

### Required — app will not function without these

| Variable | Example / notes |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://vault.enter-aevum.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role (**server only**, never expose to client) |

### Strongly recommended — production behavior

| Variable | Example / notes |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `The Vault by Enter Aevum` |
| `NEXT_PUBLIC_AEVUM_CHECKOUT_URL` | `https://aevumdigital.co` |
| `VAULT_ADMIN_EMAILS` | `you@enter-aevum.com,partner@enter-aevum.com` (comma-separated; bootstraps admin role) |

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

---

## 4. Supabase Auth — production URLs

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

The localhost entries keep local development working.

**Email confirm redirect** uses:

```
{NEXT_PUBLIC_APP_URL}/auth/callback
```

Ensure `NEXT_PUBLIC_APP_URL` matches production exactly (no trailing slash).

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

Optional: redirect `www.vault.enter-aevum.com` or apex `enter-aevum.com` separately if needed — only configure what you intend to serve.

---

## 6. First production deploy checklist

- [ ] `npm run typecheck` passes locally
- [ ] `npm run build` passes locally
- [ ] Code pushed to GitHub `main`
- [ ] Vercel project imported and first deploy triggered
- [ ] All **required** env vars set in Vercel Production
- [ ] `NEXT_PUBLIC_APP_URL=https://vault.enter-aevum.com`
- [ ] Supabase Site URL + Redirect URLs updated
- [ ] Custom domain added in Vercel
- [ ] CNAME `vault` → `cname.vercel-dns.com` in Hostinger
- [ ] SSL certificate issued (automatic on Vercel)
- [ ] Test: `/`, `/create`, `/account/login`, sign-up email flow
- [ ] Test: commission submit → Aevum checkout redirect
- [ ] Test: admin access with `VAULT_ADMIN_EMAILS` account

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

## 9. Architecture notes (audit summary)

| Area | Status |
|---|---|
| Next.js 15 App Router | Compatible |
| Middleware (Supabase session) | Edge — known Supabase warning at build, works on Vercel |
| 3D ring builder (`/create`) | Client-only via `dynamic(..., { ssr: false })` — no SSR Three.js |
| Server Actions | Enabled; 10mb body limit for snapshot upload |
| Secrets | Server keys (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_*`) are not `NEXT_PUBLIC_*` |
| Localhost | Only as fallback when `NEXT_PUBLIC_APP_URL` unset — must set in production |
| `vercel.json` | Not required |

---

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| Auth redirect loop | Check Supabase redirect URLs and `NEXT_PUBLIC_APP_URL` |
| “Invalid API key” | Verify Supabase URL/anon key in Vercel env |
| Admin pages 403 | Add your email to `VAULT_ADMIN_EMAILS`, redeploy, sign in again |
| Emails not sending | Set `RESEND_API_KEY`; verify domain in Resend |
| Webpack runtime errors in dev | Run `npm run dev:clean` — stale `.next` cache |
| Build fails on Vercel | Compare Node version; run `npm run build` locally first |

---

## Support contacts

- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Auth URLs:** [supabase.com/docs/guides/auth/redirect-urls](https://supabase.com/docs/guides/auth/redirect-urls)
- **Vercel custom domains:** [vercel.com/docs/projects/domains](https://vercel.com/docs/projects/domains)

# Next Steps Checklist

Use this after completing Phase 0 foundation setup.

## Immediate Setup (You)

- [ ] Install Node.js 20+ ([nodejs.org](https://nodejs.org))
- [ ] Open terminal in `C:\Users\amino\Documents\GitHub\the-vault`
- [ ] Run `npm install`
- [ ] Copy `.env.example` → `.env.local`
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Add Supabase URL + anon key + service role key to `.env.local`
- [ ] Run migrations (`npx supabase db push` or paste SQL in dashboard)
- [ ] Run `supabase/storage.sql` in Supabase SQL editor
- [ ] Run `npm run dev` and verify all routes load
- [ ] Initialize GitHub repo and push

## shadcn/ui (Optional Now)

- [ ] Run `npx shadcn@latest add dialog tabs dropdown-menu avatar separator`
- [ ] Add components as needed during Phase 1

## Phase 1 — Start Here

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Add Supabase URL + anon key + **service role key** to `.env.local`
- [ ] Set `VAULT_ADMIN_EMAILS=your@email.com` for admin bootstrap
- [ ] Run migrations (`npx supabase db push` or paste SQL in dashboard)
- [ ] Run `supabase/storage.sql` in Supabase SQL editor
- [ ] Run `npm run dev` — sign up, submit commission, verify in portal
- [ ] Run `npm run db:types` to replace placeholder `database.ts`

### Phase 1 features (implemented)

- [x] Supabase Auth sign-in / sign-up
- [x] Protected `/account` and `/admin` routes (middleware)
- [x] Admin role bootstrap via `VAULT_ADMIN_EMAILS`
- [x] Commission create + list + detail pages
- [x] Status history timeline
- [x] Resend inquiry emails (when `RESEND_API_KEY` is set)

## Phase 2 Prep

- [ ] Create Stripe test account + products
- [ ] Add Stripe keys to `.env.local`
- [ ] Configure webhook endpoint (use Stripe CLI locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- [ ] Create Resend account + verify domain
- [ ] Test file upload to `commission-files` bucket

## Before Production

- [ ] Finalize privacy policy and terms
- [ ] Set production env vars in Vercel
- [ ] Enable Supabase RLS audit
- [ ] Configure custom domain
- [ ] Set up error monitoring (Sentry recommended)

## Quick Verification Commands

```bash
npm run dev          # Start development server
npm run build        # Verify production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Project Path

```
C:\Users\amino\Documents\GitHub\the-vault
```

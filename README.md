# The Vault by Enter Aevum

Luxury bespoke jewelry commission platform — where every piece begins as a story.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Stripe |
| Email | Resend |
| Forms | React Hook Form + Zod |
| 3D | Three.js + React Three Fiber |
| Hosting | Vercel |

## Project Structure

```
the-vault/
├── docs/                    # Roadmap, phases, next steps
├── supabase/
│   ├── migrations/          # SQL schema + RLS
│   └── storage.sql          # Storage bucket policies
├── src/
│   ├── app/                 # Routes (marketing, account, admin, API)
│   ├── components/          # UI + layout + account + admin
│   ├── config/              # Site, routes, commission statuses
│   ├── features/            # Domain modules
│   │   ├── builder/         # 3D builder foundation
│   │   ├── commissions/
│   │   └── payments/
│   ├── lib/                 # Supabase, Stripe, Resend, utils
│   └── types/               # TypeScript definitions
├── .env.example
├── components.json          # shadcn/ui config
└── package.json
```

## Prerequisites

- **Node.js 20+** and npm (not detected in current shell — install from [nodejs.org](https://nodejs.org))
- **Git** (GitHub Desktop includes git, or install separately)
- **Supabase** account
- **Stripe** account (test mode for development)
- **Resend** account (optional for Phase 2)

## Quick Start

```bash
cd C:\Users\amino\Documents\GitHub\the-vault

# 1. Install dependencies
npm install

# 2. Environment
copy .env.example .env.local
# Fill in Supabase, Stripe, Resend keys

# 3. Supabase — create project, then apply migrations
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
# Apply storage policies: run supabase/storage.sql in SQL editor

# 4. Generate TypeScript types from DB
npm run db:types

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## shadcn/ui Setup

Base components (`button`, `card`, `input`, `label`) are pre-installed manually.

To add more components via CLI:

```bash
npx shadcn@latest init   # Already configured — skip if components.json exists
npx shadcn@latest add dialog tabs dropdown-menu avatar separator
```

Configuration lives in `components.json`. Aliases point to `@/components/ui`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/about` | About The Vault |
| `/process` | Commission lifecycle |
| `/commissions` | Story & piece types |
| `/create` | Commission intake form |
| `/gallery` | Past creations |
| `/contact` | Contact |
| `/account` | Client portal |
| `/admin` | Internal dashboard |
| `/privacy`, `/terms` | Legal placeholders |

## Database

Migrations create:

- `users` — profiles linked to `auth.users`
- `commissions` — core commission entity
- `commission_files`, `commission_messages`, `commission_status_history`
- `commission_payments`, `design_concepts`, `cad_revisions`, `production_updates`

All tables include RLS policies for client vs staff/admin access.

## Environment Variables

See `.env.example` for the full list. Required for local dev:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, webhooks/admin tasks)

Stripe and Resend can wait until Phase 2.

## Deployment (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.example`
4. Set Stripe webhook URL: `https://your-domain.com/api/webhooks/stripe`

## Documentation

- [Development Roadmap](docs/ROADMAP.md)
- [Implementation Phases](docs/IMPLEMENTATION_PHASES.md)
- [Next Steps Checklist](docs/NEXT_STEPS.md)

## License

Proprietary — Enter Aevum / The Vault.

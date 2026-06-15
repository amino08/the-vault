# Implementation Phases — Detailed Breakdown

## Phase 0: Foundation (Complete)

### Deliverables
- Monorepo-ready modular folder structure under `src/features/`
- 11 commission statuses with labels and ordering logic
- 5 SQL migrations + storage policies
- 14+ page routes with luxury starter UI
- Client portal: 6 sub-routes (overview, messages, files, approvals, payments, production)
- Admin portal: 5 sub-routes (dashboard, commissions, customers, payments, analytics)
- Builder: 4 piece types + viewer + material/stone/engraving/render modules

### Not in scope
- Live auth, payments, file uploads, or builder parametrics

---

## Phase 1: Auth & Core Data

### Backend
1. Wire Supabase Auth sign-in/sign-up forms
2. Middleware route protection (`/account/*`, `/admin/*`)
3. Server actions: `createCommission`, `getCommissionsForUser`
4. Admin bootstrap: promote email to `admin` role on first login

### Frontend
1. Replace login/signup placeholders with Supabase calls
2. Commission list on `/account` from DB
3. Commission detail page `/account/commissions/[id]`
4. Status tracker connected to `commission_status_history`

### Acceptance
- User can sign up, submit inquiry, see commission in portal
- Admin can view all commissions

---

## Phase 2: Commission Workflow

### Integrations
- **Stripe**: Checkout sessions for deposits/milestones/final
- **Storage**: Upload to `commission-files/{commission_id}/`
- **Resend**: Payment + status emails

### Features
| Feature | Tables |
|---------|--------|
| Messaging | `commission_messages` |
| Files | `commission_files` + Storage |
| Approvals | `design_concepts`, `cad_revisions` |
| Payments | `commission_payments` |
| Production | `production_updates` |

### Webhook events
- `checkout.session.completed` → mark paid, optional status advance
- `charge.refunded` → update refund fields

---

## Phase 3: Polish & Gallery

- Image optimization pipeline for gallery
- Shipment carrier integration (manual or EasyPost later)
- PDF invoices from Stripe or custom generator
- Funnel analytics (inquiry → intake → deposit → production)

---

## Phase 4: 3D Builder

### Architecture
```
features/builder/
├── pendant/     # Parametric pendant geometry
├── ring/        # Band profiles, sizing
├── bracelet/    # Link patterns
├── necklace/    # Chain + pendant mount
├── viewer/      # R3F canvas, controls, lighting
├── materials/   # PBR metal definitions
├── stones/      # Gem placement engine
├── engraving/   # Text on mesh surfaces
└── render/      # Snapshot + export pipeline
```

### Data flow
1. User configures in `/create` builder step
2. `BuilderConfig` JSON saved to `commissions.builder_config`
3. Staff receives config for CAD refinement

---

## Phase 5: SaaS (Future)

- `organizations` table for jeweler tenants
- Row-level tenant isolation
- Feature flags per plan
- Subdomain or custom domain routing

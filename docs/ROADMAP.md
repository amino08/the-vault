# Development Roadmap — The Vault by Enter Aevum

## Vision

Build the definitive luxury commission platform where jewelry is sold as narrative — scalable into a multi-tenant SaaS for bespoke jewelers.

---

## Phase 0 — Foundation ✅ (Current)

- [x] Next.js 15 + TypeScript project scaffold
- [x] Tailwind luxury design tokens (black, ivory, champagne gold)
- [x] shadcn/ui base components + config
- [x] Full marketing route architecture
- [x] Account + Admin portal shells
- [x] Supabase SQL migrations with RLS
- [x] TypeScript domain types
- [x] 3D builder folder structure + R3F placeholder
- [x] Stripe webhook route skeleton
- [x] Payment architecture stubs

---

## Phase 1 — Auth & Core Data (Implemented — connect Supabase to activate)

- [x] Supabase Auth sign-in / sign-up / sign-out
- [x] Protected `/account` and `/admin` routes (middleware)
- [x] Admin role bootstrap via `VAULT_ADMIN_EMAILS`
- [x] Commission CRUD (create inquiry → persist to DB)
- [x] Status history timeline in client + admin detail pages
- [x] Resend inquiry emails (when `RESEND_API_KEY` is set)

---

## Phase 2 — Commission Workflow (Weeks 3–5)

- Message center (real-time optional)
- File upload/download (Supabase Storage)
- Design concept + CAD revision workflows
- Client render approval UI
- Stripe design deposit checkout
- Milestone + final production payments
- Webhook handlers (payment → status advance)
- Admin commission management table
- Internal notes vs client-visible notes

---

## Phase 3 — Polish & Gallery (Weeks 6–8)

- Editorial gallery with CMS or admin-uploaded pieces
- Production update feed + shipment tracking
- Invoice PDF generation
- Admin analytics dashboard
- SEO, Open Graph, performance optimization
- Legal pages (privacy, terms)
- Email notification matrix (all status transitions)

---

## Phase 4 — 3D Jewelry Builder (Weeks 9–14)

- Parametric pendant, ring, bracelet, necklace builders
- Material + stone + engraving systems (UI)
- Builder config persisted to `commissions.builder_config`
- High-quality render export
- Integration with CAD handoff workflow

---

## Phase 5 — SaaS Expansion (Future)

- Multi-tenant architecture (jeweler accounts)
- White-label theming
- Per-tenant Stripe Connect
- API for external integrations
- Mobile-optimized client portal

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Inquiry → deposit conversion | Track in Phase 2 |
| Average commission value | Admin analytics |
| Client portal engagement | Messages, approvals |
| Time in each status | Pipeline optimization |

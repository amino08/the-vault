export const routes = {
  home: "/",
  about: "/about",
  process: "/process",
  commissions: "/commissions",
  create: "/create",
  gallery: "/gallery",
  contact: "/contact",
  account: "/account",
  admin: "/admin",
  privacy: "/privacy",
  terms: "/terms",
  auth: {
    login: "/account/login",
    signup: "/account/signup",
    callback: "/auth/callback",
  },
  api: {
    stripeWebhook: "/api/webhooks/stripe",
  },
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];

export const marketingNav = [
  { label: "About", href: routes.about },
  { label: "Process", href: routes.process },
  { label: "Commissions", href: routes.commissions },
  { label: "Gallery", href: routes.gallery },
  { label: "Contact", href: routes.contact },
] as const;

export const accountNav = [
  { label: "Overview", href: routes.account },
  { label: "Messages", href: `${routes.account}/messages` },
  { label: "Files", href: `${routes.account}/files` },
  { label: "Approvals", href: `${routes.account}/approvals` },
  { label: "Payments", href: `${routes.account}/payments` },
  { label: "Production", href: `${routes.account}/production` },
] as const;

export const adminNav = [
  { label: "Dashboard", href: routes.admin },
  { label: "Commissions", href: `${routes.admin}/commissions` },
  { label: "Customers", href: `${routes.admin}/customers` },
  { label: "Payments", href: `${routes.admin}/payments` },
  { label: "Analytics", href: `${routes.admin}/analytics` },
] as const;

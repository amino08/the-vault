export const siteConfig = {
  name: "The Vault by Enter Aevum",
  shortName: "The Vault",
  tagline: "Luxury bespoke commissions for life's defining moments.",
  description:
    "Commission one-of-a-kind jewelry tied to transformation, achievement, legacy, and personal symbolism.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  contactEmail: "commissions@entervault.com",
  social: {
    instagram: "https://instagram.com/entervault",
  },
} as const;

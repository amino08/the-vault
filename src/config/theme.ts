/**
 * The Vault × Enter Aevum — brand palette tokens.
 * Tailwind mirrors these in tailwind.config.ts as vault-* utilities.
 */
export const brandColors = {
  /** Deep forest — headers, footer, brand identity */
  forest: {
    DEFAULT: "#1B2F28",
    deep: "#121C18",
    light: "#243D34",
    muted: "#2F4A40",
  },
  /** Warm metallics — CTAs, active states, highlights */
  gold: {
    DEFAULT: "#C9A962",
    light: "#D4BC7A",
    muted: "#8A7340",
  },
  /** Readable typography on dark surfaces */
  cream: "#F7F4EE",
  ivory: "#F5F2EA",
  pearl: "#E8E4DA",
  /** Showroom / atelier panels — configurator preview stays here */
  charcoal: "#141916",
  smoke: "#1C211E",
  black: "#0A0C0B",
} as const;

export type BrandColor = typeof brandColors;

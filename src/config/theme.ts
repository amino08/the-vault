/**
 * The Vault × Enter Aevum — brand palette.
 * Tailwind mirrors these as vault-* utilities in tailwind.config.ts.
 */
export const brandColors = {
  forest: {
    DEFAULT: "#1B3D32",
    deep: "#0F2822",
    light: "#2A5246",
    muted: "#3D6B5C",
  },
  gold: {
    DEFAULT: "#B8985A",
    light: "#D4BC7A",
    muted: "#9A7F4A",
    brush: "#C9A962",
  },
  cream: "#F9F6F0",
  ivory: "#FFFDF9",
  warm: "#F3EDE3",
  ink: "#1A2E28",
  muted: "#5C6B63",
  "muted-light": "#8A9690",
  /** Atelier / configurator surfaces only */
  charcoal: "#252922",
  smoke: "#2F3530",
  black: "#1A1D1B",
  /** Typography on dark atelier surfaces */
  pearl: "#E8E4DA",
  "cream-text": "#F7F4EE",
} as const;

export type BrandColor = typeof brandColors;

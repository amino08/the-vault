import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          black: "#1A1D1B",
          charcoal: "#252922",
          smoke: "#2F3530",
          forest: {
            DEFAULT: "#1B3D32",
            deep: "#0F2822",
            light: "#2A5246",
            muted: "#3D6B5C",
          },
          gold: "#B8985A",
          "gold-light": "#D4BC7A",
          "gold-muted": "#9A7F4A",
          "gold-brush": "#C9A962",
          cream: "#F9F6F0",
          ivory: "#FFFDF9",
          warm: "#F3EDE3",
          ink: "#1A2E28",
          muted: "#5C6B63",
          "muted-light": "#8A9690",
          pearl: "#E8E4DA",
          "cream-text": "#F7F4EE",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
        editorial: "0.12em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "brand-radial-light":
          "radial-gradient(ellipse 90% 70% at 50% -20%, rgba(27, 61, 50, 0.08), transparent 60%)",
        "brand-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(27, 61, 50, 0.35), transparent)",
      },
      boxShadow: {
        panel: "0 1px 3px rgba(26, 46, 40, 0.06), 0 8px 32px rgba(26, 46, 40, 0.04)",
        atelier: "0 24px 64px -24px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(184, 152, 90, 0.08)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

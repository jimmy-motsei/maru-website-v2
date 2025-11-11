import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

function withOpacity(variable: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue ? `rgb(var(${variable}) / ${opacityValue})` : `rgb(var(${variable}))`
}

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}", "./content/**/*.mdx"],
  theme: {
    container: { center: true, padding: "1rem", screens: { lg: "1120px" } },
    extend: {
      colors: {
        brand: {
          bg: withOpacity("--brand-bg")({}),
          text: withOpacity("--brand-text")({}),
          muted: withOpacity("--brand-muted")({}),
          border: withOpacity("--brand-border")({}),
          accent: withOpacity("--brand-accent")({}),
          "accent-fore": withOpacity("--brand-accent-fore")({}),
        },
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,.08)" },
      fontSize: {
        display: ["clamp(2.5rem,4vw,3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        headline: ["clamp(1.75rem,2.8vw,2.25rem)", { lineHeight: "1.15" }],
      },
    },
  },
  plugins: [typography],
}
export default config

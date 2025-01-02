import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import("tailwindcss").Config}  */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
          50: "oklch(var(--primary-50))",
          100: "oklch(var(--primary-100))",
          200: "oklch(var(--primary-200))",
          300: "oklch(var(--primary-300))",
          400: "oklch(var(--primary-400))",
          500: "oklch(var(--primary-500))",
          600: "oklch(var(--primary-600))",
          700: "oklch(var(--primary-700))",
          800: "oklch(var(--primary-800))",
          900: "oklch(var(--primary-900))",
          950: "oklch(var(--primary-950))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))",
        },
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

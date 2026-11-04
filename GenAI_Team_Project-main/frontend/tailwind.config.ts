import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          light: "#EEF2FF",
        },
        charcoal: {
          DEFAULT: "#1E293B",
          muted: "#64748B",
          light: "#94A3B8",
        },
        border: "#E2E8F0",
        divider: "#F1F5F9",
        // KARE colour palette
        kare: {
          violet: "#8B5CF6",
          indigo: "#6366F1",
          blue: "#3B82F6",
          teal: "#14B8A6",
          green: "#22C55E",
          yellow: "#FACC15",
          orange: "#F97316",
          pink: "#EC4899",
          coral: "#FB7185",
        },
        status: {
          success: "#22C55E",
          successBg: "#F0FDF4",
          warning: "#F97316",
          warningBg: "#FFF7ED",
          error: "#FB7185",
          errorBg: "#FFF1F2",
          info: "#3B82F6",
          infoBg: "#EFF6FF",
          violet: "#8B5CF6",
          violetBg: "#F5F3FF",
          teal: "#14B8A6",
          tealBg: "#F0FDFA",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        panel: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(99, 102, 241, 0.10)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

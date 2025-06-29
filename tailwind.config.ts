import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx,vue}",
    "./components/**/*.{ts,tsx,js,jsx,vue}",
    "./layouts/**/*.{ts,tsx,js,jsx,vue}",
    "./plugins/**/*.{ts,tsx,js,jsx,vue}",
    "./app/**/*.{ts,tsx,js,jsx,vue}",
    "./src/**/*.{ts,tsx,js,jsx,vue}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Modern gradient colors
        neon: {
          blue: "#00d4ff",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#10b981",
          yellow: "#fbbf24",
          orange: "#f97316",
        },
        // Glass morphism colors
        glass: {
          white: "rgba(255, 255, 255, 0.1)",
          black: "rgba(0, 0, 0, 0.1)",
          blue: "rgba(59, 130, 246, 0.1)",
          purple: "rgba(168, 85, 247, 0.1)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "slide-in-up": "slideInUp 0.5s ease-out",
        "slide-in-down": "slideInDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "rotate-in": "rotateIn 0.5s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-x": "gradientX 15s ease infinite",
        "gradient-y": "gradientY 15s ease infinite",
        "gradient-xy": "gradientXY 15s ease infinite",
        morphing: "morphing 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        typewriter: "typewriter 3s steps(20, end)",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        rotateIn: {
          "0%": { opacity: "0", transform: "rotate(-10deg) scale(0.9)" },
          "100%": { opacity: "1", transform: "rotate(0deg) scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)" },
        },
        gradientX: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        gradientY: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center bottom",
          },
        },
        gradientXY: {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "25%": {
            "background-size": "400% 400%",
            "background-position": "right center",
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "right center",
          },
          "75%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
        },
        morphing: {
          "0%, 100%": { "border-radius": "60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%": { "border-radius": "30% 60% 70% 40%/50% 60% 30% 60%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "currentColor" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-lg": "0 0 30px rgba(59, 130, 246, 0.6)",
        "glow-xl": "0 0 40px rgba(59, 130, 246, 0.7)",
        "neu-inset": "inset 6px 6px 10px #d1d1d4, inset -6px -6px 10px #ffffff",
        "neu-raised": "6px 6px 10px #d1d1d4, -6px -6px 10px #ffffff",
        "neu-raised-lg": "8px 8px 15px #d1d1d4, -8px -8px 15px #ffffff",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-cosmic": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-sunset": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-ocean": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-neon": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({ addUtilities, addComponents, theme }) {
      // Glass morphism utilities
      addUtilities({
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
        ".glass-strong": {
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        },
      });

      // Neumorphism utilities
      addUtilities({
        ".neu-inset": {
          background: "#f0f0f3",
          borderRadius: "20px",
          boxShadow: "inset 6px 6px 10px #d1d1d4, inset -6px -6px 10px #ffffff",
        },
        ".neu-raised": {
          background: "#f0f0f3",
          borderRadius: "20px",
          boxShadow: "6px 6px 10px #d1d1d4, -6px -6px 10px #ffffff",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        ".neu-raised:hover": {
          boxShadow: "8px 8px 15px #d1d1d4, -8px -8px 15px #ffffff",
          transform: "translateY(-2px)",
        },
      });

      // Custom scrollbar
      addUtilities({
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        ".scrollbar-thin::-webkit-scrollbar-track": {
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "3px",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          borderRadius: "3px",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          background: "linear-gradient(45deg, #764ba2, #667eea)",
        },
      });

      // Text utilities
      addUtilities({
        ".text-gradient": {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-glow": {
          textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        },
      });

      // Interactive utilities
      addUtilities({
        ".hover-lift": {
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        },
        ".hover-scale": {
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
        ".hover-glow": {
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
          },
        },
      });
    }),
  ],
} satisfies Config;

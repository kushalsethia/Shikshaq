import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1.5rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
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
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        charcoal: "hsl(var(--charcoal))",
        "warm-gray": "hsl(var(--warm-gray))",
        badge: {
          maths: "hsl(var(--badge-maths))",
          english: "hsl(var(--badge-english))",
          science: "hsl(var(--badge-science))",
          commerce: "hsl(var(--badge-commerce))",
          computer: "hsl(var(--badge-computer))",
          hindi: "hsl(var(--badge-hindi))",
          history: "hsl(var(--badge-history))",
          geography: "hsl(var(--badge-geography))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fadeSlideUp": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scalePop": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blurReveal": {
          from: { opacity: "0", filter: "blur(8px)", transform: "scale(1.02)" },
          to: { opacity: "1", filter: "blur(0px)", transform: "scale(1)" },
        },
        "widthExpand": {
          from: { opacity: "0", transform: "scaleX(0.7)" },
          to: { opacity: "1", transform: "scaleX(1)" },
        },
        "glowPulse": {
          "0%": { opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.6" },
        },
        "iconSpin": {
          from: { opacity: "0", transform: "rotate(-90deg)" },
          to: { opacity: "1", transform: "rotate(0deg)" },
        },
        "staggerFadeUp": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slideInLeft": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slideInRight": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "cardReveal": {
          from: { opacity: "0", transform: "translateY(20px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "chipSlide": {
          from: { opacity: "0", transform: "translateX(-12px) scale(0.95)" },
          to: { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "countUp": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          from: { "background-position": "-200% 0" },
          to: { "background-position": "200% 0" },
        },
        "badgeBounce": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "60%": { opacity: "1", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "iconBounce": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.25)" },
          "50%": { transform: "scale(0.95)" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "avatarReveal": {
          "0%": { opacity: "0", transform: "scale(0.6) rotate(-8deg)", filter: "blur(12px)" },
          "60%": { opacity: "1", transform: "scale(1.04) rotate(1deg)", filter: "blur(0px)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)", filter: "blur(0px)" },
        },
        "ringPulse": {
          "0%": { transform: "scale(1)", opacity: "0.7", boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" },
          "70%": { transform: "scale(1)", opacity: "0", boxShadow: "0 0 0 12px rgba(99,102,241,0)" },
          "100%": { transform: "scale(1)", opacity: "0", boxShadow: "0 0 0 0 rgba(99,102,241,0)" },
        },
        "statReveal": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.9)" },
          "50%": { opacity: "1", transform: "translateY(-2px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "underlineGrow": {
          from: { transform: "scaleX(0)", transformOrigin: "left" },
          to: { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "slideDownFade": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "tabSwitch": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "ratingStarFill": {
          "0%": { opacity: "0", transform: "scale(0) rotate(-45deg)" },
          "60%": { transform: "scale(1.2) rotate(5deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        "progressFill": {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
        "testimonialSlide": {
          from: { opacity: "0", transform: "translateX(40px) scale(0.95)" },
          to: { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "floatSubtle": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulseRing": {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "50%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(0.95)", opacity: "0.5" },
        },
        "slideUp": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-slide-up": "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-pop": "scalePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "blur-reveal": "blurReveal 0.4s ease-out both",
        "width-expand": "widthExpand 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "icon-spin": "iconSpin 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "stagger-fade-up": "staggerFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-left": "slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right": "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "card-reveal": "cardReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "chip-slide": "chipSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "count-up": "countUp 0.3s ease-out both",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "badge-bounce": "badgeBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "icon-bounce": "iconBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "avatar-reveal": "avatarReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "ring-pulse": "ringPulse 1.5s ease-out infinite",
        "stat-reveal": "statReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "underline-grow": "underlineGrow 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down-fade": "slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "tab-switch": "tabSwitch 0.25s ease-out both",
        "rating-star-fill": "ratingStarFill 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "progress-fill": "progressFill 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "testimonial-slide": "testimonialSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float-subtle": "floatSubtle 3s ease-in-out infinite",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        "slide-up-full": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

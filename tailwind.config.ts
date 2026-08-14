import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      /* Matches the DESIGN_SYSTEM.md §4 standard container:
         mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 */
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        /* @deprecated — legacy literal-hex classes. DESIGN_SYSTEM.md §2 bans
           these in src/**; use `brand` / `brand-blue` / `bg-background` /
           `text-foreground` instead. DELETE this block once
           `grep -rn "shikshaq-\(orange\|blue\|beige\|dark\)" src/` is empty.
           Kept alive only so in-flight migrations don't break the build. */
        'shikshaq-beige': '#F9F5F1',
        'shikshaq-dark': '#1F1F1F',
        'shikshaq-orange': '#FF8000',
        'shikshaq-blue': '#4351FF',

        /* Brand accents — DESIGN_SYSTEM.md §2. Accents, not surfaces. */
        brand: {
          DEFAULT: "hsl(var(--brand))",           // #FF8000
          foreground: "hsl(var(--brand-foreground))",
          hover: "hsl(var(--brand-hover))",
          subtle: "hsl(var(--brand-subtle))",     // #FFF4E8 — VISUAL_LANGUAGE §2.2 tint
          deep: "hsl(var(--brand-deep))",         // #B35900 — text-on-tint
        },
        "brand-blue": {
          DEFAULT: "hsl(var(--brand-blue))",      // #4351FF
          foreground: "hsl(var(--brand-blue-foreground))",
          hover: "hsl(var(--brand-blue-hover))",
          subtle: "hsl(var(--brand-blue-subtle))", // #EDEEFF — VISUAL_LANGUAGE §2.2 tint
          deep: "hsl(var(--brand-blue-deep))",     // #2E3AD6 — text-on-tint
        },

        /* Extended warm neutral scale — VISUAL_LANGUAGE.md §2.1. Roles the
           semantic tokens don't cover. Literal-hex vars, so no `/opacity`. */
        warm: {
          page: "var(--warm-page)",                       // #F9F5F1
          card: "var(--warm-card)",                       // #FCFAF7 (bone)
          muted: "var(--warm-muted)",                     // #F0EAE2
          band: "var(--warm-band)",                       // #F2ECE4 stripe band
          hairline: "var(--warm-hairline)",               // #E7DFD5
          "hairline-raised": "var(--warm-hairline-raised)", // #E4DCD2
          "hairline-strong": "var(--warm-hairline-strong)", // #D8CFC4

          /* Warm text ramp — VISUAL_LANGUAGE.md §2.1.
             ⚠ `secondary` / `meta` / `label` knowingly fail the 4.5:1 floor in
             DESIGN_SYSTEM.md §1.5. That is an owner-approved exception, not a
             bug — see the long note at the token definitions in index.css.
             Do not darken them.
               text-warm-prose      #4A443E  long-form body copy
               text-warm-secondary  #7B736B  secondary text (== muted-foreground)
               text-warm-meta       #8B837A  card meta
               text-warm-label      #A39A90  uppercase labels           */
          prose: "var(--text-prose)",
          secondary: "var(--text-secondary)",
          meta: "var(--text-tertiary)",
          label: "var(--text-quaternary)",
        },
        /* Near-black slab / footer — VISUAL_LANGUAGE.md §2.1. */
        panel: "var(--panel-dark)",                       // #1B1A18
        /* Mint stat-card fill — VISUAL_LANGUAGE.md §8. */
        mint: "var(--mint)",                              // #E3F7EC

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
      /* DESIGN_SYSTEM.md §5: rounded-lg (controls), rounded-2xl (cards/panels),
         rounded-full (pills/avatars). `full` comes from the Tailwind defaults,
         which `extend` merges with — do not redefine it. */
      borderRadius: {
        lg: "var(--radius)",   // 0.75rem
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        /* VISUAL_LANGUAGE.md §1.1/§6 — 32px, the saturated slabs only. */
        "4xl": "2rem",
      },
      /* DESIGN_SYSTEM.md §5: depth comes from these, never border + shadow. */
      boxShadow: {
        border: "var(--shadow-border)",
        "border-hover": "var(--shadow-border-hover)",
        /* VISUAL_LANGUAGE.md §2.2 / §8 — coloured glows and the two
           special stat-card shadows. Saturated surfaces only. */
        "glow-brand": "var(--shadow-glow-brand)",
        "glow-brand-blue": "var(--shadow-glow-brand-blue)",
        "card-bone": "var(--shadow-card-bone)",
        "card-mint": "var(--shadow-card-mint)",
      },
      /* DESIGN_SYSTEM.md §6 — permitted motion ONLY. The other 27
         keyframes/animations (scale-pop, blur-reveal, glow-pulse, icon-spin,
         stagger-fade-up, slide-in-left/right, chip-slide, count-up,
         badge-bounce, icon-bounce, avatar-reveal, ring-pulse, stat-reveal,
         underline-grow, slide-down-fade, tab-switch, rating-star-fill,
         progress-fill, testimonial-slide, float-subtle, pulse-ring,
         slide-up-full, fade-in, slide-up, width-expand) were removed after
         verifying with grep that no file under src/ references them.
         Do not re-add. Hover/press are transitions, not animations. */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        cardReveal: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          from: { "background-position": "-200% 0" },
          to: { "background-position": "200% 0" },
        },

        /* ---- VISUAL_LANGUAGE.md §7 additions to the whitelist -------------
           These four, and only these four, join the contract's §6 list.
           `heroSwap` previously lived as a bare @keyframes in index.css with
           no utility attached to it; it has been moved here (same values) so
           there is one definition and a real `animate-hero-swap` class. */
        heroSwap: {
          from: { opacity: "0", filter: "blur(9px)", transform: "translateY(14px)" },
          to: { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.5) rotate(0deg)" },
          "45%": { opacity: "0.95", transform: "scale(1) rotate(45deg)" },
        },
        /* `to: none` is the literal §7 value and is intentional. It clears
           only THIS element's entrance transform; the §8 per-card tilt lives
           on a parent wrapper and survives. Never put a rotation on the same
           element as `animate-fan-in`. */
        fanIn: {
          from: { opacity: "0", transform: "translateY(18px) rotate(0deg) scale(0.94)" },
          to: { opacity: "1", transform: "none" },
        },
        /* `bob` writes translateY only, so it composes with a tilt applied on
           a PARENT element — that is how the §8 stat cluster is built (see the
           three-element structure documented in index.css). `--bob-rotate` is
           an escape hatch for the case where rotation and float must share one
           element; leave it unset on the stat cards. Defaults to 0deg. */
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--bob-rotate, 0deg))" },
          "50%": { transform: "translateY(-9px) rotate(var(--bob-rotate, 0deg))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-slide-up": "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "card-reveal": "cardReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.5s ease-in-out infinite",

        /* VISUAL_LANGUAGE.md §7. `sparkle` and `bob` are ambient infinite
           loops and are DESKTOP-ONLY — index.css hard-disables them below
           1024px so they can never run on a mid-range Android phone. */
        "hero-swap": "heroSwap 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        sparkle: "sparkle 2.6s ease-in-out infinite",
        "fan-in": "fanIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        bob: "bob 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

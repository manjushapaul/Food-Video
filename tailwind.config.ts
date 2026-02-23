import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#A62B3A",
          50: "#F5E6E8",
          100: "#E8D0D4",
          200: "#D4A8B0",
          300: "#C0808C",
          400: "#A62B3A",
          500: "#8B2330",
          600: "#6D1B26",
          700: "#4F131C",
          800: "#310B12",
          900: "#130308",
        },
        golden: {
          DEFAULT: "#D4AF37",
          50: "#F9F5E8",
          100: "#F3E9C7",
          200: "#E7D385",
          300: "#DBBD43",
          400: "#D4AF37",
          500: "#B8941F",
          600: "#9A7A1A",
          700: "#7C6015",
          800: "#5E4610",
          900: "#402C0B",
        },
        'text-dark': '#2C2F24',
        'text-gray': '#666666',
        'text-body': '#414536',
        'text-date': '#737865',
        'text-button': '#AD343E',
        'footer-bg': '#363738',
        'footer-heading': '#E0E0E0',
        'footer-text': '#A0A0A0',
        'footer-desc': '#ADB29E',
        'footer-social': '#AD343E',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'blog-title': ['20px', { lineHeight: '1.4' }],
        'blog-body': ['16px', { lineHeight: '1.6' }],
        'button-text': ['24px', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'gradient-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
      },
      boxShadow: {
        'food-glow': '0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.1)',
        'food-glow-lg': '0 30px 80px -20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.15)',
      },
      maxWidth: {
        '8xl': '100rem', // 1600px – for 2xl screens and above
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;

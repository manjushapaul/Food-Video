# Bistro Boss - Food & Video

A pixel-perfect Next.js 15 restaurant hero section with Tailwind CSS and Framer Motion animations.

## Features

- 🎨 **Pixel-Perfect Design**: Exact match to the hero section design
- 📱 **Fully Responsive**: Desktop, tablet, and mobile optimized
- ✨ **Smooth Animations**: Framer Motion for entrance and hover effects
- 🎭 **Glassmorphism Nav**: Transparent navigation with backdrop blur
- 🖼️ **Optimized Images**: Next.js Image component with Unsplash integration
- 🎯 **TypeScript**: Full type safety
- 🎨 **Tailwind CSS**: Custom colors (maroon, golden) and typography

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Food-Video/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (uses HeroSection)
│   └── hero/
│       └── page.tsx         # Hero page route
├── components/
│   └── HeroSection.tsx      # Main hero section component
├── images/                  # Static images (logo, etc.)
├── css/                     # Additional CSS files
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```

## Component Details

### HeroSection Component

Located at `components/HeroSection.tsx`, this component includes:

- **Fixed Navigation**: Sticky header with glassmorphism effect
- **Hero Background**: Full-viewport height with gradient overlay
- **Overlapping Food Images**: Two overlapping plates on the left (60% width)
- **Text Content**: Right side (40% width) with heading, subtitle, and CTA buttons
- **Animations**: Framer Motion for smooth entrance animations
- **Responsive Design**: Mobile-first approach with hamburger menu

### Custom Colors

- **Maroon**: `#8B4513` (primary button color)
- **Golden**: `#D4AF37` (accent color)

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Customization

### Change Colors

Edit `tailwind.config.ts` to modify the maroon and golden color palettes.

### Update Images

Replace the Unsplash URLs in `HeroSection.tsx` with your own images, or use local images from the `images/` directory.

### Modify Animations

Adjust Framer Motion animation properties in `HeroSection.tsx` to change timing, delays, or effects.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **@tailwindcss/typography**: Typography plugin

## License

MIT

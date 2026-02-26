# Tawakkal Paint Store

A luxury, mobile-first e-commerce website for a premium paint retailer in Karachi, Pakistan.

## Features

- **Location Selection**: First-time visitors select their Karachi area for delivery
- **Product Catalog**: Browse paints by category (Decorative, Industrial, Auto, Projects)
- **Brand & Sub-category Filters**: Filter products by brand and type
- **Paint Calculator**: Calculate paint requirements based on room dimensions
- **Paint Visualizer**: Preview colors in different room settings
- **Shopping Cart**: Add products with size selection (Quarter/Gallon/Drum)
- **Discount System**: Tier-based discounts for registered users (15-25%)
- **Checkout**: Cash on Delivery with order tracking via WhatsApp
- **User Profile**: View order history and manage account

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tawakkal-paint
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL editor
   - Run the SQL from `supabase/seed.sql` to add sample products

4. Configure environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run development server:
```bash
npm run dev
```

6. Open http://localhost:3000

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── profile/           # User profile
│   └── category/[slug]/   # Category pages
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── PaintCalculator.tsx
│   ├── PaintVisualizer.tsx
│   ├── FAQ.tsx
│   └── ...
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── store.ts          # Zustand stores
│   └── types/            # TypeScript types
└── types/                # Shared types
```

## Design System

### Colors
- `--navy`: #0F1F3D (primary background)
- `--gold`: #C9973A (accents, CTAs)
- `--gold-light`: #E8B655 (hover states)
- `--gold-pale`: #FDF6E9 (light backgrounds)
- `--off-white`: #F8F6F2 (main background)

### Typography
- Headings: Playfair Display (serif)
- Body: DM Sans (sans-serif)

## WhatsApp Integration

All WhatsApp links use: `https://wa.me/923475658761`

## Deployment

Deploy to Vercel:
```bash
vercel deploy
```

Or build for production:
```bash
npm run build
npm start
```

## License

All Rights Reserved © 2025 Tawakkal Paint Store

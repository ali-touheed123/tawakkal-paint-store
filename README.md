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
git clone https://github.com/ali-touheed123/tawakkal-paint-store.git
cd tawakkal-paint-store
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

## Deployment

Deploy to Vercel:
- Go to https://vercel.com
- Import your GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy!

## License

All Rights Reserved © 2025 Tawakkal Paint Store

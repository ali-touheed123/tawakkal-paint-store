# Tawakkal Paint Store - Technical Specification

## Project Overview
- **Project Name**: Tawakkal Paint Store
- **Type**: Luxury Mobile-First E-commerce Website
- **Core Functionality**: Premium multi-brand paint retailer in Karachi, Pakistan with online catalog, cart, checkout, and WhatsApp integration
- **Target Users**: Homeowners, contractors, businesses in Karachi seeking premium paint products

## Tech Stack
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: COD only (manual)
- **Hosting**: Ready for Vercel/R Supabase Databaseailway

## Schema

### Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  area TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('decorative', 'industrial', 'auto', 'projects')),
  sub_category TEXT CHECK (sub_category IN ('interior', 'exterior', 'wood_metal', 'waterproofing', 'accessories')),
  description TEXT,
  image_url TEXT,
  price_quarter NUMERIC NOT NULL,
  price_gallon NUMERIC NOT NULL,
  price_drum NUMERIC NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount_percent NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash_on_delivery',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_area TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: cart_items
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT DEFAULT 'gallon' CHECK (size IN ('quarter', 'gallon', 'drum')),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Design System

### Colors
```css
--navy: #0F1F3D
--gold: #C9973A
--gold-light: #E8B655
--gold-pale: #FDF6E9
--white: #FFFFFF
--off-white: #F8F6F2
--text: #1A1714
--gray: #6B6560
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body/UI**: DM Sans (sans-serif)

### Motion
- Smooth fade-in + staggered slide-up on scroll
- 0.3s cubic-bezier transitions
- Parallax on hero image

## Feature List

### 1. Location Popup
- Full-screen overlay with blur
- 16 Karachi areas as selectable cards
- Save to localStorage
- Navbar area chip display
- Re-open to change area

### 2. Navbar
- Sticky, glassmorphism on scroll
- Logo, navigation links
- Search, WhatsApp, Cart, Profile icons
- Mobile hamburger menu
- Area chip

### 3. Homepage
- Hero section with parallax
- Why Choose Us (7 cards)
- 4 Category cards
- Paint Calculator section
- Paint Visualizer section

### 4. Paint Calculator
- Real-time calculations
- Paint type toggle
- Room dimensions input
- Coverage calculation with wastage buffer
- Tin size breakdown
- WhatsApp inquiry button

### 5. Paint Visualizer
- Room selector (Living Room, Bedroom, Exterior)
- SVG illustrated room
- 48 color swatches by family
- Instant color fill on click
- Product inquiry via WhatsApp

### 6. Category Pages
- Dynamic routing /category/[slug]
- Brand filter chips
- Sub-category filter
- Product grid with filters
- URL params for filters

### 7. Product Cards
- Image, brand, name
- Size toggle (Quarter/Gallon/Drum)
- Price display
- WhatsApp inquiry button
- Add to Cart button
- Out of stock handling

### 8. Discount System
- Tier-based: 0%, 15%, 20%, 25%
- Logged-in users only
- Cart progress bar
- Backend calculation

### 9. Auth System
- Register with full name, email, password, phone
- Login with email/password
- Forgot password via magic link
- Profile page with order history

### 10. Cart & Checkout
- Cart page with item management
- Checkout form with validation
- COD payment only (active)
- Other methods coming soon (disabled)
- Order confirmation page

### 11. FAQ
- Accordion with 8 questions
- One open at a time
- WhatsApp CTA at bottom

### 12. Footer
- 3 columns
- Social links
- Contact info
- Quick links

## WhatsApp Integration
- Phone: 923475658761
- wa.me links throughout site
- Floating WhatsApp bubble (always visible)

## SEO Requirements
- Unique title tags
- Meta descriptions and keywords
- Open Graph tags
- Twitter Card tags
- Schema.org LocalBusiness JSON-LD
- Semantic HTML
- Lazy loading images

## Karachi Areas (16)
1. Gulshan-e-Iqbal
2. DHA
3. Clifton
4. North Karachi
5. Korangi
6. Malir
7. Saddar
8. Orangi Town
9. F.B Area
10. Nazimabad
11. Gulistan-e-Johar
12. Liaquatabad
13. Landhi
14. Baldia Town
15. New Karachi
16. Shah Faisal Colony

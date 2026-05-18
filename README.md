# MuttaMeter

MuttaMeter is a production-quality MVP for Kerala bakery discovery and mutta puff investigations. It is built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, Cloudinary unsigned uploads, Leaflet/OpenStreetMap, GSAP, and Zod.

## What Is Built

- Landing page with a brutalist bakery-comic case-file hero.
- Public bakery discovery with search, city filtering, sorting, typed stats, empty states, and case-file cards.
- Bakery profile pages with ratings, puff proof gallery, review feed, badges, and scam indicators.
- Protected bakery registration and review routes.
- Puff proof uploads with browser validation, 1200px max resizing, WebP-first compression, JPEG fallback, progress, and metadata capture.
- Leaderboards for top puff score, low scam level, and most reported bakeries.
- Leaflet/OpenStreetMap bakery radar for bakeries with coordinates.
- Supabase Auth flows, profile editing, RLS migration, and Zod validation.

## Environment Variables

Create a local `.env.local` using `.env.example` as the template:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

Do not expose Cloudinary API secrets in client-side environment variables. This MVP uses unsigned uploads.

## Run Locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run start
```

Public pages render without Supabase credentials for local visual checks. Data-backed and protected flows require valid Supabase environment variables and the migration in `supabase/migrations`.

When Supabase variables are not configured, the app runs in local demo mode with seeded bakeries, reviews, map markers, leaderboards, and demo create endpoints. This keeps the MVP explorable on a fresh machine; connect Supabase when you want real auth and persistent community data.

## Design Direction

The active taste direction is brutalism first, softened only for readability and mobile usability:

- hard poster slabs
- bakery receipt panels
- comic warning stamps
- thick ink borders
- offset tactile shadows
- evidence-board layouts
- warm paper and egg-yolk accents

Avoid generic SaaS dashboards, shadcn defaults, purple/blue gradients, glassmorphism, and corporate minimalism.

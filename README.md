# MuttaMeter

MuttaMeter is a production-quality MVP for Kerala bakery discovery and mutta puff investigations. It is built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, signed Cloudinary uploads, Leaflet/OpenStreetMap, GSAP, and Zod.

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

Create a local `.env.local` using `.env.example` as the template. Add the same variables in Vercel under Project Settings -> Environment Variables for Production, Preview, and Development as needed:

```env
NEXT_PUBLIC_SITE_URL=https://muttapuffs.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://zxndsoidjxipqxjyvgmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Do not expose Cloudinary API secrets in `NEXT_PUBLIC_` variables. Puff proof uploads now ask `/api/cloudinary/signature` for a short-lived server signature and then post directly to Cloudinary, so no unsigned upload preset is required.

For Sign in with Google, enable Google in Supabase Auth -> Providers, add your Google OAuth client ID and client secret there, and allow this production callback URL in Supabase redirect URLs:

```text
https://muttapuffs.vercel.app/auth/callback
```

The Google OAuth web client must use this authorized JavaScript origin:

```text
https://muttapuffs.vercel.app
```

And this authorized redirect URI:

```text
https://zxndsoidjxipqxjyvgmw.supabase.co/auth/v1/callback
```

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

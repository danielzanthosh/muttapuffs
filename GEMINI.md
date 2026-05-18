# MuttaMeter Project Instructions

This project is **MuttaMeter**, a community-powered bakery discovery and "mutta puff" (egg puff) investigation platform for Kerala. It uses a unique "Soft Brutalist" aesthetic inspired by bakery receipts, comics, and investigation boards.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Database/Auth:** Supabase
- **Image Hosting:** Cloudinary (Unsigned Uploads)
- **Maps:** Leaflet / OpenStreetMap
- **Animation:** GSAP, Framer Motion
- **Validation:** Zod

## Core Architectural Patterns

### 1. Hybrid Data Fetching & Demo Mode
The project features a "Demo Mode" that allows it to run without Supabase credentials. 
- **Check:** `lib/supabase/queries.ts` uses `hasSupabaseEnv()` to decide whether to fetch from Supabase or the `lib/demo-store.ts`.
- **Precedence:** When adding new queries, always implement the demo fallback to maintain project portability.

### 2. Design System: Soft Brutalism
Adhere strictly to the "Mutta Mystery Board" aesthetic. Avoid clean, minimalist SaaS styles.
- **Borders:** Every card and interactive element must have a visible border (`border-2 border-chocolate-brown`).
- **Shadows:** Use offset solid shadows (`shadow-brutalist-sm` or `shadow-brutalist`) instead of soft blurs.
- **Colors:**
  - `bg-bakery-paper-cream` (Backgrounds)
  - `bg-egg-yellow` / `text-egg-yellow` (Mutta-related metrics)
  - `bg-tomato-red` / `text-tomato-red` (Scam alerts)
  - `text-chocolate-brown` / `border-chocolate-brown` (Primary text/borders)
- **Shapes:** Use "comic-badge" classes and slight rotations (`rotate-1`, `rotate-2`) for a hand-pinned feel.
- **Fonts:** Use the established Comic/Display typography for headers and high-signal labels.

### 3. Component Organization
- `components/ui-primitives.tsx`: Contains shared brutalist elements like `BadgeChip`, `RatingPill`, and `ScamLevelBadge`.
- `components/bakery-*`: Feature-specific components for lists, maps, and cards.
- `app/`: Next.js App Router structure.

### 4. Image Upload Strategy
"Puff Proof" photos are uploaded directly to Cloudinary using **unsigned uploads** on the client side. Metadata is then synced to Supabase.

## Building and Running

### Development
```bash
npm install
npm run dev
```
*Note: Public pages will render even without Supabase credentials using the Demo Mode.*

### Testing & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
npm run start
```

## Development Conventions

- **Type Safety:** All data structures must be typed in `types/bakery.ts`. Match the Supabase schema defined in `types/database.ts`.
- **Validation:** Use Zod schemas in `lib/validation.ts` for all form inputs and API payloads.
- **Animation:** Use the `gsap` wrapper in `lib/gsap.ts` for complex timeline animations. Use Framer Motion for simple layout transitions.
- **Local Context:** Refer to `PRODUCT.md` for brand personality and `DESIGN.md` for visual rules.

## Style Skills & Recipes
The project contains several "Style Skills" in subdirectories (e.g., `brutalism/`, `cinematic-product/`, `dark-luxe/`). These are comprehensive design manuals for specific UI directions.
- **Primary Style:** The default style is **Brutalism** (as defined in `brutalism/skill.md`).
- **Activation:** Before generating new UI, refer to the relevant `skill.md` to ensure the design language matches the desired "taste".
- **Component Recipes:** Consult `components/style-recipes.md` for specific component patterns and library integrations (Aceternity, GSAP, etc.).

## Do's and Don'ts

- **Do** include local Kerala bakery slang in UI copy (e.g., "Egg smell only", "Certified Mutta").
- **Do** use organic, "hand-drawn" shapes for badges.
- **Don't** use generic blue/navy "corporate" colors.
- **Don't** use glassmorphism or blurred shadows.
- **Don't** use perfectly aligned grids; allow for slight imperfections.

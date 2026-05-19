# Boka Studio (React)

A standalone marketing site for your **crochet boutique** and **photography** business. This folder is separate from the existing Blazor `BokaMarket` project — nothing in `customer/` or `BokaMarket.Server/` was changed.

## Run locally

```bash
cd boka-studio
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — dual business intro |
| `/boutique` | Crochet product catalog (sample data) |
| `/design` | **Design your own** — custom outfit builder (login required) |
| `/my-orders` | Customer custom order tracking (login required) |
| `/photography` | Photo session packages |
| `/gallery` | Crochet + photo portfolio grid |
| `/about` | Your story |
| `/contact` | Inquiry form (front-end only for now) |
| `/auth/login` | Customer or admin login (email OTP) |
| `/auth/register` | First-time registration with email verification |
| `/admin` | Admin dashboard (admin login only) |
| `/admin/orders` | Custom + boutique orders — quote, accept/decline, deposit tracking, fulfillment |
| `/admin/products` | Add, edit, delete shelf products (name, price, image URL or upload) |
| `/admin/yarn` | Toggle yarn colours in stock |
| `/my-orders` | Pay **30% deposit** when accepted; 48h non-refundable countdown |

## Auth (customer vs admin)

- Same portal, **separate roles** — like student vs lecturer logins.
- **First visit:** Register → 6-digit code sent to email → verify.
- **Return visit:** Login remembers your email → new OTP sent → verify.
- **Admin registration** needs invite code (`VITE_ADMIN_INVITE_CODE`, default `boka-admin-2026`).
- **Dev mode** (no Supabase): OTP is printed in the browser console (F12).

## Connected services

| Service | URL | Used for |
|---------|-----|----------|
| **BokaMarket API** | `https://boka-market-backend.onrender.com` | Products, yarn stock, custom orders, JWT after login |
| **Supabase** | `https://qmzjdtkdzmkcrmtulwuv.supabase.co` | Email OTP verification |

### One-time Supabase setup

1. Open [API settings](https://supabase.com/dashboard/project/qmzjdtkdzmkcrmtulwuv/settings/api) and copy the **anon public** key.
2. Paste it into `boka-studio/.env`:
   ```
   VITE_SUPABASE_ANON_KEY=eyJ...your-key
   ```
3. In Supabase: **Authentication → Providers → Email** → enable **Email OTP**.
4. Run `supabase/schema.sql` in the [SQL editor](https://supabase.com/dashboard/project/qmzjdtkdzmkcrmtulwuv/sql/new) (optional backup tables).
5. Restart `npm run dev`.

### Deploy API changes

Redeploy `BokaMarket.Server` to Render so new endpoints are live:

- `POST /api/auth/supabase-sync` — JWT after OTP
- `GET/POST/PUT /api/customorders` — custom design requests (status flow through deposit)
- `POST /api/customorders/{id}/pay-deposit` — customer pays 30% deposit (simulated for now)
- `GET/POST/PUT/DELETE /api/products` — admin product shelf CRUD
- `GET /api/yarn` — yarn stock for the builder

Until redeployed, the app falls back to local storage for custom orders.

## Custom order deposit flow

1. Customer submits design → `pending_review`
2. Admin quotes → `quoted`
3. Admin accepts with ready/delivery dates + timeline note → `accepted_pending_deposit` (30% deposit calculated)
4. Customer pays deposit on **My orders** → `deposit_paid` (non-refundable after 48 hours)
5. Admin advances: `in_production` → `ready` → `shipped` → `completed` (or `declined` with reason)

## Customize

1. **Products** — use `/admin/products` or edit `src/data/products.ts` as fallback
2. **Photo packages** — edit `src/data/services.ts`
3. **Gallery** — edit `src/data/gallery.ts` or add images under `public/images/`
4. **Branding** — colors in `src/index.css`, business name in `Navbar.tsx` and `Footer.tsx`
5. **Your photos** — replace Unsplash URLs with files in `public/` (e.g. `/images/my-bag.jpg`)

## Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to Vercel, Netlify, or any static host.

## Next steps (optional)

- Wire the contact form to EmailJS, Formspree, or your API
- Add a real checkout (Stripe) for the boutique
- Connect to your existing `BokaMarket.Server` products API when ready

## Deploy on Render (static site)

This project is deployed on **Render**, not Netlify. The repo root `render.yaml` defines a static site service `boka-studio` (plus the existing `boka-market-backend` Docker API).

### Blueprint / dashboard

1. Sign in at [render.com](https://render.com) and connect the GitHub repo `bokasyarnmarket-web/bymweb`.
2. **New + Blueprint** (or open an existing Blueprint) and point it at the repo; Render reads `render.yaml` at the root.
3. Confirm the **Static Site** (or static web) service **boka-studio**:
   - **Root directory:** `boka-studio`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
4. Add a **rewrite** so client-side routes work: `/*` → `/index.html` (already in `render.yaml`).

### Environment variables (boka-studio service)

Set these on the **boka-studio** service before or after the first deploy (Vite bakes them in at **build** time — redeploy after changes):

| Variable | Example / notes |
|----------|-----------------|
| `VITE_API_URL` | `https://boka-market-backend.onrender.com` (your Render backend URL) |
| `VITE_SUPABASE_URL` | `https://qmzjdtkdzmkcrmtulwuv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon public** key (Project Settings → API) |
| `VITE_ADMIN_INVITE_CODE` | Secret code required for admin registration |

Copy from `.env.example` locally; never commit `.env` (it is in `.gitignore`).

### Local vs production

- Local: copy `.env.example` to `.env` and run `npm run dev`.
- Production: set the same `VITE_*` keys in the Render dashboard for **boka-studio**, then trigger **Manual Deploy** or push to the connected branch.


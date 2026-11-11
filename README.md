# Rashel Mahmud — Cinematic Portfolio & CMS

A production-ready, fully dynamic developer portfolio with a private admin dashboard. Every public section — hero, about, skills, projects, experience, activities, journal, contact, navigation, footer, theme and SEO — is driven by MongoDB and editable without touching code.

Built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, Framer Motion, Lenis, MongoDB/Mongoose, Cloudinary and TipTap.

---

## Highlights

- **Cinematic public site** — dark editorial art direction, custom preloader and cursor, character reveals, magnetic buttons, tilt and parallax imagery, Lenis smooth scrolling, counters, ticker, section transitions and reduced-motion support.
- **Fully dynamic content** — seed placeholder content, then edit everything from the dashboard. Empty collections render considered empty states rather than broken layouts.
- **Private admin CMS** — single seeded administrator, bcrypt password hashing, httpOnly JWT session cookie, route middleware, rate-limited login and protected mutation APIs. No public sign-up, registration or auth links anywhere on the public site.
- **Complete dashboard** — overview analytics, messages inbox, media library, profile, hero, about, social links, résumé, skills, projects, journal, categories, experience, education, certifications, activities, achievements, SEO, navigation, footer, theme, and website settings.
- **Real CRUD** — generic collection manager plus grouped singleton editors, all backed by real MongoDB reads and writes.
- **Rich editing** — TipTap editor with images, links, alignment and Cloudinary uploads.
- **Contact form** — React Hook Form + Zod validation, honeypot, rate limiting and a persisted inbox.
- **Deployment ready** — Vercel, MongoDB Atlas and Cloudinary. `sitemap.xml`, `robots.txt`, Open Graph metadata and JSON-LD included.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, custom CSS design tokens |
| Motion | GSAP + ScrollTrigger, Framer Motion, Lenis |
| Data | MongoDB, Mongoose |
| Auth | `jose` JWT, bcryptjs |
| Forms | React Hook Form, Zod |
| Media | Cloudinary |
| Editing | TipTap |
| Icons / fonts | Lucide, Fontsource (Manrope + Instrument Serif) |

---

## Project structure

```text
src/
  app/
    (site)/               Public pages: home, projects, project detail, journal, post detail
    admin/                Private login page
    admin/dashboard/      All CMS modules
    api/
      contact/            Public contact endpoint
      admin/              Protected auth, CRUD, settings, stats and upload endpoints
    sitemap.ts            Dynamic sitemap
    robots.ts             Dynamic robots rules
  components/
    site/                 Public sections and motion primitives
    admin/                Dashboard shell, generic CRUD, editors, uploaders
  lib/
    models/               Mongoose models
    admin-fields.ts       Declarative field/column definitions and helpers
    admin-configs.ts      Collection module configuration
    admin-resources.ts    Resource registry for the generic API
    defaults.ts           Seed/default content
    validators.ts         Zod schemas
    data.ts               Public data queries and deep default merging
    auth.ts               Session helpers
    session-token.ts      Edge-safe JWT helpers
    cloudinary.ts         Upload and delete helpers
scripts/
  seed.ts                 Idempotent seed script
```

---

## Local setup

### 1. Requirements

- Node.js 20+ (tested with Node 25)
- npm 10+
- A MongoDB database (local or Atlas)
- A Cloudinary account for uploads (optional for browsing the site)

### 2. Install

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas or local connection string |
| `AUTH_SECRET` | Yes | Signs the admin session JWT (32+ random characters) |
| `ADMIN_EMAIL` | Yes (seed) | The single administrator email |
| `ADMIN_PASSWORD` | Yes (seed) | Administrator password, minimum 8 characters |
| `ADMIN_NAME` | No | Display name in the dashboard |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical URL for metadata, sitemap and robots |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 4. Seed the database

```bash
# Administrator account, profile and site settings only
npm run seed

# Add placeholder skills, projects, posts, experience, education, etc.
npm run seed:demo
```

The seed is idempotent: existing documents are never overwritten. Use `npm run seed -- --reset-admin` to refresh the administrator password from the current environment.

### 5. Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Private dashboard: <http://localhost:3000/admin>

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Useful scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Serve the production build
npm run typecheck  # TypeScript check
npm run seed       # Minimal seed
npm run seed:demo  # Full placeholder seed
```

---

## How the CMS works

- Collection modules (skills, projects, journal, categories, experience, education, certifications, activities, achievements) share a declarative configuration in `src/lib/admin-configs.ts` and a generic `CollectionManager` UI.
- Singleton modules (profile, hero, about, social links, résumé, SEO, navigation, footer, theme, settings) use grouped `SingletonForm` forms. A group can span multiple API endpoints.
- All mutations go through protected routes:
  - `POST /api/admin/login` and `POST /api/admin/logout`
  - `GET|POST|PATCH|DELETE /api/admin/resources/[resource]`
  - `GET|PUT /api/admin/profile`
  - `GET|PUT /api/admin/settings`
  - `GET /api/admin/stats`
  - `POST|DELETE /api/admin/upload`
- Public reads merge database documents over safe defaults in `src/lib/defaults.ts`, so a missing or partially filled database never produces an undefined layout.
- Public pages are `force-dynamic`, which keeps builds independent of the database while always serving fresh content.

### Content model

| Module | Collection |
| --- | --- |
| Profile / hero / about / socials / résumé | `Profile` singleton |
| Navigation / footer / theme / SEO / visibility | `SiteSettings` singleton |
| Skills | `skills` |
| Projects | `projects` |
| Journal | `posts` |
| Categories | `categories` |
| Experience / education / certifications | `experiences`, `education`, `certifications` |
| Activities / achievements | `activities`, `achievements` |
| Contact inbox | `messages` |
| Media library | `media` |

---

## Security notes

- The only account is created by the seed script. There is no registration endpoint or public auth UI.
- Passwords are hashed with bcrypt (cost 12) and never exposed by queries.
- Sessions are signed HS256 JWTs stored in an `httpOnly`, `sameSite=lax` cookie, secure in production, with an 8-hour expiry.
- Middleware redirects unauthenticated dashboard requests to `/admin`; every admin API also verifies the session server-side.
- Login is rate limited to 6 attempts per 10 minutes per client. Contact submissions are limited to 4 per 10 minutes and include a honeypot field.
- Uploads are restricted to JPG, PNG, WebP, AVIF, GIF and PDF, capped at 8 MB, and stored in Cloudinary.
- `AUTH_SECRET` is required in production. If it is missing, session verification fails closed.

---

## Deployment

### MongoDB Atlas

1. Create a free cluster and database user.
2. Allow access from Vercel (or `0.0.0.0/0` for a quick start).
3. Copy the connection string into `MONGODB_URI`, including a database name such as `/portfolio`.

### Cloudinary

1. Create a Cloudinary account.
2. Copy the cloud name, API key and API secret from the dashboard.
3. Add all three `CLOUDINARY_*` variables to your environment.

### Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add every variable from `.env.example` in **Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example `https://rashelmahmud.dev`.
5. Deploy.
6. Run the seed once against the production database:

```bash
# Locally, with production values in .env.local
npm run seed:demo
```

Or run it from a machine with the production `MONGODB_URI` and admin variables.

After deploying, sign in at `https://your-domain.com/admin`.

### Post-deploy checklist

- [ ] `MONGODB_URI` points to the production database.
- [ ] `AUTH_SECRET` is set and long/random.
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD` were used to seed the account.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain.
- [ ] Cloudinary variables are present and an upload succeeds.
- [ ] `/admin` redirects logged-in users to `/admin/dashboard`.
- [ ] Logged-out `/admin/dashboard` requests redirect to `/admin`.
- [ ] Contact form writes a message visible in the inbox.
- [ ] Public pages, sitemap and robots load.

---

## Design system

- **Background:** deep violet `#0b0714`
- **Foreground:** lavender white `#f6f1ff`
- **Accents:** coral `#ff7a6b`, peach `#ffc4ad`, mint `#4be1c3`, violet `#a78bfa`
- **Display type:** Instrument Serif
- **Body type:** Manrope variable
- **Admin palette:** fixed violet control-room palette scoped under `.admin-root`, independent of public theme changes.

Theme colours, default light/dark mode, section visibility, section order and section copy are all editable from the dashboard.

---

## License

Private project. All content and photography placeholders are for demonstration and should be replaced before publication.

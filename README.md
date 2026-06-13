# Radiant

A polished front-end **prototype** of a care-management platform for group homes that care for adults with developmental and intellectual disabilities. Radiant replaces paper sign-in sheets, binders, and medication charts with one warm, modern app.

> **Demo only.** All people and data are fictional. There is no backend, no authentication, and no real health records. Nothing persists beyond the browser session. A small *"Demo — fictional data"* badge appears in the corner of the app.

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

> If a leftover `node_modules/` folder is present, delete it first, then run `npm install`. (It can be left over from the build environment and is safe to remove.)

Build for production with `npm run build && npm start`.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, with a custom Radiant theme
- **Framer Motion** for transitions, hover springs, and animated counters
- **lucide-react** for icons
- **next/font** self-hosting Google Fonts (Bricolage Grotesque + Plus Jakarta Sans)
- **Zustand** for the small amount of shared demo state (which meds are "given", visitor check-ins)

## Routes

| Route | Screen |
|---|---|
| `/` | Marketing landing page (the pitch) |
| `/app` | Today / Shift Board — handoff, meds due, activity, upcoming |
| `/app/residents` | Resident list with home filter |
| `/app/residents/[id]` | Resident profile — care plan, allergy alert, Meds / Logs / Documents tabs, print one-pager |
| `/app/medications` | Medication pass (eMAR) — give / refuse / hold with reasons, allergy guards, "Given" animation |
| `/app/logs/new` | Daily log entry — segmented categories, sign & save |
| `/app/incidents/new` | Incident report — type, severity, submit & alert |
| `/app/visitors` | Visitor kiosk — full-screen self check-in, QR placeholder, check-out |
| `/app/dashboard` | Owner dashboard — multi-home stats, live activity, quick actions |

The app shell shows a sidebar on desktop and a bottom tab bar on mobile. The visitor kiosk runs full-screen without the nav.

## Where the mock data lives

All data is typed and hard-coded in **`/lib/`**:

- `lib/types.ts` — the entity types (Home, Resident, CarePlan, Medication, MedAdministration, DailyLog, Incident, Visit, Doc, Staff)
- `lib/mock/homes.ts` — Sunrise House & Lakeside Home, plus staff with med-validation expiry dates
- `lib/mock/residents.ts` — 5 fictional residents with diagnoses, allergies, guardians, care plans
- `lib/mock/meds.ts` — medication schedules and today's administration records
- `lib/mock/logs.ts` — daily log entries
- `lib/mock/incidents.ts` — one open incident
- `lib/mock/visitors.ts` — visitor records and documents
- `lib/store.ts` — Zustand store holding the live demo state (med status, visits)

Dashboard stats (compliance %, on-shift count, validations due, etc.) are **derived from this data** at render time.

## Project structure

```
app/
  (marketing)/page.tsx     landing page
  layout.tsx               root layout + fonts
  app/
    layout.tsx             app shell (sidebar / bottom bar)
    page.tsx               Today
    residents/             list + [id] profile
    medications/           eMAR
    logs/new/              daily log
    incidents/new/         incident report
    visitors/              kiosk
    dashboard/             owner view
components/
  ui/                      Button, Card, Badge, Input/Textarea
  radiant/                 NavBar, StatCard, ResidentCard, MedCard, Landing, Avatar, etc.
lib/
  types.ts, store.ts, utils.ts
  mock/                    all mock data
docs/                      the original Radiant planning docs
```

## Design notes

- **Type:** Bricolage Grotesque for big, confident headings; Plus Jakarta Sans for friendly UI/body.
- **Color:** deep navy `#1F3A5F`, teal `#2E8B8B`, warm coral/amber CTAs, off-white `#F7F5F1` backgrounds, with green/amber/red status colors.
- **Motion:** staggered reveals, springy hover, animated stat counters, and a satisfying check animation when a med is marked Given. All motion respects `prefers-reduced-motion`.
- **Accessibility:** semantic HTML, keyboard-navigable, visible focus rings, AA-contrast color choices.

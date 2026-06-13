# Claude Code Build Prompt — Radiant (Front-End Prototype)

> **How to use this:** Open Claude Code in a new, empty folder, then paste everything below the line into the chat. The four Radiant planning docs (Product Spec, Architecture, Roles & Workflows, Build Estimate) can be copied into this folder first so Claude Code can read them for extra context — but this prompt is self-contained.

---

## ROLE

You are a senior front-end engineer and product designer with a portfolio of **Awwwards / CSS Design Awards–winning** work. You write clean, modern, accessible React, and you have exceptional taste in **bold typography, layout, color, and motion**. You care about craft: spacing rhythm, type scale, easing curves, and details that make an interface feel premium.

## WHAT WE'RE BUILDING

**Radiant** — a care-management platform for group homes that care for adults with developmental and intellectual disabilities (think: an Orlando, Florida group home licensed by the state). Radiant replaces paper sign-in sheets, binders, and medication charts with one beautiful, easy app.

**This build is a polished front-end PROTOTYPE only:**

- All data is **realistic, hard-coded mock data** — no backend, no database, no authentication, no API calls.
- It must **look and feel like a finished, award-winning product** that we can demo to group-home owners and use in a pitch.
- Interactions should feel real (navigation, toggles, "give medication" updates local state, forms validate) but nothing persists beyond the session.

> **Important constraint:** This is a demo. Use only fictional people and data. Do **not** add real authentication, real health records, or any real personal/health information. Add a small "Demo — fictional data" badge somewhere unobtrusive.

## TECH STACK (use exactly this)

- **Next.js (latest, App Router)** with **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** for base components (button, card, dialog, input, badge, tabs, etc.)
- **Framer Motion** for animation and page/element transitions
- **lucide-react** for icons
- **next/font** for self-hosted Google Fonts
- State: React state + a little **Zustand** (or React context) for shared demo state (e.g., which meds are "given"). No server state libs.
- Mock data: plain TypeScript files in `/lib/mock/` exporting typed objects.

Keep it a clean, conventional Next.js App Router project. No unnecessary dependencies.

## DESIGN DIRECTION — "BOLD & WARM", AWARD-WINNING

The aesthetic is **bold and expressive but warm and human** — premium, confident, and friendly, because this is about caring for people. Think: a beautifully designed modern SaaS product, not a clinical hospital system.

### Typography (this is the star — make it POP)
- **Display / headings:** a bold, characterful grotesque. Use **"Bricolage Grotesque"** (or "Clash Display" if you self-host it). Headings should be **large, tight tracking, heavy weight (700–800)**, with oversized hero numbers and section titles.
- **Body / UI:** **"Plus Jakarta Sans"** (clean, humanist, friendly).
- Establish a strong **type scale** (e.g., 12 / 14 / 16 / 20 / 28 / 40 / 64 / 88). Hero headlines should be genuinely big and confident.
- Use **tight, bold headlines** with generous line-height on body. Don't be timid — big type is the whole vibe.

### Color (warm take on the Radiant palette)
- **Primary navy:** `#1F3A5F` (deep, trustworthy)
- **Teal accent:** `#2E8B8B` (action, highlights)
- **Warm accents:** a warm coral/amber for energy and CTAs, e.g. `#E8924A` / `#F2B705`
- **Soft backgrounds:** off-white `#F7F5F1`, light teal wash `#EAF2F2`
- **Status:** green `#2E8B5B` (on-time/done), amber `#C9A227` (due), red `#C0492F` (alert)
- Plenty of whitespace; rounded corners (cards ~16–24px radius); soft, subtle shadows (no harsh borders everywhere).

### Motion & craft
- Smooth, tasteful **Framer Motion**: staggered fade/slide-ins on load, springy hover states on cards and buttons, animated page transitions, animated number counters on the dashboard stats.
- Micro-interactions: a satisfying confirmation animation when a medication is marked "Given"; a check-in success state.
- Respect `prefers-reduced-motion`.

### Quality bar
- Fully **responsive** (looks great on a wall tablet, a phone, and a laptop).
- **Accessible:** semantic HTML, keyboard navigable, visible focus states, WCAG AA contrast, alt text.
- Dark mode is optional/nice-to-have, not required.

## INFORMATION ARCHITECTURE / ROUTES

Build a marketing landing page **and** the app screens.

1. `/` — **Landing page** (the pitch). Bold hero ("Run the whole house from one screen."), feature highlights, "why owners love it", a peek at the dashboard, and a "View the demo" CTA into the app.
2. `/app` — **Today / Shift Board** (caregiver home): handoff summary, upcoming meds, appointments, tasks.
3. `/app/residents` — **Resident list** (cards with photo/initials, room, quick status).
4. `/app/residents/[id]` — **Resident profile**: overview, care plan, allergy alert, tabs for Meds / Logs / Documents, "print emergency one-pager".
5. `/app/medications` — **Medication pass (eMAR)**: due list, give/refuse/held flow with reason, allergy warnings, satisfying "Given" animation.
6. `/app/logs/new` — **Daily log entry**: segmented categories (meal/activity/behavior/other), structured fields + notes, "sign & save".
7. `/app/incidents/new` — **Incident report**: type, severity selector, what happened, action taken, "submit & alert".
8. `/app/visitors` — **Visitor kiosk check-in**: friendly large-touch self check-in (name, visiting whom, relationship, agree to rules), QR placeholder, check-out.
9. `/app/dashboard` — **Owner dashboard**: multi-home view, animated stat cards (homes, staff on shift, missed meds, open incidents, med-compliance %, visitors on-site, validations due), live activity table, quick actions (inspection export, approve timecards, reports).

Use a shared app layout with a sidebar (desktop) / bottom tab bar (mobile): Today, Residents, Meds, Incidents, Dashboard. The visitor kiosk is a clean full-screen mode without the nav.

## MOCK DATA

Create typed mock data in `/lib/mock/` for: two homes ("Sunrise House", "Lakeside Home"), ~5 residents (fictional, e.g. Marcus Thompson, David Ramirez, Lena King), each with diagnoses, allergies, guardian, a care plan, and a medication schedule; several daily log entries; one open incident; a couple of staff (with med-administration validation expiry dates); and visitor records. Make it feel real and Florida-based. Derive dashboard stats from this data.

Match the entities described in the planning docs (User, Home, Resident, Care Plan, Medication, Medication Administration, Daily Log, Incident, Visit, Document). TypeScript types in `/lib/types.ts`.

## SUGGESTED STRUCTURE

```
/app
  /(marketing)/page.tsx        landing
  /app/layout.tsx              app shell (nav)
  /app/page.tsx                Today
  /app/residents/...
  /app/medications/...
  /app/logs/new/...
  /app/incidents/new/...
  /app/visitors/...
  /app/dashboard/...
/components/ui/                shadcn components
/components/radiant/           StatCard, ResidentCard, MedCard, NavBar, Hero, etc.
/lib/types.ts
/lib/mock/                     residents.ts, meds.ts, homes.ts, logs.ts, etc.
/lib/store.ts                  zustand demo state
```

## ACCEPTANCE CRITERIA

- A first-time visitor lands on a **genuinely impressive** marketing page with big bold type and smooth motion, and can click into a working demo.
- All nine routes render with realistic content and consistent design.
- The eMAR med-pass updates state with a delightful confirmation; the visitor kiosk completes a check-in; forms validate.
- Dashboard stat numbers animate and are derived from the mock data.
- Fully responsive and keyboard-accessible; `prefers-reduced-motion` respected.
- Clean, typed, well-organized code with no console errors. `npm run dev` works out of the box; include a short README on how to run it and where the mock data lives.

## HOW TO PROCEED

1. Scaffold the Next.js + TypeScript + Tailwind project and install shadcn/ui, Framer Motion, lucide-react, zustand.
2. Set up `next/font` (Bricolage Grotesque + Plus Jakarta Sans), the Tailwind theme (colors, radii, type scale), and global styles.
3. Build the mock data and types first.
4. Build shared layout, nav, and reusable components.
5. Build the landing page, then each app screen.
6. Add Framer Motion polish and the key micro-interactions last.
7. Do a final responsive + accessibility pass and write the README.

Start by scaffolding the project and setting up the design system (fonts, colors, type scale), then show me the landing page hero before continuing. Make it beautiful — this should look like it could win a design award.

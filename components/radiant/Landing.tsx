"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles, ArrowRight, Pill, ClipboardList, Users, ShieldCheck,
  CalendarCheck, DoorOpen, Check, Heart, Clock, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { AnimatedNumber } from "./AnimatedNumber";

const ease = [0.16, 1, 0.3, 1] as const;

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between container-px py-4">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
            <Sparkles className="h-5 w-5 text-amber" />
          </div>
          <span className="font-display text-2xl font-extrabold text-navy">Radiant</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-semibold text-navy/60 hover:text-navy transition">Features</a>
          <a href="#owners" className="text-sm font-semibold text-navy/60 hover:text-navy transition">For owners</a>
          <a href="#peek" className="text-sm font-semibold text-navy/60 hover:text-navy transition">The app</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-navy/70 hover:text-navy transition">Sign in</Link>
          <Link href="/signup">
            <Button size="sm" variant="primary">Get started <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };
  return (
    <section className="relative overflow-hidden grain">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-coral/15 blur-3xl" />
      <div className="mx-auto max-w-7xl container-px pt-16 pb-20 sm:pt-24 sm:pb-28">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-semibold text-navy/70 shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-ok" /> Built for Florida group homes
          </motion.div>
          <motion.h1 variants={item} className="mt-6 font-display text-3xl sm:text-4xl font-extrabold leading-[0.95] tracking-tight text-navy text-balance">
            Run the whole house<br />
            from <span className="relative whitespace-nowrap text-teal">one screen
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                <motion.path d="M2 9C70 3 230 3 298 9" stroke="#E8924A" strokeWidth="4" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6, ease }} />
              </svg>
            </span>.
          </motion.h1>
          <motion.p variants={item} className="mt-7 max-w-2xl text-lg text-navy/65">
            Radiant replaces paper sign-in sheets, medication binders, and scattered notebooks with one
            beautiful, easy app — so caregivers spend less time on paperwork and more time with the people they care for.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/signup"><Button size="lg" variant="primary">Get started <ArrowRight className="h-5 w-5" /></Button></Link>
            <Link href="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
          </motion.div>
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-navy/55">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-ok" /> Medication pass with allergy guards</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-ok" /> Inspection-ready records</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-ok" /> Works on the wall tablet</span>
          </motion.div>
        </motion.div>

        {/* Floating stat ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { v: 98.6, s: "%", l: "Med compliance", d: 1 },
            { v: 0, s: "", l: "Missed meds today", d: 0 },
            { v: 2, s: "", l: "Homes, one view", d: 0 },
            { v: 11, s: "", l: "Residents cared for", d: 0 },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/70 p-5 shadow-soft border border-navy/5 backdrop-blur">
              <div className="font-display text-2xl font-extrabold text-navy"><AnimatedNumber value={s.v} decimals={s.d} suffix={s.s} /></div>
              <div className="mt-1 text-xs font-semibold text-navy/55">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  { icon: Pill, title: "Medication pass (eMAR)", body: "A guided med round with allergy warnings, give/refuse/hold flow, and a satisfying confirmation on every dose.", tone: "teal" },
  { icon: ClipboardList, title: "Daily logs in seconds", body: "Structured meal, activity, and behavior notes that caregivers actually fill out — then sign and save.", tone: "coral" },
  { icon: ShieldCheck, title: "Incident reports that alert", body: "Capture what happened and the action taken, pick a severity, and notify the right people instantly.", tone: "navy" },
  { icon: Users, title: "Resident profiles", body: "Care plans, allergies, guardians, and documents in one place — plus a printable emergency one-pager.", tone: "ok" },
  { icon: DoorOpen, title: "Visitor kiosk", body: "A friendly, big-touch self check-in on the front-desk tablet, with check-out and a visitor log.", tone: "due" },
  { icon: TrendingUp, title: "Owner dashboard", body: "Every home at a glance: staff on shift, missed meds, open incidents, compliance, and validations due.", tone: "teal" },
];

const toneMap: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700",
  coral: "bg-[#FCEEE0] text-coral-600",
  navy: "bg-navy-50 text-navy",
  ok: "bg-[#E7F2EC] text-ok",
  due: "bg-[#FBF3D8] text-due",
};

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl container-px py-24">
      <Reveal>
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-teal">Everything the house needs</div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-navy text-balance">
            One calm place for the whole day of care.
          </h2>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <motion.div whileHover={{ y: -6 }} className="h-full rounded-3xl bg-white p-7 shadow-soft border border-navy/5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneMap[f.tone]}`}>
                <f.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm text-navy/60">{f.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Owners() {
  const points = [
    { icon: Clock, title: "Hours back every week", body: "No more re-writing the same notes across three binders. Caregivers log once and move on." },
    { icon: ShieldCheck, title: "Always inspection-ready", body: "Export a clean record for the state in one tap. Nothing lost, nothing illegible." },
    { icon: Heart, title: "Better care, less stress", body: "Allergy guards and clear handoffs mean fewer mistakes and calmer shifts." },
  ];
  return (
    <section id="owners" className="bg-navy text-white">
      <div className="mx-auto max-w-7xl container-px py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-widest text-amber">Why owners love it</div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white text-balance">
              Run a tighter ship without running yourself ragged.
            </h2>
            <p className="mt-5 text-lg text-white/70">
              Radiant gives owners a real-time view of every home, so you catch a missed med or an
              expiring staff validation before it becomes a problem.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button size="lg" variant="teal">Sign in to your dashboard <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </Reveal>
          <div className="space-y-4">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl bg-white/5 p-6 border border-white/10">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/20 text-amber">
                    <p.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/65">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Peek() {
  return (
    <section id="peek" className="mx-auto max-w-7xl container-px py-24">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-teal">A peek inside</div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-navy text-balance">
            Designed to feel calm, even on a busy shift.
          </h2>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-lift">
          <div className="flex items-center gap-2 border-b border-navy/8 bg-cream px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-alert/60" />
            <span className="h-3 w-3 rounded-full bg-due/60" />
            <span className="h-3 w-3 rounded-full bg-ok/60" />
            <span className="ml-3 text-xs font-semibold text-navy/45">radiant.app / dashboard</span>
          </div>
          <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-3 bg-cream/40">
            {[
              { l: "Staff on shift", v: 4, tone: "teal" },
              { l: "Missed meds", v: 0, tone: "ok" },
              { l: "Open incidents", v: 1, tone: "due" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white p-6 shadow-soft border border-navy/5">
                <div className="text-xs font-semibold text-navy/55">{s.l}</div>
                <div className="mt-2 font-display text-3xl font-extrabold text-navy"><AnimatedNumber value={s.v} /></div>
                <div className={`mt-3 h-1.5 w-full rounded-full bg-navy-50`}>
                  <div className={`h-1.5 rounded-full ${s.tone === "ok" ? "bg-ok w-full" : s.tone === "due" ? "bg-due w-1/3" : "bg-teal w-4/5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl container-px pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-teal-700 px-8 py-16 text-center shadow-lift sm:px-16">
          <div className="pointer-events-none absolute -top-16 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-balance">
            See how good care management can feel.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Create your account, pick your role, and step into a Radiant workspace built around what you do.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90">
              Create your account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-navy/8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 container-px py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white">
            <Sparkles className="h-4 w-4 text-amber" />
          </div>
          <span className="font-display text-lg font-extrabold text-navy">Radiant</span>
        </div>
        <p className="text-xs text-navy/50">Prototype · Fictional data only · Not for real health records.</p>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <main className="bg-cream">
      <Nav />
      <Hero />
      <Features />
      <Owners />
      <Peek />
      <CTA />
      <Footer />
    </main>
  );
}

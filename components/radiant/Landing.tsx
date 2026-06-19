"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight, Pill, ClipboardList, Clock, Boxes, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 container-px py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 focus-ring rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy text-white">
            <Sparkles className="h-4 w-4 text-amber" />
          </div>
          <span className="font-display text-xl font-extrabold text-navy">Radiant</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/login" className="whitespace-nowrap px-2 text-sm font-semibold text-navy/70 transition hover:text-navy">Sign in</Link>
          <Link href="/signup">
            <Button size="sm" variant="primary" className="whitespace-nowrap">Get started <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };
  return (
    <section className="relative overflow-hidden grain">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -left-24 h-72 w-72 rounded-full bg-coral/15 blur-3xl" />
      <div className="mx-auto max-w-3xl container-px py-16 text-center sm:py-24">
        <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-semibold text-navy/70 shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-ok" /> Built for Florida group homes
          </motion.div>
          <motion.h1 variants={item} className="mt-6 font-display text-3xl sm:text-5xl font-extrabold leading-[0.98] tracking-tight text-navy text-balance">
            Run the whole house from <span className="text-teal">one screen</span>.
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-lg text-navy/65">
            Medications, daily logs, staff hours, supplies, and visitors — one simple app that replaces the paper binders.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup"><Button size="lg" variant="primary">Get started <ArrowRight className="h-5 w-5" /></Button></Link>
            <Link href="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
          </motion.div>
          <motion.div variants={item} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-navy/55">
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-ok" /> Allergy-guarded med pass</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-ok" /> Inspection-ready records</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  { icon: Pill, title: "Medications", body: "A guided med pass — give, refuse, or hold each dose, with missed-med alerts to the manager." },
  { icon: ClipboardList, title: "Daily logs & incidents", body: "Meals, activities, behavior notes, and incident reports captured in seconds." },
  { icon: Clock, title: "Time clock & payroll", body: "Caregivers clock in; managers see hours and pay add up live." },
  { icon: Boxes, title: "Supplies & messages", body: "Track inventory that flags low items, and post announcements the whole team sees." },
];

function Features() {
  return (
    <section className="mx-auto max-w-5xl container-px pb-8">
      <Reveal>
        <h2 className="text-center font-display text-2xl sm:text-3xl font-extrabold text-navy text-balance">Everything the house needs, in one place.</h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="flex h-full gap-4 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <f.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-1 text-sm text-navy/60">{f.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl container-px py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-teal-700 px-8 py-14 text-center shadow-lift sm:px-16">
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-balance">Ready to run your home from one screen?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">Create your account and pick your role — an admin approves you and you&apos;re in.</p>
          <Link href="/signup" className="mt-7 inline-block">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90">Get started <ArrowRight className="h-5 w-5" /></Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-navy/8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 container-px py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white"><Sparkles className="h-4 w-4 text-amber" /></div>
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
      <CTA />
      <Footer />
    </main>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, QrCode, LogOut, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/radiant/Avatar";
import { useDemoStore } from "@/lib/store";
import { residents, residentById } from "@/lib/mock/residents";
import { cn } from "@/lib/utils";

export default function VisitorKiosk() {
  const visits = useDemoStore((s) => s.visits);
  const addVisit = useDemoStore((s) => s.addVisit);
  const checkOut = useDemoStore((s) => s.checkOut);
  const onSite = visits.filter((v) => v.onSite);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [resident, setResident] = useState("");
  const [relationship, setRelationship] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  function finish() {
    addVisit({ visitorName: name, visitingResidentId: resident, relationship, checkIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
    setDone(true);
  }
  function reset() {
    setStep(0); setName(""); setResident(""); setRelationship(""); setAgreed(false); setDone(false);
  }

  const canNext = [name.trim(), resident, relationship.trim(), agreed][step];

  return (
    <div className="min-h-screen">
      {/* Kiosk header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><Sparkles className="h-5 w-5 text-amber" /></div>
          <div>
            <div className="font-display text-xl font-extrabold text-navy">Radiant</div>
            <div className="text-2xs font-semibold text-navy/45">Sunrise House · Visitor check-in</div>
          </div>
        </div>
        <Link href="/app" className="text-xs font-semibold text-navy/40 hover:text-navy">Exit kiosk</Link>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-6 sm:px-10 lg:grid-cols-5">
        {/* Check-in card */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl bg-white p-8 shadow-lift border border-navy/5 sm:p-10">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-ok text-white shadow-glow">
                    <Check className="h-12 w-12" strokeWidth={3} />
                  </motion.div>
                  <h2 className="mt-7 font-display text-3xl font-extrabold text-navy">Welcome, {name.split(" ")[0]}!</h2>
                  <p className="mt-2 text-lg text-navy/60">You&apos;re checked in to visit {residentById(resident)?.name.split(" ")[0]}. Please sign out when you leave.</p>
                  <Button size="lg" className="mt-8" onClick={reset}>Done</Button>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                  <div className="mb-6 flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-teal" : "bg-navy-50")} />
                    ))}
                  </div>

                  {step === 0 && (
                    <>
                      <h2 className="font-display text-3xl font-extrabold text-navy">Welcome! What&apos;s your name?</h2>
                      <Input className="mt-6 h-16 text-xl" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <h2 className="font-display text-3xl font-extrabold text-navy">Who are you visiting?</h2>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {residents.filter((r) => r.homeId === "h1").map((r) => (
                          <button key={r.id} onClick={() => setResident(r.id)}
                            className={cn("flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition focus-ring",
                              resident === r.id ? "border-teal bg-teal-50" : "border-navy/10 hover:bg-navy-50")}>
                            <Avatar name={r.name} color={r.photoColor} size={48} />
                            <span className="font-display text-lg font-bold text-navy">{r.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h2 className="font-display text-3xl font-extrabold text-navy">What&apos;s your relationship?</h2>
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        {["Family", "Friend", "Guardian", "Physician", "Therapist", "Other"].map((rel) => (
                          <button key={rel} onClick={() => setRelationship(rel)}
                            className={cn("rounded-full border-2 px-6 py-3 text-base font-semibold transition focus-ring",
                              relationship === rel ? "border-navy bg-navy text-white" : "border-navy/10 text-navy/60 hover:bg-navy-50")}>
                            {rel}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h2 className="font-display text-3xl font-extrabold text-navy">A few house rules</h2>
                      <ul className="mt-5 space-y-2.5 text-navy/70">
                        <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-teal" /> Please sanitize your hands on arrival.</li>
                        <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-teal" /> Respect residents&apos; privacy and quiet hours.</li>
                        <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-teal" /> Sign out before you leave the home.</li>
                      </ul>
                      <button onClick={() => setAgreed(!agreed)}
                        className={cn("mt-6 flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition focus-ring",
                          agreed ? "border-teal bg-teal-50" : "border-navy/10 hover:bg-navy-50")}>
                        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg border-2 transition", agreed ? "border-teal bg-teal text-white" : "border-navy/20")}>
                          {agreed && <Check className="h-4 w-4" strokeWidth={3} />}
                        </span>
                        <span className="font-semibold text-navy">I understand and agree to the house rules.</span>
                      </button>
                    </>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    {step > 0 ? (
                      <Button variant="ghost" size="lg" onClick={() => setStep(step - 1)}><ArrowLeft className="h-5 w-5" /> Back</Button>
                    ) : <span />}
                    {step < 3 ? (
                      <Button size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue <ArrowRight className="h-5 w-5" /></Button>
                    ) : (
                      <Button size="lg" variant="teal" disabled={!agreed} onClick={finish}><Check className="h-5 w-5" /> Check in</Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: QR + on-site */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-navy p-7 text-center text-white shadow-soft">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white/10">
              <QrCode className="h-24 w-24 text-white/80" strokeWidth={1.4} />
            </div>
            <p className="mt-4 text-sm text-white/70">Returning visitor? Scan your code for instant check-in.</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <UserCheck className="h-5 w-5 text-teal" /> On-site now ({onSite.length})
            </h3>
            <div className="mt-4 space-y-2">
              {onSite.length === 0 && <p className="text-sm text-navy/45">No visitors currently signed in.</p>}
              {onSite.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-xl bg-cream/60 p-3">
                  <div>
                    <div className="text-sm font-bold text-navy">{v.visitorName}</div>
                    <div className="text-2xs text-navy/50">Visiting {residentById(v.visitingResidentId)?.name.split(" ")[0]} · in {v.checkIn}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => checkOut(v.id)}><LogOut className="h-4 w-4" /> Out</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

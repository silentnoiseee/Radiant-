"use client";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Printer, Phone, Pill, ClipboardList, FileText, Target,
  Utensils, Accessibility, MessageCircle, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/radiant/Avatar";
import { AllergyAlert } from "@/components/radiant/AllergyAlert";
import { residentById } from "@/lib/mock/residents";
import { medications } from "@/lib/mock/meds";
import { dailyLogs } from "@/lib/mock/logs";
import { documents } from "@/lib/mock/visitors";
import { homeById, staffById } from "@/lib/mock/homes";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "meds", label: "Medications", icon: Pill },
  { id: "logs", label: "Logs", icon: ClipboardList },
  { id: "docs", label: "Documents", icon: FileText },
] as const;

export default function ResidentClient() {
  const { id } = useParams<{ id: string }>();
  const resident = residentById(id);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("meds");

  if (!resident) return notFound();
  const home = homeById(resident.homeId);
  const meds = medications.filter((m) => m.residentId === resident.id);
  const logs = dailyLogs.filter((l) => l.residentId === resident.id);
  const docs = documents.filter((d) => d.residentId === resident.id);

  return (
    <div className="space-y-8">
      <Link href="/app/residents" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/55 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> All residents
      </Link>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-white p-7 shadow-soft border border-navy/5"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Avatar name={resident.name} color={resident.photoColor} size={80} />
            <div>
              <h1 className="font-display text-2xl font-extrabold text-navy">{resident.name}</h1>
              <div className="mt-1 text-sm text-navy/55">
                {home.name} · Room {resident.room} · Age {resident.age}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {resident.diagnoses.map((d) => (
                  <Badge key={d} tone="navy">{d}</Badge>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => typeof window !== "undefined" && window.print()}>
            <Printer className="h-4 w-4" /> Emergency one-pager
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: care plan */}
        <div className="space-y-6 lg:col-span-1">
          <AllergyAlert allergies={resident.allergies} />

          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="font-display text-base font-bold text-navy">Guardian</h2>
            <div className="mt-3">
              <div className="text-sm font-semibold text-navy">{resident.guardian.name}</div>
              <div className="text-xs text-navy/55">{resident.guardian.relationship}</div>
              <a href={`tel:${resident.guardian.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline">
                <Phone className="h-4 w-4" /> {resident.guardian.phone}
              </a>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="font-display text-base font-bold text-navy">Care plan</h2>
            <p className="mt-2 text-sm text-navy/65">{resident.carePlan.summary}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex gap-3"><Utensils className="h-4 w-4 shrink-0 text-teal mt-0.5" /><div><dt className="text-2xs font-bold uppercase text-navy/40">Dietary</dt><dd className="text-navy/75">{resident.carePlan.dietary}</dd></div></div>
              <div className="flex gap-3"><Accessibility className="h-4 w-4 shrink-0 text-teal mt-0.5" /><div><dt className="text-2xs font-bold uppercase text-navy/40">Mobility</dt><dd className="text-navy/75">{resident.carePlan.mobility}</dd></div></div>
              <div className="flex gap-3"><MessageCircle className="h-4 w-4 shrink-0 text-teal mt-0.5" /><div><dt className="text-2xs font-bold uppercase text-navy/40">Communication</dt><dd className="text-navy/75">{resident.carePlan.communication}</dd></div></div>
            </dl>
            <div className="mt-5 space-y-3">
              {resident.carePlan.goals.map((g) => (
                <div key={g.title} className="rounded-xl bg-cream/60 p-3.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-navy"><Target className="h-4 w-4 text-coral" /> {g.title}</div>
                  <p className="mt-1 text-xs text-navy/60">{g.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: tabs */}
        <div className="lg:col-span-2">
          <div className="flex gap-1 rounded-2xl bg-white p-1.5 shadow-soft border border-navy/5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-ring",
                  tab === t.id ? "text-navy" : "text-navy/50 hover:text-navy"
                )}
              >
                {tab === t.id && (
                  <motion.span layoutId="restab" className="absolute inset-0 rounded-xl bg-teal-50"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <t.icon className={cn("relative h-4 w-4", tab === t.id && "text-teal")} />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-5 space-y-3"
            >
              {tab === "meds" && meds.map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Pill className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="font-display text-base font-bold text-navy">{m.name} <span className="font-sans text-sm font-normal text-navy/50">{m.dose}</span></div>
                    <div className="text-xs text-navy/55">{m.reason} · {m.route}</div>
                  </div>
                  <div className="text-right">
                    {m.prn ? <Badge tone="muted">PRN</Badge> : (
                      <div className="flex flex-wrap justify-end gap-1">
                        {m.schedule.map((t) => <Badge key={t} tone="teal"><Clock className="h-3 w-3" />{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {tab === "logs" && logs.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-sm text-navy/50 shadow-soft border border-navy/5">No logs yet today.</div>
              )}
              {tab === "logs" && logs.map((l) => {
                const st = staffById(l.staffId);
                return (
                  <div key={l.id} className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold text-navy">{l.title}</span>
                      <Badge tone="muted">{l.category}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-navy/65">{l.note}</p>
                    <div className="mt-2 text-2xs text-navy/40">{l.time} · {st?.name}</div>
                  </div>
                );
              })}

              {tab === "docs" && docs.map((d) => (
                <div key={d.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy"><FileText className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy">{d.name}</div>
                    <div className="text-xs text-navy/50">{d.type} · Updated {d.updated}</div>
                  </div>
                  <Button size="sm" variant="ghost">Open</Button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Pill, CalendarClock, ClipboardList, ArrowRight, AlertOctagon, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/radiant/Avatar";
import { useDemoStore } from "@/lib/store";
import { medById } from "@/lib/mock/meds";
import { residentById, residents } from "@/lib/mock/residents";
import { dailyLogs } from "@/lib/mock/logs";
import { incidents } from "@/lib/mock/incidents";
import { staffById } from "@/lib/mock/homes";

export default function TodayPage() {
  const admins = useDemoStore((s) => s.administrations);
  const dueNow = admins.filter((a) => a.status === "due");
  const upcoming = admins.filter((a) => a.status === "upcoming").slice(0, 3);
  const openIncident = incidents.find((i) => i.status === "open");

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Sunrise House · Friday, June 13" title="Today">
        <Badge tone="teal"><Sun className="h-3.5 w-3.5" /> Day shift</Badge>
        <Link href="/app/medications"><Button size="sm" variant="primary">Start med pass <ArrowRight className="h-4 w-4" /></Button></Link>
      </PageHeader>

      {/* Handoff summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-navy p-7 text-white shadow-lift"
      >
        <div className="text-xs font-bold uppercase tracking-widest text-amber">Shift handoff</div>
        <p className="mt-3 max-w-3xl text-lg text-white/85">
          Quiet, steady morning. Lena King reported a brief aura at 8:20 — no seizure, monitoring closely.
          Marcus has a dental appointment at 2:30. Eleanor Thompson is on-site visiting Marcus.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="due">1 resident to monitor</Badge>
          <Badge tone="teal">1 appointment</Badge>
          <Badge tone="coral">1 visitor on-site</Badge>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meds due */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
                <Pill className="h-5 w-5 text-teal" /> Medications due now
              </h2>
              <Link href="/app/medications" className="text-xs font-semibold text-teal hover:underline">View all</Link>
            </div>
            <div className="mt-4 space-y-3">
              {dueNow.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-[#E7F2EC] p-4 text-sm font-semibold text-ok">
                  <CheckCircle2 className="h-5 w-5" /> All caught up — nothing due right now.
                </div>
              )}
              {dueNow.map((a) => {
                const med = medById(a.medId);
                const res = residentById(med.residentId)!;
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-navy/5 bg-cream/50 p-3.5">
                    <Avatar name={res.name} color={res.photoColor} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-navy">{med.name} <span className="font-normal text-navy/50">{med.dose}</span></div>
                      <div className="text-xs text-navy/55">{res.name} · {a.scheduledTime}</div>
                    </div>
                    <Badge tone="due">Due</Badge>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent logs */}
          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
                <ClipboardList className="h-5 w-5 text-coral" /> Recent activity
              </h2>
              <Link href="/app/logs/new" className="text-xs font-semibold text-teal hover:underline">Add log</Link>
            </div>
            <div className="mt-4 space-y-1">
              {dailyLogs.map((l) => {
                const res = residentById(l.residentId)!;
                const st = staffById(l.staffId);
                return (
                  <div key={l.id} className="flex gap-3 rounded-xl p-3 hover:bg-cream/60 transition">
                    <Avatar name={res.name} color={res.photoColor} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy">{l.title}</span>
                        <Badge tone="muted">{l.category}</Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-navy/55">{l.note}</p>
                      <div className="mt-0.5 text-2xs text-navy/40">{res.name} · {l.time} · {st?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
              <CalendarClock className="h-5 w-5 text-teal" /> Upcoming
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-teal/20 bg-teal-50 p-3.5">
                <div className="text-xs font-bold text-teal-700">2:30 PM · Appointment</div>
                <div className="mt-0.5 text-sm font-semibold text-navy">Marcus Thompson — Dental</div>
              </div>
              {upcoming.map((a) => {
                const med = medById(a.medId);
                const res = residentById(med.residentId)!;
                return (
                  <div key={a.id} className="flex items-center gap-2 rounded-xl border border-navy/5 p-3">
                    <span className="text-xs font-bold text-navy/50 w-12">{a.scheduledTime}</span>
                    <div className="text-xs text-navy/70"><span className="font-semibold">{med.name}</span> · {res.name.split(" ")[0]}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {openIncident && (
            <Link href="/app/incidents/new" className="block focus-ring rounded-3xl">
              <section className="rounded-3xl border border-alert/20 bg-[#F8E7E2] p-6">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-alert">
                  <AlertOctagon className="h-5 w-5" /> Open incident
                </h2>
                <p className="mt-2 text-sm font-semibold text-navy">{openIncident.type}</p>
                <p className="mt-1 line-clamp-2 text-xs text-navy/60">{openIncident.whatHappened}</p>
                <div className="mt-3 text-xs font-semibold text-alert">Review report →</div>
              </section>
            </Link>
          )}

          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="font-display text-base font-bold text-navy">House at a glance</h2>
            <div className="mt-3 flex -space-x-2">
              {residents.filter((r) => r.homeId === "h1").map((r) => (
                <div key={r.id} className="ring-2 ring-white rounded-full">
                  <Avatar name={r.name} color={r.photoColor} size={38} />
                </div>
              ))}
            </div>
            <Link href="/app/residents" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
              View all residents <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

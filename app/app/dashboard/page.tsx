"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home, Users, PillBottle, AlertOctagon, ShieldCheck, DoorOpen, BadgeCheck,
  FileDown, Clock4, FileBarChart, Activity, DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { StatCard } from "@/components/radiant/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/radiant/Avatar";
import { useDemoStore, shiftHours, formatDuration } from "@/lib/store";
import { homes, staff } from "@/lib/mock/homes";
import { residents, residentById } from "@/lib/mock/residents";
import { incidents } from "@/lib/mock/incidents";
import { medById } from "@/lib/mock/meds";
import { dailyLogs } from "@/lib/mock/logs";

export default function DashboardPage() {
  const admins = useDemoStore((s) => s.administrations);
  const visits = useDemoStore((s) => s.visits);
  const shifts = useDemoStore((s) => s.shifts);

  const now = Date.now();
  const payroll = staff
    .map((m) => {
      const todays = shifts.filter((sh) => sh.staffId === m.id);
      const hours = todays.reduce((acc, sh) => acc + shiftHours(sh, now), 0);
      return { staff: m, hours, pay: hours * m.hourlyRate, active: todays.some((sh) => !sh.clockOut) };
    })
    .filter((r) => r.hours > 0)
    .sort((a, b) => b.pay - a.pay);
  const totalPay = payroll.reduce((a, r) => a + r.pay, 0);

  const onShift = staff.filter((s) => s.onShift).length;
  const given = admins.filter((a) => a.status === "given").length;
  const refusedOrHeld = admins.filter((a) => ["refused", "held"].includes(a.status)).length;
  const totalDispensable = given + refusedOrHeld || 1;
  const compliance = (given / totalDispensable) * 100;
  const missed = 0;
  const openIncidents = incidents.filter((i) => i.status === "open").length;
  const onSite = visits.filter((v) => v.onSite).length;
  const validationsDue = staff.filter((s) => {
    const days = (new Date(s.medValidationExpiry).getTime() - new Date("2026-06-13").getTime()) / 86400000;
    return days <= 14;
  }).length;

  // Build activity feed
  const activity = [
    ...dailyLogs.map((l) => ({ time: l.time, who: residentById(l.residentId)!, what: l.title, kind: "Log", tone: "navy" as const })),
    ...admins.filter((a) => a.status === "given").map((a) => {
      const m = medById(a.medId);
      return { time: a.at || a.scheduledTime, who: residentById(m.residentId)!, what: `${m.name} given`, kind: "Med", tone: "ok" as const };
    }),
    ...incidents.map((i) => ({ time: i.time, who: residentById(i.residentId)!, what: i.type, kind: "Incident", tone: "alert" as const })),
    ...visits.filter((v) => v.onSite).map((v) => ({ time: v.checkIn, who: residentById(v.visitingResidentId)!, what: `${v.visitorName} checked in`, kind: "Visitor", tone: "teal" as const })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8);

  const toneBadge = { navy: "navy", ok: "ok", alert: "alert", teal: "teal" } as const;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Owner view · Patricia Adeyemi" title="Dashboard">
        <Badge tone="teal"><Home className="h-3.5 w-3.5" /> {homes.length} homes</Badge>
      </PageHeader>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard index={0} label="Homes" value={homes.length} icon={Home} tone="navy" hint="Sunrise · Lakeside" />
        <StatCard index={1} label="Staff on shift" value={onShift} icon={Users} tone="teal" />
        <StatCard index={2} label="Missed meds" value={missed} icon={PillBottle} tone="ok" hint="Today" />
        <StatCard index={3} label="Open incidents" value={openIncidents} icon={AlertOctagon} tone="due" />
        <StatCard index={4} label="Med compliance" value={compliance} decimals={1} suffix="%" icon={ShieldCheck} tone="ok" />
        <StatCard index={5} label="Visitors on-site" value={onSite} icon={DoorOpen} tone="coral" />
        <StatCard index={6} label="Validations due" value={validationsDue} icon={BadgeCheck} tone="alert" hint="Next 14 days" />
        <StatCard index={7} label="Residents" value={residents.length} icon={Users} tone="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live activity */}
        <section className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <Activity className="h-5 w-5 text-teal" /> Live activity
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream/60 text-2xs uppercase tracking-wide text-navy/45">
                <tr>
                  <th className="px-4 py-3 font-bold">Time</th>
                  <th className="px-4 py-3 font-bold">Resident</th>
                  <th className="px-4 py-3 font-bold">Event</th>
                  <th className="px-4 py-3 font-bold">Type</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a, i) => (
                  <motion.tr key={i}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-t border-navy/5 hover:bg-cream/40">
                    <td className="px-4 py-3 font-semibold text-navy/60">{a.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.who.name} color={a.who.photoColor} size={26} />
                        <span className="font-semibold text-navy">{a.who.name.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy/70">{a.what}</td>
                    <td className="px-4 py-3"><Badge tone={toneBadge[a.tone]}>{a.kind}</Badge></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick actions + homes */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
                <DollarSign className="h-5 w-5 text-teal" /> Payroll today
              </h2>
              <Link href="/app/timeclock" className="text-xs font-semibold text-teal hover:underline">Time clock</Link>
            </div>
            <div className="mt-4 space-y-2">
              {payroll.map((r) => (
                <div key={r.staff.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-2.5">
                  <Avatar name={r.staff.name} color={r.staff.avatarColor} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-navy">{r.staff.name}</div>
                    <div className="text-2xs text-navy/50">{formatDuration(r.hours)}{r.active && <span className="font-semibold text-ok"> · on clock</span>}</div>
                  </div>
                  <div className="font-display text-sm font-extrabold text-navy tabular-nums">${r.pay.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-navy/8 pt-3">
              <span className="text-xs font-semibold text-navy/55">Total so far</span>
              <span className="font-display text-lg font-extrabold text-teal tabular-nums">${totalPay.toFixed(2)}</span>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="font-display text-base font-bold text-navy">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start"><FileDown className="h-4 w-4" /> Export inspection record</Button>
              <Link href="/app/timeclock"><Button variant="outline" className="w-full justify-start"><Clock4 className="h-4 w-4" /> Approve timecards</Button></Link>
              <Button variant="outline" className="w-full justify-start"><FileBarChart className="h-4 w-4" /> Generate monthly report</Button>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <h2 className="font-display text-base font-bold text-navy">Homes</h2>
            <div className="mt-4 space-y-3">
              {homes.map((h) => {
                const count = residents.filter((r) => r.homeId === h.id).length;
                const shift = staff.filter((s) => s.homeId === h.id && s.onShift).length;
                return (
                  <div key={h.id} className="rounded-2xl bg-cream/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-base font-bold text-navy">{h.name}</div>
                      <Badge tone="teal">{shift} on shift</Badge>
                    </div>
                    <div className="mt-1 text-xs text-navy/55">{h.city} · {count}/{h.capacity} residents</div>
                    <div className="mt-2 text-2xs text-navy/40">License {h.licenseNo}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

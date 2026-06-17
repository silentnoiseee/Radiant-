"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, PillBottle, AlertOctagon, ShieldCheck, DoorOpen,
  FileDown, Clock4, FileBarChart, Activity, DollarSign, X, ArrowRight, Lock, Boxes, AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { StatCard } from "@/components/radiant/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/radiant/Avatar";
import { useDemoStore, shiftHours, formatDuration, formatTime } from "@/lib/store";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn, initials } from "@/lib/utils";
import { homes, homeById } from "@/lib/mock/homes";
import { residents, residentById } from "@/lib/mock/residents";
import { incidents } from "@/lib/mock/incidents";
import { medById } from "@/lib/mock/meds";
import { dailyLogs } from "@/lib/mock/logs";
import type { IncidentSeverity } from "@/lib/types";

type StaffRow = { id: string; full_name: string | null; role: string; hourly_rate: number; avatar_url: string | null };
type LowItem = { id: string; home_id: string; name: string; status: "low" | "out"; updated_by_name: string | null };
type MedRow = { id: string; resident_id: string; resident_name: string; med_name: string; dose: string | null; scheduled_time: string; status: "due" | "given" | "refused" | "held" | "missed"; recorded_by_name: string | null };
type Detail = null | "homes" | "onShift" | "incidents" | "staff" | "residents" | "supplies" | "missed" | "compliance" | "visitors";

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

const sevTone: Record<IncidentSeverity, "ok" | "due" | "alert"> = { low: "ok", moderate: "due", high: "alert" };

function StaffAvatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" style={{ height: size, width: size }} className="rounded-full object-cover" />;
  }
  return (
    <div style={{ height: size, width: size }} className="flex items-center justify-center rounded-full bg-teal text-2xs font-bold text-white">
      {name ? initials(name) : "?"}
    </div>
  );
}

export default function DashboardPage() {
  const admins = useDemoStore((s) => s.administrations);
  const visits = useDemoStore((s) => s.visits);
  const shifts = useDemoStore((s) => s.shifts);
  const loadVisits = useDemoStore((s) => s.loadVisits);
  const loadShifts = useDemoStore((s) => s.loadShifts);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [lowSupplies, setLowSupplies] = useState<LowItem[]>([]);
  const [meds, setMeds] = useState<MedRow[]>([]);
  const [detail, setDetail] = useState<Detail>(null);
  const { profile } = useAuth();

  useEffect(() => {
    loadVisits();
    loadShifts();
    supabase
      .from("profiles")
      .select("id, full_name, role, hourly_rate, avatar_url")
      .in("role", ["manager", "caregiver"])
      .then(({ data }) => { if (data) setStaff(data as StaffRow[]); });
    supabase
      .from("inventory_items")
      .select("id, home_id, name, status, updated_by_name")
      .in("status", ["low", "out"])
      .then(({ data }) => { if (data) setLowSupplies(data as LowItem[]); });
    supabase
      .from("med_administrations")
      .select("id, resident_id, resident_name, med_name, dose, scheduled_time, status, recorded_by_name")
      .eq("home_id", "h1")
      .order("scheduled_time", { ascending: true })
      .then(({ data }) => { if (data) setMeds(data as MedRow[]); });
  }, [loadVisits, loadShifts]);

  const now = Date.now();

  const payroll = useMemo(() => {
    return staff
      .map((m) => {
        const todays = shifts.filter((sh) => sh.staffId === m.id && isToday(sh.clockIn));
        const hours = todays.reduce((acc, sh) => acc + shiftHours(sh, now), 0);
        const active = shifts.some((sh) => sh.staffId === m.id && !sh.clockOut);
        return { staff: m, hours, pay: hours * Number(m.hourly_rate ?? 0), active };
      })
      .filter((r) => r.hours > 0)
      .sort((a, b) => b.pay - a.pay);
  }, [staff, shifts, now]);
  const totalPay = payroll.reduce((a, r) => a + r.pay, 0);

  const onShiftStaff = staff
    .map((m) => ({ staff: m, open: shifts.find((sh) => sh.staffId === m.id && !sh.clockOut) }))
    .filter((r) => r.open);
  const onShift = onShiftStaff.length;
  const staffCount = staff.length;

  const medGiven = meds.filter((m) => m.status === "given").length;
  const medMissedList = meds.filter((m) => m.status === "missed");
  const medRefused = meds.filter((m) => m.status === "refused").length;
  const medHeld = meds.filter((m) => m.status === "held").length;
  const medDue = meds.filter((m) => m.status === "due").length;
  const medActioned = medGiven + medMissedList.length + medRefused + medHeld;
  const compliance = medActioned > 0 ? (medGiven / medActioned) * 100 : 100;
  const missed = medMissedList.length;
  const openIncidentsList = incidents.filter((i) => i.status === "open");
  const onSite = visits.filter((v) => v.onSite).length;

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

  const detailTitle: Record<Exclude<Detail, null>, string> = {
    homes: "Homes",
    supplies: "Supplies running low",
    missed: "Missed medications",
    compliance: "Medication compliance",
    visitors: "Visitors on-site",
    onShift: "Staff on shift",
    incidents: "Open incidents",
    staff: "Registered staff",
    residents: "Residents",
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={`${profile?.is_owner ? "Owner" : "Manager"} view · ${profile?.full_name || "You"}`} title="Dashboard">
        <Badge tone="teal"><Home className="h-3.5 w-3.5" /> {homes.length} homes</Badge>
      </PageHeader>

      {lowSupplies.length > 0 && (
        <button onClick={() => setDetail("supplies")} className="flex w-full items-center gap-3 rounded-2xl border border-due/30 bg-[#FBF3D8] p-4 text-left transition hover:brightness-[0.98] focus-ring">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"><AlertTriangle className="h-4 w-4 text-due" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-navy">{lowSupplies.length} {lowSupplies.length === 1 ? "supply needs" : "supplies need"} restocking</div>
            <div className="text-2xs text-navy/55">Flagged by caregivers · tap to review</div>
          </div>
          <ArrowRight className="h-4 w-4 text-navy/40" />
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard index={0} label="Homes" value={homes.length} icon={Home} tone="navy" hint="Radiant East · West" onClick={() => setDetail("homes")} />
        <StatCard index={1} label="Staff on shift" value={onShift} icon={Users} tone="teal" hint="Clocked in now" onClick={() => setDetail("onShift")} />
        <StatCard index={2} label="Missed meds" value={missed} icon={PillBottle} tone={missed > 0 ? "alert" : "ok"} hint="Today" onClick={() => setDetail("missed")} />
        <StatCard index={3} label="Open incidents" value={openIncidentsList.length} icon={AlertOctagon} tone="due" onClick={() => setDetail("incidents")} />
        <StatCard index={4} label="Med compliance" value={compliance} decimals={1} suffix="%" icon={ShieldCheck} tone="ok" onClick={() => setDetail("compliance")} />
        <StatCard index={5} label="Visitors on-site" value={onSite} icon={DoorOpen} tone="coral" onClick={() => setDetail("visitors")} />
        <StatCard index={6} label="Registered staff" value={staffCount} icon={Users} tone="navy" onClick={() => setDetail("staff")} />
        <StatCard index={7} label="Residents" value={residents.length} icon={Users} tone="navy" onClick={() => setDetail("residents")} />
        <StatCard index={8} label="Supplies low" value={lowSupplies.length} icon={Boxes} tone="due" hint="Reported by staff" onClick={() => setDetail("supplies")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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

        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
                <DollarSign className="h-5 w-5 text-teal" /> Payroll today
              </h2>
              <Link href="/app/timeclock" className="text-xs font-semibold text-teal hover:underline">Time clock</Link>
            </div>
            <div className="mt-4 space-y-2">
              {payroll.length === 0 && <p className="text-sm text-navy/45">No one has clocked in yet today.</p>}
              {payroll.map((r) => (
                <div key={r.staff.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-2.5">
                  <StaffAvatar name={r.staff.full_name || ""} url={r.staff.avatar_url} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-navy">{r.staff.full_name || "Unnamed"}</div>
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
                if (!h.operational) {
                  return (
                    <div key={h.id} className="rounded-2xl border border-dashed border-navy/15 bg-cream/40 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-display text-base font-bold text-navy/55">{h.name}</div>
                        <Badge tone="due"><Lock className="h-3 w-3" /> Under construction</Badge>
                      </div>
                      <div className="mt-1 text-xs text-navy/45">Not yet operational</div>
                    </div>
                  );
                }
                return (
                  <Link key={h.id} href={`/app/homes/${h.id}`} className="block rounded-2xl bg-cream/60 p-4 transition hover:bg-navy-50 focus-ring">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-base font-bold text-navy">{h.name}</div>
                      <Badge tone="teal">{count} residents</Badge>
                    </div>
                    <div className="mt-1 text-xs text-navy/55">{h.city} · {count}/{h.capacity} capacity</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-2xs text-navy/40">License {h.licenseNo}</span>
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold text-teal">View <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-lift"
            >
              <div className="flex items-center justify-between border-b border-navy/8 px-6 py-4">
                <h3 className="font-display text-lg font-extrabold text-navy">{detail ? detailTitle[detail] : ""}</h3>
                <button onClick={() => setDetail(null)} className="flex h-8 w-8 items-center justify-center rounded-full text-navy/50 hover:bg-navy-50 focus-ring" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[64vh] overflow-y-auto p-5">
                {detail === "supplies" && (
                  <div className="space-y-2">
                    {lowSupplies.length === 0 && <p className="text-sm text-navy/50">Everything is stocked. 🎉</p>}
                    {lowSupplies.map((it) => (
                      <Link key={it.id} href={`/app/homes/${it.home_id}`} onClick={() => setDetail(null)}
                        className="flex items-center gap-3 rounded-xl bg-cream/60 p-3 transition hover:bg-navy-50 focus-ring">
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", it.status === "out" ? "bg-[#F8E7E2] text-alert" : "bg-[#FBF3D8] text-due")}>
                          <AlertTriangle className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{it.name}</div>
                          <div className="text-2xs text-navy/55">{homeById(it.home_id)?.name}{it.updated_by_name ? ` · reported by ${it.updated_by_name}` : ""}</div>
                        </div>
                        <Badge tone={it.status === "out" ? "alert" : "due"}>{it.status === "out" ? "Out" : "Low"}</Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {detail === "missed" && (
                  <div className="space-y-2">
                    {medMissedList.length === 0 && <p className="text-sm text-navy/50">No missed medications today. 🎉</p>}
                    {medMissedList.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8E7E2] text-alert"><AlertTriangle className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{m.med_name} <span className="font-normal text-navy/50">{m.dose}</span></div>
                          <div className="text-2xs text-navy/55">{m.resident_name} · scheduled {m.scheduled_time}</div>
                        </div>
                        <Badge tone="alert">Missed</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {detail === "compliance" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-cream/60 p-5 text-center">
                      <div className="font-display text-4xl font-extrabold text-navy tabular-nums">{compliance.toFixed(1)}%</div>
                      <div className="mt-1 text-2xs text-navy/55">of actioned doses given today</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-[#E7F2EC] p-3"><div className="font-display text-xl font-extrabold text-ok">{medGiven}</div><div className="text-2xs font-semibold text-navy/55">Given</div></div>
                      <div className="rounded-xl bg-[#F8E7E2] p-3"><div className="font-display text-xl font-extrabold text-alert">{missed}</div><div className="text-2xs font-semibold text-navy/55">Missed</div></div>
                      <div className="rounded-xl bg-[#FBF3D8] p-3"><div className="font-display text-xl font-extrabold text-due">{medRefused}</div><div className="text-2xs font-semibold text-navy/55">Refused</div></div>
                      <div className="rounded-xl bg-navy-50 p-3"><div className="font-display text-xl font-extrabold text-navy">{medHeld}</div><div className="text-2xs font-semibold text-navy/55">Held</div></div>
                      <div className="rounded-xl bg-cream/70 p-3"><div className="font-display text-xl font-extrabold text-navy/60">{medDue}</div><div className="text-2xs font-semibold text-navy/55">Due</div></div>
                      <div className="rounded-xl bg-cream/70 p-3"><div className="font-display text-xl font-extrabold text-navy">{meds.length}</div><div className="text-2xs font-semibold text-navy/55">Total</div></div>
                    </div>
                    <div className="space-y-1.5">
                      {meds.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 rounded-xl border border-navy/5 p-2.5">
                          <span className="w-12 text-2xs font-semibold text-navy/45">{m.scheduled_time}</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-bold text-navy">{m.med_name} <span className="font-normal text-navy/45">{m.dose}</span></div>
                            <div className="text-2xs text-navy/50">{m.resident_name}</div>
                          </div>
                          <span className={cn("rounded-full px-2 py-0.5 text-2xs font-bold capitalize",
                            m.status === "given" ? "bg-[#E7F2EC] text-ok" : m.status === "missed" ? "bg-[#F8E7E2] text-alert" : m.status === "refused" ? "bg-[#FBF3D8] text-due" : m.status === "held" ? "bg-navy-50 text-navy" : "bg-cream text-navy/50")}>{m.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detail === "visitors" && (
                  <div className="space-y-2">
                    {visits.filter((v) => v.onSite).length === 0 && <p className="text-sm text-navy/50">No visitors on-site right now.</p>}
                    {visits.filter((v) => v.onSite).map((v) => (
                      <div key={v.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/15 text-coral-600"><DoorOpen className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{v.visitorName}</div>
                          <div className="text-2xs text-navy/55">Visiting {residentById(v.visitingResidentId)?.name ?? "—"} · in at {v.checkIn}</div>
                        </div>
                        <Badge tone="teal">On-site</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {detail === "homes" && (
                  <div className="space-y-2">
                    {homes.map((h) => {
                      const count = residents.filter((r) => r.homeId === h.id).length;
                      if (!h.operational) {
                        return (
                          <div key={h.id} className="rounded-2xl border border-dashed border-navy/15 bg-cream/40 p-4">
                            <div className="flex items-center justify-between">
                              <div className="font-display text-sm font-bold text-navy/55">{h.name}</div>
                              <Badge tone="due"><Lock className="h-3 w-3" /> Under construction</Badge>
                            </div>
                            <div className="mt-1 text-2xs text-navy/45">Not yet operational</div>
                          </div>
                        );
                      }
                      return (
                        <Link key={h.id} href={`/app/homes/${h.id}`} onClick={() => setDetail(null)}
                          className="flex items-center gap-3 rounded-2xl bg-cream/60 p-4 transition hover:bg-navy-50 focus-ring">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><Home className="h-5 w-5" /></div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-navy">{h.name}</div>
                            <div className="text-2xs text-navy/55">{h.city} · {count}/{h.capacity} capacity</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-navy/30" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {detail === "onShift" && (
                  <div className="space-y-2">
                    {onShiftStaff.length === 0 && <p className="text-sm text-navy/50">Nobody is clocked in right now.</p>}
                    {onShiftStaff.map((r) => (
                      <div key={r.staff.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                        <StaffAvatar name={r.staff.full_name || ""} url={r.staff.avatar_url} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{r.staff.full_name || "Unnamed"}</div>
                          <div className="text-2xs text-navy/55">{r.staff.role[0].toUpperCase() + r.staff.role.slice(1)} · since {r.open ? formatTime(r.open.clockIn) : ""}</div>
                        </div>
                        <Badge tone="ok"><span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" /> {r.open ? formatDuration(shiftHours(r.open, now)) : ""}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {detail === "incidents" && (
                  <div className="space-y-3">
                    {openIncidentsList.length === 0 && <p className="text-sm text-navy/50">No open incidents. 🎉</p>}
                    {openIncidentsList.map((i) => {
                      const res = residentById(i.residentId);
                      return (
                        <div key={i.id} className="rounded-2xl border border-navy/5 bg-cream/50 p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold text-navy">{i.type}</span>
                            <Badge tone={sevTone[i.severity]}>{i.severity}</Badge>
                          </div>
                          <div className="mt-1 text-2xs text-navy/55">{res?.name} · {i.time}</div>
                          <p className="mt-2 text-xs text-navy/70">{i.whatHappened}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {detail === "staff" && (
                  <div className="space-y-2">
                    {staff.length === 0 && <p className="text-sm text-navy/50">No staff registered yet.</p>}
                    {staff.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                        <StaffAvatar name={m.full_name || ""} url={m.avatar_url} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{m.full_name || "Unnamed"}</div>
                          <div className="text-2xs text-navy/55">{m.role[0].toUpperCase() + m.role.slice(1)}</div>
                        </div>
                        <div className="text-2xs font-semibold text-navy/55 tabular-nums">${Number(m.hourly_rate ?? 0).toFixed(2)}/hr</div>
                      </div>
                    ))}
                  </div>
                )}

                {detail === "residents" && (
                  <div className="space-y-2">
                    {residents.map((r) => (
                      <Link
                        key={r.id}
                        href={`/app/residents/${r.id}`}
                        onClick={() => setDetail(null)}
                        className="flex items-center gap-3 rounded-xl bg-cream/60 p-3 transition hover:bg-navy-50 focus-ring"
                      >
                        <Avatar name={r.name} color={r.photoColor} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-navy">{r.name}</div>
                          <div className="text-2xs text-navy/55">{homeById(r.homeId).name} · Room {r.room}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-navy/30" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

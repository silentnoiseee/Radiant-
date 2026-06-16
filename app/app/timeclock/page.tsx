"use client";
import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut, DollarSign, Timer, Pencil } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore, shiftHours, formatDuration } from "@/lib/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { initials } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

type StaffRow = {
  id: string;
  full_name: string | null;
  role: string;
  hourly_rate: number;
  avatar_url: string | null;
};

function MiniAvatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-9 w-9 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-display text-xs font-bold text-white">
      {name ? initials(name) : "?"}
    </div>
  );
}

export default function TimeClockPage() {
  const now = useNow();
  const { profile, session } = useAuth();
  const shifts = useDemoStore((s) => s.shifts);
  const clockIn = useDemoStore((s) => s.clockIn);
  const clockOut = useDemoStore((s) => s.clockOut);
  const loadShifts = useDemoStore((s) => s.loadShifts);

  const isManager = profile?.role === "manager" || profile?.is_owner;
  const uid = session?.user.id ?? "";
  const myRate = Number(profile?.hourly_rate ?? 0);
  const myName = profile?.full_name || "You";

  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState("");

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  async function loadStaff() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role, hourly_rate, avatar_url")
      .in("role", ["manager", "caregiver"])
      .order("full_name");
    if (data) setStaff(data as StaffRow[]);
  }
  useEffect(() => {
    if (isManager) loadStaff();
  }, [isManager]);

  // --- my own shift / hours ---
  const myOpenShift = shifts.find((s) => s.staffId === uid && !s.clockOut);
  const myHoursToday = useMemo(
    () =>
      shifts
        .filter((s) => s.staffId === uid && isToday(s.clockIn))
        .reduce((acc, s) => acc + shiftHours(s, now), 0),
    [shifts, uid, now]
  );
  const myPayToday = myHoursToday * myRate;

  async function toggleClock() {
    if (busy || !uid) return;
    setBusy(true);
    if (myOpenShift) await clockOut(uid);
    else await clockIn(uid);
    setBusy(false);
  }

  // --- team rows (managers only) ---
  const teamRows = useMemo(() => {
    return staff
      .map((m) => {
        const todays = shifts.filter((s) => s.staffId === m.id && isToday(s.clockIn));
        const hours = todays.reduce((acc, s) => acc + shiftHours(s, now), 0);
        const active = shifts.some((s) => s.staffId === m.id && !s.clockOut);
        return { staff: m, hours, pay: hours * Number(m.hourly_rate ?? 0), active };
      })
      .sort((a, b) => b.hours - a.hours);
  }, [staff, shifts, now]);

  const onClock = teamRows.filter((r) => r.active).length;

  async function saveRate(id: string) {
    const rate = parseFloat(rateInput);
    if (isNaN(rate) || rate < 0) {
      setEditingId(null);
      return;
    }
    await supabase.rpc("set_hourly_rate", { target: id, rate });
    setEditingId(null);
    await loadStaff();
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Staff" title="Time clock">
        {isManager && (
          <Badge tone="teal"><Timer className="h-3.5 w-3.5" /> {onClock} on the clock</Badge>
        )}
      </PageHeader>

      {/* Your own shift — everyone sees this */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-navy/5">
        <h2 className="font-display text-lg font-bold text-navy">Your shift</h2>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <MiniAvatar name={myName} url={profile?.avatar_url ?? null} />
            <div>
              <div className="font-display text-base font-bold text-navy">{myName}</div>
              {myOpenShift ? (
                <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-ok">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" /> On the clock ·{" "}
                  <span className="tabular-nums">{formatDuration(shiftHours(myOpenShift, now))}</span>
                </div>
              ) : (
                <div className="mt-1 text-sm text-navy/50">Not clocked in</div>
              )}
            </div>
          </div>
          <Button
            onClick={toggleClock}
            disabled={busy}
            variant={myOpenShift ? "outline" : "primary"}
            size="lg"
          >
            {myOpenShift ? <><LogOut className="h-5 w-5" /> Clock out</> : <><LogIn className="h-5 w-5" /> Clock in</>}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-navy/8 pt-5">
          <div>
            <div className="text-2xs font-bold uppercase tracking-wide text-navy/45">Hours today</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-navy tabular-nums">{formatDuration(myHoursToday)}</div>
          </div>
          <div>
            <div className="text-2xs font-bold uppercase tracking-wide text-navy/45">Pay today</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-teal tabular-nums">${myPayToday.toFixed(2)}</div>
          </div>
        </div>
        {myRate === 0 && (
          <p className="mt-3 text-2xs text-navy/45">Your hourly rate hasn&apos;t been set yet — ask your manager.</p>
        )}
      </section>

      {/* Team overview — managers/owner only */}
      {isManager && (
        <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <DollarSign className="h-5 w-5 text-teal" /> Team — today
          </h2>
          <div className="mt-4 space-y-2">
            {teamRows.length === 0 && (
              <p className="text-sm text-navy/45">No staff registered yet. Invite caregivers from the Invite page.</p>
            )}
            {teamRows.map((r) => (
              <div key={r.staff.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                <MiniAvatar name={r.staff.full_name || ""} url={r.staff.avatar_url} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-navy">
                    {r.staff.full_name || "Unnamed"}
                    {r.staff.id === uid && <span className="text-navy/40"> (you)</span>}
                  </div>
                  <div className="text-2xs text-navy/55">
                    {r.staff.role[0].toUpperCase() + r.staff.role.slice(1)}
                    {" · "}
                    {editingId === r.staff.id ? (
                      <span className="inline-flex items-center gap-1">
                        $
                        <input
                          autoFocus
                          inputMode="decimal"
                          value={rateInput}
                          onChange={(e) => setRateInput(e.target.value.replace(/[^\d.]/g, ""))}
                          onBlur={() => saveRate(r.staff.id)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveRate(r.staff.id); }}
                          className="w-16 rounded border border-navy/20 px-1 py-0.5 text-2xs"
                        />
                        /hr
                      </span>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 hover:text-navy"
                        onClick={() => { setEditingId(r.staff.id); setRateInput(String(r.staff.hourly_rate ?? 0)); }}
                      >
                        ${Number(r.staff.hourly_rate ?? 0).toFixed(2)}/hr <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    {r.active && <span className="font-semibold text-ok"> · on the clock</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xs text-navy/55 tabular-nums">{formatDuration(r.hours)}</div>
                  <div className="font-display text-base font-extrabold text-navy tabular-nums">${r.pay.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          {teamRows.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-navy/8 pt-4">
              <span className="text-sm font-semibold text-navy/60">Payroll so far today</span>
              <span className="font-display text-xl font-extrabold text-teal tabular-nums">
                ${teamRows.reduce((a, r) => a + r.pay, 0).toFixed(2)}
              </span>
            </div>
          )}
          <p className="mt-3 text-2xs text-navy/45">Tap a rate to set it. Caregivers only ever see their own hours and pay.</p>
        </section>
      )}
    </div>
  );
}

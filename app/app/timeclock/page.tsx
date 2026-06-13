"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Delete, X, DollarSign, Timer } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/radiant/Avatar";
import { useDemoStore, shiftHours, formatDuration } from "@/lib/store";
import { staff } from "@/lib/mock/homes";
import { cn } from "@/lib/utils";

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

export default function TimeClockPage() {
  const now = useNow();
  const shifts = useDemoStore((s) => s.shifts);
  const clockIn = useDemoStore((s) => s.clockIn);
  const clockOut = useDemoStore((s) => s.clockOut);

  const [selected, setSelected] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState<{ name: string; kind: "in" | "out" } | null>(null);

  const member = staff.find((s) => s.id === selected);
  const openShiftFor = (id: string) => shifts.find((sh) => sh.staffId === id && !sh.clockOut);

  function press(d: string) {
    setError(false);
    if (pin.length < 4) setPin(pin + d);
  }
  function backspace() {
    setError(false);
    setPin(pin.slice(0, -1));
  }
  function cancel() {
    setSelected(null); setPin(""); setError(false);
  }
  function confirm() {
    if (!member) return;
    if (pin !== member.pin) {
      setError(true);
      setPin("");
      return;
    }
    const isOpen = !!openShiftFor(member.id);
    if (isOpen) clockOut(member.id);
    else clockIn(member.id);
    setFlash({ name: member.name, kind: isOpen ? "out" : "in" });
    cancel();
    setTimeout(() => setFlash(null), 2600);
  }

  useEffect(() => {
    if (pin.length === 4) {
      const t = setTimeout(confirm, 150);
      return () => clearTimeout(t);
    }
  }, [pin]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClock = staff.filter((s) => openShiftFor(s.id));
  const dayRows = useMemo(() => {
    return staff
      .map((s) => {
        const todays = shifts.filter((sh) => sh.staffId === s.id);
        const hours = todays.reduce((acc, sh) => acc + shiftHours(sh, now), 0);
        return { staff: s, hours, pay: hours * s.hourlyRate, active: !!openShiftFor(s.id), shifts: todays };
      })
      .filter((r) => r.shifts.length > 0)
      .sort((a, b) => b.hours - a.hours);
  }, [shifts, now]);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Staff" title="Time clock">
        <Badge tone="teal"><Timer className="h-3.5 w-3.5" /> {onClock.length} on the clock</Badge>
      </PageHeader>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={cn(
              "flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold",
              flash.kind === "in" ? "bg-[#E7F2EC] text-ok" : "bg-navy-50 text-navy"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              {flash.kind === "in" ? <LogIn className="h-4 w-4 text-ok" /> : <LogOut className="h-4 w-4 text-navy" />}
            </span>
            {flash.name.split(" ")[0]} clocked {flash.kind === "in" ? "in" : "out"} at{" "}
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="font-display text-lg font-bold text-navy">Tap your name to clock in or out</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {staff.map((s) => {
              const open = openShiftFor(s.id);
              const live = open ? shiftHours(open, now) : 0;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelected(s.id); setPin(""); setError(false); }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition focus-ring",
                    open ? "border-ok/40 bg-[#E7F2EC]" : "border-navy/10 hover:bg-navy-50"
                  )}
                >
                  <Avatar name={s.name} color={s.avatarColor} size={46} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-base font-bold text-navy">{s.name}</div>
                    <div className="text-xs text-navy/55">{s.role} · ${s.hourlyRate}/hr</div>
                  </div>
                  {open ? (
                    <div className="text-right">
                      <Badge tone="ok"><span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" /> On</Badge>
                      <div className="mt-1 font-display text-sm font-bold text-ok tabular-nums">{formatDuration(live)}</div>
                    </div>
                  ) : (
                    <Badge tone="muted">Off</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <DollarSign className="h-5 w-5 text-teal" /> Today&apos;s hours &amp; pay
          </h2>
          <div className="mt-4 space-y-2">
            {dayRows.map((r) => (
              <div key={r.staff.id} className="flex items-center gap-3 rounded-xl bg-cream/60 p-3">
                <Avatar name={r.staff.name} color={r.staff.avatarColor} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-navy">{r.staff.name}</div>
                  <div className="text-2xs text-navy/55">
                    {formatDuration(r.hours)} × ${r.staff.hourlyRate}/hr
                    {r.active && <span className="text-ok font-semibold"> · live</span>}
                  </div>
                </div>
                <div className="font-display text-base font-extrabold text-navy tabular-nums">
                  ${r.pay.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-navy/8 pt-4">
            <span className="text-sm font-semibold text-navy/60">Payroll so far today</span>
            <span className="font-display text-xl font-extrabold text-teal tabular-nums">
              ${dayRows.reduce((a, r) => a + r.pay, 0).toFixed(2)}
            </span>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {member && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
            onClick={cancel}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lift"
            >
              <div className="flex items-center gap-3">
                <Avatar name={member.name} color={member.avatarColor} size={48} />
                <div>
                  <div className="font-display text-lg font-bold text-navy">{member.name}</div>
                  <div className="text-xs text-navy/55">
                    {openShiftFor(member.id) ? "Clock out" : "Clock in"} · enter PIN
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-4 w-4 rounded-full border-2 transition",
                      error ? "border-alert" : i < pin.length ? "border-teal bg-teal" : "border-navy/20"
                    )}
                  />
                ))}
              </div>
              {error && <p className="mt-3 text-center text-xs font-semibold text-alert">Incorrect PIN — try again.</p>}

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {["1","2","3","4","5","6","7","8","9"].map((d) => (
                  <button key={d} onClick={() => press(d)}
                    className="h-16 rounded-2xl bg-cream font-display text-2xl font-bold text-navy transition active:scale-95 hover:bg-navy-50 focus-ring">
                    {d}
                  </button>
                ))}
                <button onClick={cancel}
                  className="flex h-16 items-center justify-center rounded-2xl bg-cream text-navy/60 transition active:scale-95 hover:bg-navy-50 focus-ring">
                  <X className="h-6 w-6" />
                </button>
                <button onClick={() => press("0")}
                  className="h-16 rounded-2xl bg-cream font-display text-2xl font-bold text-navy transition active:scale-95 hover:bg-navy-50 focus-ring">
                  0
                </button>
                <button onClick={backspace}
                  className="flex h-16 items-center justify-center rounded-2xl bg-cream text-navy/60 transition active:scale-95 hover:bg-navy-50 focus-ring">
                  <Delete className="h-6 w-6" />
                </button>
              </div>

              <p className="mt-5 text-center text-2xs text-navy/40">
                Demo PINs · Grace 1234 · Tasha 2468 · Daniel 1357 · Renata 4321 · Marcus 8642
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

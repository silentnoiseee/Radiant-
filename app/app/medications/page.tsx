"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pill, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/radiant/Avatar";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { residentById } from "@/lib/mock/residents";
import { cn } from "@/lib/utils";

type Admin = {
  id: string;
  resident_id: string;
  resident_name: string;
  med_name: string;
  dose: string | null;
  scheduled_time: string;
  status: "due" | "given" | "refused" | "held" | "missed";
  recorded_by_name: string | null;
};

const ACTIONS: { id: Admin["status"]; label: string; btn: string }[] = [
  { id: "given", label: "Given", btn: "border-ok/40 bg-[#E7F2EC] text-ok" },
  { id: "refused", label: "Refused", btn: "border-due/40 bg-[#FBF3D8] text-due" },
  { id: "held", label: "Held", btn: "border-navy/20 bg-navy-50 text-navy" },
  { id: "missed", label: "Missed", btn: "border-alert/40 bg-[#F8E7E2] text-alert" },
];

function statusPill(status: Admin["status"]) {
  switch (status) {
    case "given": return "bg-[#E7F2EC] text-ok";
    case "missed": return "bg-[#F8E7E2] text-alert";
    case "refused": return "bg-[#FBF3D8] text-due";
    case "held": return "bg-navy-50 text-navy";
    default: return "bg-[#FBF3D8] text-due";
  }
}

export default function MedicationsPage() {
  const { profile } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);

  async function load() {
    const { data } = await supabase
      .from("med_administrations")
      .select("id, resident_id, resident_name, med_name, dose, scheduled_time, status, recorded_by_name")
      .eq("home_id", "h1")
      .order("scheduled_time", { ascending: true });
    if (data) setAdmins(data as Admin[]);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: Admin["status"]) {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await supabase
      .from("med_administrations")
      .update({
        status,
        recorded_by: profile?.id ?? null,
        recorded_by_name: profile?.full_name ?? null,
        recorded_at: new Date().toISOString(),
      })
      .eq("id", id);
    load();
  }

  const due = admins.filter((a) => a.status === "due");
  const followUp = admins.filter((a) => ["missed", "refused", "held"].includes(a.status));
  const given = admins.filter((a) => a.status === "given");
  const total = admins.length || 1;
  const pct = Math.round((given.length / total) * 100);

  function Row({ a }: { a: Admin }) {
    const res = residentById(a.resident_id);
    return (
      <div className="rounded-2xl bg-white p-4 shadow-soft border border-navy/5">
        <div className="flex items-center gap-3">
          <Avatar name={a.resident_name} color={res?.photoColor ?? "#2E8B8B"} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-navy">{a.med_name} <span className="font-normal text-navy/50">{a.dose}</span></div>
            <div className="text-2xs text-navy/55">{a.resident_name} · {a.scheduled_time}{a.recorded_by_name ? ` · ${a.recorded_by_name}` : ""}</div>
          </div>
          <span className={cn("rounded-full px-2.5 py-1 text-2xs font-bold capitalize", statusPill(a.status))}>{a.status}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ACTIONS.map((act) => (
            <button
              key={act.id}
              onClick={() => setStatus(a.id, act.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-2xs font-semibold transition focus-ring",
                a.status === act.id ? act.btn : "border-navy/10 text-navy/45 hover:bg-navy-50"
              )}
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Radiant East" title="Medication pass">
        <Badge tone="ok"><CheckCircle2 className="h-3.5 w-3.5" /> {given.length}/{admins.length} given</Badge>
      </PageHeader>

      <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
        <div className="flex items-center justify-between text-xs font-semibold text-navy/60">
          <span>Round progress</span><span>{pct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-navy-50">
          <motion.div className="h-full rounded-full bg-ok"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      {due.length > 0 ? (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy">
            <Clock className="h-5 w-5 text-due" /> Due ({due.length})
          </h2>
          <div className="space-y-3">{due.map((a) => <Row key={a.id} a={a} />)}</div>
        </section>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl bg-[#E7F2EC] p-5 text-sm font-semibold text-ok">
          <CheckCircle2 className="h-5 w-5" /> Nothing due right now — beautiful work.
        </div>
      )}

      {followUp.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-alert">
            <AlertTriangle className="h-5 w-5" /> Needs follow-up ({followUp.length})
          </h2>
          <div className="space-y-3">{followUp.map((a) => <Row key={a.id} a={a} />)}</div>
        </section>
      )}

      {given.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-navy/70">Given</h2>
          <div className="space-y-3 opacity-90">{given.map((a) => <Row key={a.id} a={a} />)}</div>
        </section>
      )}
    </div>
  );
}

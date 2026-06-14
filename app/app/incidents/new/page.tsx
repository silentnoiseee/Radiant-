"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, Send, ShieldAlert, Check } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/radiant/Avatar";
import { residents, residentById } from "@/lib/mock/residents";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { IncidentSeverity } from "@/lib/types";

const types = ["Fall", "Medical — Seizure", "Behavioral", "Medication error", "Injury", "Property", "Other"];
const sevs: { id: IncidentSeverity; label: string; tone: string }[] = [
  { id: "low", label: "Low", tone: "bg-[#E7F2EC] text-ok border-ok/30" },
  { id: "moderate", label: "Moderate", tone: "bg-[#FBF3D8] text-due border-due/30" },
  { id: "high", label: "High", tone: "bg-[#F8E7E2] text-alert border-alert/30" },
];

export default function NewIncidentPage() {
  const [resident, setResident] = useState("");
  const [type, setType] = useState("");
  const [sev, setSev] = useState<IncidentSeverity | "">("");
  const [what, setWhat] = useState("");
  const [action, setAction] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const valid = resident && type && sev && what.trim() && action.trim();

  async function submit() {
    setTouched(true);
    if (!valid || saving) return;
    setSaving(true);
    setError("");
    const { error: dbError } = await supabase.from("incidents").insert({
      resident_id: resident,
      home_id: residentById(resident)?.homeId ?? null,
      type,
      severity: sev,
      what_happened: what.trim(),
      action_taken: action.trim(),
      status: "open",
      reported_by: "s1",
    });
    setSaving(false);
    if (dbError) {
      setError("Could not save the report. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-alert text-white shadow-glow">
          <ShieldAlert className="h-10 w-10" strokeWidth={2.4} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mt-6 font-display text-2xl font-extrabold text-navy">Incident submitted &amp; team alerted</motion.h2>
        <p className="mt-2 max-w-sm text-navy/60">The manager, on-call nurse, and guardian have been notified. The report is saved to the resident&apos;s record.</p>
        <Button className="mt-8" onClick={() => { setSubmitted(false); setResident(""); setType(""); setSev(""); setWhat(""); setAction(""); setTouched(false); }}>
          File another report
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader eyebrow="Safety" title="Incident report">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8E7E2] px-3 py-1.5 text-2xs font-semibold text-alert">
          <AlertOctagon className="h-3.5 w-3.5" /> Notifies team on submit
        </span>
      </PageHeader>

      <div className="space-y-6 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-navy/5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Resident involved</label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {residents.map((r) => (
              <button key={r.id} onClick={() => setResident(r.id)}
                className={cn("flex items-center gap-2 rounded-xl border p-2.5 text-left transition focus-ring",
                  resident === r.id ? "border-teal bg-teal-50" : "border-navy/10 hover:bg-navy-50")}>
                <Avatar name={r.name} color={r.photoColor} size={32} />
                <span className="truncate text-xs font-semibold text-navy">{r.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          {touched && !resident && <p className="mt-2 text-2xs font-semibold text-alert">Required.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Type</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={cn("rounded-full border px-4 py-2 text-xs font-semibold transition focus-ring",
                  type === t ? "border-navy bg-navy text-white" : "border-navy/10 text-navy/60 hover:bg-navy-50")}>
                {t}
              </button>
            ))}
          </div>
          {touched && !type && <p className="mt-2 text-2xs font-semibold text-alert">Choose a type.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Severity</label>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {sevs.map((s) => (
              <button key={s.id} onClick={() => setSev(s.id)}
                className={cn("rounded-xl border-2 py-3 text-sm font-bold transition focus-ring",
                  sev === s.id ? s.tone : "border-navy/10 text-navy/50 hover:bg-navy-50")}>
                {s.label}
              </button>
            ))}
          </div>
          {touched && !sev && <p className="mt-2 text-2xs font-semibold text-alert">Select severity.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">What happened</label>
          <Textarea className="mt-2" placeholder="Describe objectively: where, when, who was present…" value={what} onChange={(e) => setWhat(e.target.value)} />
          {touched && !what.trim() && <p className="mt-2 text-2xs font-semibold text-alert">Required.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Action taken</label>
          <Textarea className="mt-2" placeholder="What did staff do? Who was notified?" value={action} onChange={(e) => setAction(e.target.value)} />
          {touched && !action.trim() && <p className="mt-2 text-2xs font-semibold text-alert">Required.</p>}
        </div>

        {error && <p className="text-center text-sm font-semibold text-alert">{error}</p>}

        <div className="flex items-center justify-between border-t border-navy/8 pt-5">
          <div className="flex items-center gap-2 text-xs text-navy/50"><Check className="h-4 w-4" /> Reporting as <span className="font-semibold text-navy">Grace Okafor</span></div>
          <Button variant="danger" onClick={submit} disabled={saving}><Send className="h-4 w-4" /> {saving ? "Submitting…" : "Submit & alert"}</Button>
        </div>
      </div>
    </div>
  );
}

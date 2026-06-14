"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Activity, Brain, MoreHorizontal, Check, PenLine } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/radiant/Avatar";
import { residents } from "@/lib/mock/residents";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { LogCategory } from "@/lib/types";

const cats: { id: LogCategory; label: string; icon: typeof Utensils }[] = [
  { id: "meal", label: "Meal", icon: Utensils },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "behavior", label: "Behavior", icon: Brain },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

export default function NewLogPage() {
  const [resident, setResident] = useState("");
  const [cat, setCat] = useState<LogCategory>("meal");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const valid = resident && title.trim() && note.trim();

  async function save() {
    setTouched(true);
    if (!valid || saving) return;
    setSaving(true);
    setError("");
    const { error: dbError } = await supabase.from("daily_logs").insert({
      resident_id: resident,
      category: cat,
      title: title.trim(),
      note: note.trim(),
      staff_id: "s2",
    });
    setSaving(false);
    if (dbError) {
      setError("Could not save the log. Please try again.");
      return;
    }
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-ok text-white shadow-glow">
          <Check className="h-10 w-10" strokeWidth={3} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mt-6 font-display text-2xl font-extrabold text-navy">Log signed &amp; saved</motion.h2>
        <p className="mt-2 text-navy/60">Your note has been added to the resident&apos;s record.</p>
        <Button className="mt-8" onClick={() => { setSaved(false); setResident(""); setTitle(""); setNote(""); setTouched(false); }}>
          Add another log
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader eyebrow="Documentation" title="New daily log" />

      <div className="space-y-6 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-navy/5">
        {/* Resident */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Resident</label>
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
          {touched && !resident && <p className="mt-2 text-2xs font-semibold text-alert">Please choose a resident.</p>}
        </div>

        {/* Category segmented */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Category</label>
          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-2xl bg-cream p-1.5">
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={cn("relative flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-semibold transition focus-ring",
                  cat === c.id ? "text-navy" : "text-navy/50 hover:text-navy")}>
                {cat === c.id && <motion.span layoutId="logcat" className="absolute inset-0 rounded-xl bg-white shadow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <c.icon className={cn("relative h-5 w-5", cat === c.id && "text-teal")} />
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Title</label>
          <Input className="mt-2" placeholder="e.g. Ate full lunch" value={title} onChange={(e) => setTitle(e.target.value)} />
          {touched && !title.trim() && <p className="mt-2 text-2xs font-semibold text-alert">A short title helps.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Notes</label>
          <Textarea className="mt-2" placeholder="What happened? Be specific and objective." value={note} onChange={(e) => setNote(e.target.value)} />
          {touched && !note.trim() && <p className="mt-2 text-2xs font-semibold text-alert">Notes are required.</p>}
        </div>

        {error && <p className="text-center text-sm font-semibold text-alert">{error}</p>}

        <div className="flex items-center justify-between border-t border-navy/8 pt-5">
          <div className="flex items-center gap-2 text-xs text-navy/50">
            <PenLine className="h-4 w-4" /> Signed as <span className="font-semibold text-navy">Tasha Bell</span>
          </div>
          <Button variant="teal" onClick={save} disabled={saving}><Check className="h-4 w-4" /> {saving ? "Saving…" : "Sign & save"}</Button>
        </div>
      </div>
    </div>
  );
}

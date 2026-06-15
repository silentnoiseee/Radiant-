"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check, ShieldCheck, Heart, LayoutDashboard, MailCheck } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

type StaffRole = "caregiver" | "manager";

const roleCards: { id: StaffRole; label: string; icon: typeof Heart; blurb: string }[] = [
  { id: "caregiver", label: "Caregiver", icon: Heart, blurb: "Logs, meds, incidents, residents, time clock." },
  { id: "manager", label: "Manager", icon: LayoutDashboard, blurb: "Full access including the owner dashboard." },
];

export default function InviteStaffPage() {
  const { profile } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<StaffRole>("caregiver");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);

  // Only the owner may send invites.
  if (profile && !profile.is_owner) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader eyebrow="Staff" title="Invite staff" />
        <div className="rounded-3xl border border-navy/5 bg-white p-8 text-center shadow-soft">
          <ShieldCheck className="mx-auto h-10 w-10 text-navy/30" />
          <p className="mt-3 text-sm font-semibold text-navy/60">Only the account owner can invite staff.</p>
        </div>
      </div>
    );
  }

  const valid = email.includes("@");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const redirectTo = `${window.location.origin}/accept-invite`;
    const { data, error: fnErr } = await supabase.functions.invoke("invite-user", {
      body: { email: email.trim(), role, full_name: fullName.trim(), redirectTo },
    });
    setBusy(false);
    if (fnErr) {
      // Try to surface the function's JSON error message if present.
      let msg = fnErr.message;
      try {
        const ctx = (fnErr as { context?: { body?: string } }).context;
        if (ctx?.body) {
          const parsed = JSON.parse(ctx.body);
          if (parsed?.error) msg = parsed.error;
        }
      } catch {
        /* keep default message */
      }
      setError(msg);
      return;
    }
    if (data?.error) {
      setError(data.error);
      return;
    }
    setSentTo(email.trim());
    setEmail("");
    setFullName("");
    setTouched(false);
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader eyebrow="Staff" title="Invite staff">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-2xs font-semibold text-teal-700">
          <ShieldCheck className="h-3.5 w-3.5" /> Owner only
        </span>
      </PageHeader>

      {sentTo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl bg-[#E7F2EC] p-4 text-sm font-semibold text-ok"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white"><MailCheck className="h-4 w-4 text-ok" /></span>
          Invite sent to {sentTo}. They&apos;ll get an email link to set their password.
        </motion.div>
      )}

      <form onSubmit={send} className="space-y-6 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-navy/5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Their email</label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
            <Input type="email" className="pl-9" placeholder="newstaff@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {touched && !valid && <p className="mt-2 text-2xs font-semibold text-alert">Enter a valid email.</p>}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Name (optional)</label>
          <Input className="mt-2" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Role</label>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {roleCards.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "relative rounded-2xl border-2 p-4 text-left transition focus-ring",
                  role === r.id ? "border-teal bg-teal-50" : "border-navy/10 hover:bg-navy-50"
                )}
              >
                {role === r.id && (
                  <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
                <r.icon className={cn("h-6 w-6", role === r.id ? "text-teal" : "text-navy/55")} strokeWidth={2.2} />
                <div className="mt-2 font-display text-base font-bold text-navy">{r.label}</div>
                <div className="mt-0.5 text-2xs leading-snug text-navy/55">{r.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-alert">{error}</p>}

        <div className="flex justify-end border-t border-navy/8 pt-5">
          <Button type="submit" variant="primary" disabled={busy}>
            <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </form>
    </div>
  );
}

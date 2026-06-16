"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, KeyRound, User, Lock, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AcceptInvitePage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const cleanCode = code.trim();
    if (!email.includes("@")) {
      setError("Enter the email your invite was sent to.");
      return;
    }
    if (!/^\d{6,12}$/.test(cleanCode)) {
      setError("Enter the numeric code from your invite email.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");

    // Verify the invite code — establishes the session for the new staff member.
    const { error: vErr } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: cleanCode,
      type: "invite",
    });
    if (vErr) {
      setBusy(false);
      setError("That code is incorrect or has expired. Ask your administrator to resend the invite.");
      return;
    }

    // Set their password.
    const { error: pErr } = await supabase.auth.updateUser({
      password,
      data: { full_name: fullName.trim() },
    });
    if (pErr) {
      setBusy(false);
      setError(pErr.message);
      return;
    }

    // Save their display name onto the profile too.
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (uid) {
      await supabase.from("profiles").update({ full_name: fullName.trim() }).eq("id", uid);
    }

    await refreshProfile();
    router.replace("/app");
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-cream container-px py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><Sparkles className="h-5 w-5 text-amber" /></div>
          <span className="font-display text-2xl font-extrabold text-navy">Radiant</span>
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-lift border border-navy/5 sm:p-10">
          <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-2xs font-bold text-teal-700 w-fit">
            <BadgeCheck className="h-3.5 w-3.5" /> Staff invite
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-navy">Join your team on Radiant</h1>
          <p className="mt-1.5 text-sm text-navy/55">Enter the code from your invite email, then set your password.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Your email</label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input type="email" required className="pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Invite code</label>
              <div className="relative mt-2">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input
                  inputMode="numeric"
                  maxLength={12}
                  required
                  className="pl-9 tracking-[0.3em] font-display text-lg"
                  placeholder="Code from email"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 12))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Your name</label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input required className="pl-9" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Create a password</label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input type="password" required className="pl-9" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm font-semibold text-alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
              {busy ? "Joining…" : <>Activate account <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-navy/55">
          Already set up?{" "}
          <Link href="/login" className="font-semibold text-teal hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}

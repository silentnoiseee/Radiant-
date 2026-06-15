"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, User, Lock, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AcceptInvitePage() {
  const router = useRouter();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Give the Supabase client a moment to parse the invite token from the URL.
  const [grace, setGrace] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setGrace(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (profile?.full_name && !fullName) setFullName(profile.full_name);
  }, [profile, fullName]);

  const roleLabel = profile?.role ? profile.role[0].toUpperCase() + profile.role.slice(1) : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || password.length < 6 || !fullName.trim()) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({
      password,
      data: { full_name: fullName.trim() },
    });
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    await refreshProfile();
    router.replace("/app");
  }

  const waiting = loading || (grace && !session);

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
          {waiting ? (
            <div className="py-8 text-center text-sm font-semibold text-navy/50">Verifying your invite…</div>
          ) : !session ? (
            <div className="text-center">
              <h1 className="font-display text-xl font-extrabold text-navy">This invite link is invalid or expired</h1>
              <p className="mt-2 text-sm text-navy/55">Ask your administrator to send a new invite, or sign in if you already finished setup.</p>
              <Link href="/login" className="mt-6 inline-block"><Button variant="primary">Go to sign in</Button></Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-2xs font-bold text-teal-700 w-fit">
                <BadgeCheck className="h-3.5 w-3.5" /> Invited as {roleLabel || "staff"}
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-navy">Finish setting up</h1>
              <p className="mt-1.5 text-sm text-navy/55">Choose a password to activate your account.</p>

              <form onSubmit={submit} className="mt-7 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Full name</label>
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
                  {busy ? "Activating…" : <>Activate account <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}

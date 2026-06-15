"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  // Allow the client a moment to parse the recovery token from the URL.
  const [grace, setGrace] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setGrace(false), 1400);
    return () => clearTimeout(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/app"), 1200);
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
            <div className="py-8 text-center text-sm font-semibold text-navy/50">Verifying your reset link…</div>
          ) : !session ? (
            <div className="text-center">
              <h1 className="font-display text-xl font-extrabold text-navy">This reset link is invalid or expired</h1>
              <p className="mt-2 text-sm text-navy/55">Request a new password reset link to continue.</p>
              <Link href="/forgot-password" className="mt-6 inline-block"><Button variant="primary">Request a new link</Button></Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <h1 className="font-display text-xl font-extrabold text-navy">Password updated</h1>
              <p className="mt-2 text-sm text-navy/55">Taking you to the app…</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-extrabold text-navy">Choose a new password</h1>
              <p className="mt-1.5 text-sm text-navy/55">Enter a new password for your account.</p>

              <form onSubmit={submit} className="mt-7 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">New password</label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                    <Input type="password" required className="pl-9" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Confirm password</label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                    <Input type="password" required className="pl-9" placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </div>
                </div>

                {error && <p className="text-sm font-semibold text-alert">{error}</p>}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Updating…" : <>Update password <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}

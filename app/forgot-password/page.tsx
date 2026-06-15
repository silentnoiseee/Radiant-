"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email.includes("@")) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F2EC]"><MailCheck className="h-7 w-7 text-ok" /></div>
              <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Check your email</h1>
              <p className="mt-2 text-sm text-navy/55">If an account exists for {email}, we&apos;ve sent a link to reset your password.</p>
              <Link href="/login" className="mt-6 inline-block"><Button variant="primary">Back to sign in</Button></Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-extrabold text-navy">Reset your password</h1>
              <p className="mt-1.5 text-sm text-navy/55">Enter your email and we&apos;ll send you a reset link.</p>

              <form onSubmit={submit} className="mt-7 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Email</label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                    <Input type="email" required className="pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                {error && <p className="text-sm font-semibold text-alert">{error}</p>}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : <>Send reset link <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-navy/55">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-teal hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}

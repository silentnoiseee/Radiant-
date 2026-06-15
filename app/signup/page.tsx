"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, DoorOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { session, loading, signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace("/app");
  }, [loading, session, router]);

  const valid = fullName.trim() && email.trim() && password.length >= 6;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    // Public sign-up always creates a Visitor. Staff (manager/caregiver) join via email invite.
    const { error: err } = await signUp(email.trim(), password, fullName.trim(), "visitor");
    if (err) {
      setError(err);
      setBusy(false);
      return;
    }
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
          <h1 className="font-display text-2xl font-extrabold text-navy">Create a visitor account</h1>
          <p className="mt-1.5 text-sm text-navy/55">Sign up to check in when you visit a resident.</p>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-teal/30 bg-teal-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-white"><DoorOpen className="h-5 w-5" /></div>
            <div>
              <div className="font-display text-sm font-bold text-navy">Visitor</div>
              <div className="text-2xs text-navy/55">Check in to visit a resident.</div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Full name</label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input required className="pl-9" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Email</label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input type="email" required className="pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Password</label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input type="password" required className="pl-9" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm font-semibold text-alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
              {busy ? "Creating account…" : <>Create account <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-cream p-3 text-2xs text-navy/55">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy/40" />
            <span>Staff accounts (caregiver &amp; manager) are invite-only. Your administrator will email you an invite link to join.</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-navy/55">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email.includes("@")) return;
    setBusy(true);
    setError("");
    setInfo("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setStep("verify");
    setInfo(`We emailed a code to ${email.trim()}.`);
  }

  async function resendCode() {
    if (busy) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setBusy(false);
    setInfo(err ? "" : "A new code is on its way.");
    if (err) setError(err.message);
  }

  async function verifyAndReset(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const cleanCode = code.trim();
    if (!/^\d{6,12}$/.test(cleanCode)) {
      setError("Enter the numeric code from your email.");
      return;
    }
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
    // Verify the OTP code — this signs the user in with a recovery session.
    const { error: vErr } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: cleanCode,
      type: "recovery",
    });
    if (vErr) {
      setBusy(false);
      setError("That code is incorrect or has expired. Request a new one.");
      return;
    }
    // Now set the new password.
    const { error: uErr } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (uErr) {
      setError(uErr.message);
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
          {step === "request" ? (
            <>
              <h1 className="font-display text-2xl font-extrabold text-navy">Reset your password</h1>
              <p className="mt-1.5 text-sm text-navy/55">Enter your email and we&apos;ll send you a verification code.</p>

              <form onSubmit={requestCode} className="mt-7 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Email</label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                    <Input type="email" required className="pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                {error && <p className="text-sm font-semibold text-alert">{error}</p>}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : <>Send code <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            </>
          ) : (
            <>
              <button onClick={() => { setStep("request"); setError(""); setInfo(""); setCode(""); }} className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy/55 hover:text-navy">
                <ArrowLeft className="h-4 w-4" /> Use a different email
              </button>
              <h1 className="font-display text-2xl font-extrabold text-navy">Enter your code</h1>
              {info && <p className="mt-1.5 text-sm text-navy/55">{info}</p>}

              <form onSubmit={verifyAndReset} className="mt-7 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Verification code</label>
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
                  {busy ? "Updating…" : <>Reset password <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>

              <button onClick={resendCode} disabled={busy} className="mt-4 w-full text-center text-2xs font-semibold text-teal hover:underline disabled:opacity-50">
                Didn&apos;t get it? Resend code
              </button>
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

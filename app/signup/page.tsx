"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, DoorOpen, Heart, LayoutDashboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, type Role } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const roles: { id: Role; label: string; icon: typeof DoorOpen; blurb: string }[] = [
  { id: "visitor", label: "Visitor", icon: DoorOpen, blurb: "Check in to visit a resident." },
  { id: "caregiver", label: "Caregiver", icon: Heart, blurb: "Log care, give meds, clock in." },
  { id: "manager", label: "Manager", icon: LayoutDashboard, blurb: "Oversee homes, staff & compliance." },
];

export default function SignupPage() {
  const router = useRouter();
  const { session, loading, signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace("/app");
  }, [loading, session, router]);

  const valid = fullName.trim() && email.trim() && password.length >= 6 && role;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const { error: err } = await signUp(email.trim(), password, fullName.trim(), role as Role);
    if (err) {
      setError(err);
      setBusy(false);
      return;
    }
    router.replace("/app"); // lands on the "awaiting approval" screen
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-cream container-px py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><Sparkles className="h-5 w-5 text-amber" /></div>
          <span className="font-display text-2xl font-extrabold text-navy">Radiant</span>
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-lift border border-navy/5 sm:p-10">
          <h1 className="font-display text-2xl font-extrabold text-navy">Request access</h1>
          <p className="mt-1.5 text-sm text-navy/55">Pick your role and create a login. An administrator approves your request before you get in.</p>

          <form onSubmit={submit} className="mt-7 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Full name</label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                <Input required className="pl-9" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Role you&apos;re requesting</label>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
                {roles.map((r) => (
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
              {touched && !role && <p className="mt-2 text-2xs font-semibold text-alert">Please pick a role.</p>}
            </div>

            {error && <p className="text-sm font-semibold text-alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
              {busy ? "Submitting…" : <>Request access <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-navy/55">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}

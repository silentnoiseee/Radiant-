"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Clock, LogOut } from "lucide-react";
import { Sidebar, BottomBar } from "@/components/radiant/NavBar";
import { DemoBadge } from "@/components/radiant/DemoBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-navy text-white">
          <Sparkles className="h-6 w-6 text-amber" />
        </div>
        <div className="text-sm font-semibold text-navy/50">Loading…</div>
      </div>
    </div>
  );
}

function StatusGate({ kind, requested, onSignOut }: { kind: "pending" | "denied"; requested: string | null; onSignOut: () => void }) {
  return (
    <div className="grain flex min-h-screen items-center justify-center bg-cream container-px py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lift border border-navy/5 sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${kind === "pending" ? "bg-[#FBF3D8] text-due" : "bg-[#F8E7E2] text-alert"}`}>
          <Clock className="h-8 w-8" />
        </div>
        {kind === "pending" ? (
          <>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-navy">Awaiting approval</h1>
            <p className="mt-2 text-navy/60">
              Thanks for signing up! Your request{requested ? <> to join as a <span className="font-semibold text-navy">{requested}</span></> : ""} is pending review by an administrator. You&apos;ll have access as soon as it&apos;s approved.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-navy">Request not approved</h1>
            <p className="mt-2 text-navy/60">Your access request wasn&apos;t approved. Please contact your administrator if you think this is a mistake.</p>
          </>
        )}
        <Button variant="outline" className="mt-7" onClick={onSignOut}><LogOut className="h-4 w-4" /> Sign out</Button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { loading, session, profile, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (profile && profile.status === "active") {
      if (profile.role === "visitor" && !path.startsWith("/app/visitors")) {
        router.replace("/app/visitors");
      } else if (profile.role === "caregiver" && path.startsWith("/app/dashboard")) {
        router.replace("/app");
      } else if (path.startsWith("/app/invite") && !profile.is_owner) {
        router.replace("/app");
      }
    }
  }, [loading, session, profile, path, router]);

  if (loading || !session || !profile) {
    return <FullScreenLoader />;
  }

  // Pending / denied accounts can't enter the app.
  if (profile.status !== "active") {
    return <StatusGate kind={profile.status === "denied" ? "denied" : "pending"} requested={profile.requested_role} onSignOut={() => signOut()} />;
  }

  const kiosk = path.startsWith("/app/visitors");
  if (kiosk) {
    return (
      <div className="min-h-screen bg-cream">
        {children}
        <DemoBadge />
      </div>
    );
  }

  if (profile.role === "visitor") {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex min-h-screen bg-cream grain">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto max-w-6xl container-px py-8 lg:py-12">{children}</div>
      </div>
      <BottomBar />
      <DemoBadge />
    </div>
  );
}

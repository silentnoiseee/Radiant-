"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, Mail, ShieldCheck, DollarSign, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { initials } from "@/lib/utils";

export default function ProfilePage() {
  const { session, profile, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [ecName, setEcName] = useState("");
  const [ecPhone, setEcPhone] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setPhone(profile.phone ?? "");
    setEcName(profile.emergency_contact_name ?? "");
    setEcPhone(profile.emergency_contact_phone ?? "");
    setAddress(profile.address ?? "");
    setTitle(profile.title ?? "");
    setAvatarUrl(profile.avatar_url ?? null);
  }, [profile]);

  const roleLabel = profile?.is_owner
    ? "Owner"
    : profile?.role
    ? profile.role[0].toUpperCase() + profile.role.slice(1)
    : "";
  const displayName = `${firstName} ${lastName}`.trim() || profile?.full_name || "Your profile";

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setError("");
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${session.user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      setError("Photo upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", session.user.id);
    setUploading(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    setAvatarUrl(url);
    await refreshProfile();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !session) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const full = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: full,
        phone: phone.trim(),
        emergency_contact_name: ecName.trim(),
        emergency_contact_phone: ecPhone.trim(),
        address: address.trim(),
        title: title.trim(),
      })
      .eq("id", session.user.id);
    setSaving(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    setSaved(true);
    await refreshProfile();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader eyebrow="Account" title="My profile" />

      {/* Photo + identity */}
      <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
        <div className="relative">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal font-display text-2xl font-bold text-white">
              {displayName ? initials(displayName) : "?"}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white shadow-soft transition hover:bg-navy/90 focus-ring"
            aria-label="Change photo"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
        </div>
        <div className="min-w-0">
          <div className="font-display text-xl font-extrabold text-navy">{displayName}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy/55">
            <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {session?.user.email}</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> {roleLabel}</span>
            <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${Number(profile?.hourly_rate ?? 0).toFixed(2)}/hr</span>
          </div>
          <p className="mt-1 text-2xs text-navy/40">Email, role and pay rate are set by your manager.</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-6 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-navy/5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-navy/50">First name</label>
            <Input className="mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Last name</label>
            <Input className="mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Job title</label>
          <Input className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Caregiver, Nurse" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Phone</label>
            <Input className="mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(407) 555-0100" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-navy/50">Address</label>
            <Input className="mt-2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State" />
          </div>
        </div>

        <div className="rounded-2xl bg-cream/60 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-navy/50">Emergency contact</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input value={ecName} onChange={(e) => setEcName(e.target.value)} placeholder="Contact name" />
            <Input value={ecPhone} onChange={(e) => setEcPhone(e.target.value)} placeholder="Contact phone" />
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-alert">{error}</p>}

        <div className="flex items-center justify-end gap-3 border-t border-navy/8 pt-5">
          {saved && <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ok"><Check className="h-4 w-4" /> Saved</span>}
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

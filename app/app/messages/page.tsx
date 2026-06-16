"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, ThumbsUp, ThumbsDown, Send, Trash2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn, initials } from "@/lib/utils";

type Msg = { id: string; author_id: string | null; author_name: string | null; author_avatar: string | null; body: string; created_at: string };
type Reply = { id: string; message_id: string; author_id: string | null; author_name: string | null; author_avatar: string | null; body: string; created_at: string };
type Reaction = { id: string; message_id: string; user_id: string; reaction: "like" | "dislike" };

function Avi({ name, url, size = 36 }: { name: string | null; url: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" style={{ height: size, width: size }} className="rounded-full object-cover" />;
  }
  return (
    <div style={{ height: size, width: size }} className="flex items-center justify-center rounded-full bg-navy font-display text-xs font-bold text-white">
      {name ? initials(name) : "?"}
    </div>
  );
}

function whenText(iso: string) {
  return new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
  const { profile, session } = useAuth();
  const uid = session?.user.id ?? "";
  const isManager = profile?.role === "manager" || profile?.is_owner;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  async function loadAll() {
    const [m, r, x] = await Promise.all([
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
      supabase.from("message_replies").select("*").order("created_at", { ascending: true }),
      supabase.from("message_reactions").select("id, message_id, user_id, reaction"),
    ]);
    if (m.data) setMessages(m.data as Msg[]);
    if (r.data) setReplies(r.data as Reply[]);
    if (x.data) setReactions(x.data as Reaction[]);
  }
  useEffect(() => { loadAll(); }, []);

  async function postMessage() {
    if (!draft.trim() || posting || !uid) return;
    setPosting(true);
    await supabase.from("messages").insert({
      author_id: uid,
      author_name: profile?.full_name ?? null,
      author_avatar: profile?.avatar_url ?? null,
      body: draft.trim(),
    });
    setDraft("");
    setPosting(false);
    loadAll();
  }

  async function deleteMessage(id: string) {
    await supabase.from("messages").delete().eq("id", id);
    loadAll();
  }

  async function react(messageId: string, kind: "like" | "dislike") {
    if (!uid) return;
    const existing = reactions.find((r) => r.message_id === messageId && r.user_id === uid);
    if (existing && existing.reaction === kind) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else if (existing) {
      await supabase.from("message_reactions").update({ reaction: kind }).eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: messageId, user_id: uid, reaction: kind });
    }
    const { data } = await supabase.from("message_reactions").select("id, message_id, user_id, reaction");
    setReactions((data as Reaction[]) ?? []);
  }

  async function postReply(messageId: string) {
    const text = (replyDrafts[messageId] ?? "").trim();
    if (!text || !uid) return;
    await supabase.from("message_replies").insert({
      message_id: messageId,
      author_id: uid,
      author_name: profile?.full_name ?? null,
      author_avatar: profile?.avatar_url ?? null,
      body: text,
    });
    setReplyDrafts((d) => ({ ...d, [messageId]: "" }));
    const { data } = await supabase.from("message_replies").select("*").order("created_at", { ascending: true });
    setReplies((data as Reply[]) ?? []);
  }

  const repliesByMsg = useMemo(() => {
    const map: Record<string, Reply[]> = {};
    for (const r of replies) (map[r.message_id] ??= []).push(r);
    return map;
  }, [replies]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader eyebrow="Team" title="Message board" />

      {isManager && (
        <div className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
            <Megaphone className="h-5 w-5 text-teal" /> Post an announcement
          </h2>
          <Textarea className="mt-3" placeholder="Share an update with the team…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="mt-3 flex justify-end">
            <Button variant="primary" onClick={postMessage} disabled={posting || !draft.trim()}>
              <Send className="h-4 w-4" /> {posting ? "Posting…" : "Post"}
            </Button>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="rounded-3xl border border-navy/5 bg-white p-10 text-center text-sm text-navy/50 shadow-soft">
          {isManager ? "No announcements yet — post the first one above." : "No announcements yet. Check back soon."}
        </div>
      )}

      <div className="space-y-5">
        {messages.map((m) => {
          const likes = reactions.filter((r) => r.message_id === m.id && r.reaction === "like").length;
          const dislikes = reactions.filter((r) => r.message_id === m.id && r.reaction === "dislike").length;
          const mine = reactions.find((r) => r.message_id === m.id && r.user_id === uid)?.reaction;
          const msgReplies = repliesByMsg[m.id] ?? [];
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
              <div className="flex items-start gap-3">
                <Avi name={m.author_name} url={m.author_avatar} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-navy">{m.author_name || "Manager"}</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-2xs font-bold text-teal-700">Manager</span>
                    <span className="text-2xs text-navy/40">· {whenText(m.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-navy/75">{m.body}</p>
                </div>
                {m.author_id === uid && (
                  <button onClick={() => deleteMessage(m.id)} className="text-navy/30 transition hover:text-alert focus-ring rounded" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Reactions */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => react(m.id, "like")}
                  className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-ring",
                    mine === "like" ? "border-ok/40 bg-[#E7F2EC] text-ok" : "border-navy/10 text-navy/55 hover:bg-navy-50")}
                >
                  <ThumbsUp className="h-4 w-4" /> {likes}
                </button>
                <button
                  onClick={() => react(m.id, "dislike")}
                  className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-ring",
                    mine === "dislike" ? "border-alert/40 bg-[#F8E7E2] text-alert" : "border-navy/10 text-navy/55 hover:bg-navy-50")}
                >
                  <ThumbsDown className="h-4 w-4" /> {dislikes}
                </button>
                <span className="ml-auto inline-flex items-center gap-1 text-2xs text-navy/40">
                  <MessageCircle className="h-3.5 w-3.5" /> {msgReplies.length}
                </span>
              </div>

              {/* Replies */}
              {msgReplies.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-navy/8 pt-4">
                  {msgReplies.map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5">
                      <Avi name={r.author_name} url={r.author_avatar} size={28} />
                      <div className="min-w-0 flex-1 rounded-2xl bg-cream/70 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-navy">{r.author_name || "Staff"}</span>
                          <span className="text-2xs text-navy/40">{whenText(r.created_at)}</span>
                        </div>
                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-navy/70">{r.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              <div className="mt-3 flex items-center gap-2">
                <Input
                  className="h-10"
                  placeholder="Write a reply…"
                  value={replyDrafts[m.id] ?? ""}
                  onChange={(e) => setReplyDrafts((d) => ({ ...d, [m.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") postReply(m.id); }}
                />
                <Button variant="outline" size="sm" onClick={() => postReply(m.id)} disabled={!(replyDrafts[m.id] ?? "").trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

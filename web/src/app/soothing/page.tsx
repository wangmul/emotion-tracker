"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useRequireAuth } from "@/lib/auth";

type Item = { id: string; content: string; created_at: string };

export default function SoothingLibraryPage() {
  const { userId, loading } = useRequireAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("self_soothing_methods")
        .select("id, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!error && data) setItems(data as Item[]);
    })();
  }, [userId]);

  const addItem = async () => {
    setError(null);
    const trimmed = text.trim();
    if (!trimmed) return;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("self_soothing_methods")
      .insert({ content: trimmed })
      .select("id, content, created_at").single();
    if (error) {
      setError(error.message);
      return;
    }
    if (data) setItems((prev) => [data as Item, ...prev]);
    setText("");
  };

  if (loading) return null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-xl backdrop-blur-md dark:bg-white/5 p-8">
        <h2 className="text-xl font-semibold mb-4">내가 시도한 자기 달래기 방법 모음</h2>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="새 항목 추가"
            className="flex-1 rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
          />
          <button onClick={addItem} className="rounded-xl bg-foreground/90 text-background px-4 py-2 font-medium">추가</button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border border-white/15 bg-white/60 p-4 shadow-xl backdrop-blur-md dark:bg-white/5">
            <p className="text-sm whitespace-pre-wrap">{it.content}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">아직 저장된 항목이 없습니다.</p>
        )}
      </div>
    </main>
  );
}

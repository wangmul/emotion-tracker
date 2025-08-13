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

      const [ssmRes, dailyRes] = await Promise.all([
        supabase
          .from("self_soothing_methods")
          .select("id, content, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("daily_entries")
          .select("self_soothing_methods, entry_date")
          .eq("user_id", userId)
          .not("self_soothing_methods", "is", null)
          .order("entry_date", { ascending: false })
          .limit(100),
      ]);

      const combined: Item[] = [];
      if (!ssmRes.error && ssmRes.data) {
        combined.push(...(ssmRes.data as Item[]));
      }
      if (!dailyRes.error && dailyRes.data) {
        const fromDaily: Item[] = (dailyRes.data as any[])
          .filter((r) => !!r.self_soothing_methods)
          .map((r) => ({
            id: `daily-${r.entry_date}`,
            content: String(r.self_soothing_methods),
            created_at: new Date(r.entry_date).toISOString(),
          }));
        combined.push(...fromDaily);
      }

      // 간단한 중복 제거: content 기준
      const seen = new Set<string>();
      const deduped = combined.filter((it) => {
        const key = it.content.trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // 최신순 정렬
      deduped.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      setItems(deduped);
    })();
  }, [userId]);

  const addItem = async () => {
    setError(null);
    const trimmed = text.trim();
    if (!trimmed) return;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("self_soothing_methods")
      .insert({ content: trimmed, user_id: userId ?? undefined })
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

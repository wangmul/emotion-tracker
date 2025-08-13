"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useRequireAuth } from "@/lib/auth";

type Item = { id: string; content: string; created_at: string };

export default function SoothingLibraryPage() {
  const { userId, loading } = useRequireAuth();
  const [items, setItems] = useState<Item[]>([]);
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

  // 입력 추가 기능 제거

  const deleteItem = async (item: Item) => {
    if (!userId) return;
    setError(null);
    const supabase = getSupabase();
    try {
      if (item.id.startsWith("daily-")) {
        const entryDate = item.id.replace("daily-", "");
        const { error } = await supabase
          .from("daily_entries")
          .update({ self_soothing_methods: null })
          .eq("user_id", userId)
          .eq("entry_date", entryDate)
          .single();
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("self_soothing_methods")
          .delete()
          .eq("id", item.id)
          .eq("user_id", userId);
        if (error) throw error;
      }
      setItems((prev) => prev.filter((it) => it.id !== item.id));
    } catch (e: any) {
      setError(e?.message ?? "삭제에 실패했습니다.");
    }
  };

  if (loading) return null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">내가 시도한 자기 달래기 방법 모음</h2>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border border-white/15 bg-white/60 p-4 shadow-xl backdrop-blur-md dark:bg-white/5 flex items-start justify-between gap-3">
            <p className="text-sm whitespace-pre-wrap flex-1">{it.content}</p>
            <button
              onClick={() => deleteItem(it)}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-xs text-black/70 hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
              aria-label="삭제"
            >
              삭제
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">아직 저장된 항목이 없습니다.</p>
        )}
      </div>
    </main>
  );
}

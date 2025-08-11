"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, isValid, parseISO, addDays, subDays } from "date-fns";
import { getSupabase } from "@/lib/supabase/client";
import type { DailyEntry } from "@/types/dailyEntry";

export const dynamic = "force-dynamic";

export default function HistoryByDatePage() {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const dateParam = Array.isArray(params?.date) ? params.date[0] : params?.date;
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const targetDate = useMemo(() => {
    const d = dateParam ? parseISO(dateParam) : new Date();
    return isValid(d) ? d : new Date();
  }, [dateParam]);

  useEffect(() => {
    (async () => {
      if (!dateParam) return;
      setLoading(true);
      const supabase = getSupabase();
      const { data } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("entry_date", format(targetDate, "yyyy-MM-dd"))
        .limit(1)
        .maybeSingle();
      setEntry((data as DailyEntry) ?? null);
      setLoading(false);
    })();
  }, [dateParam, targetDate]);

  const onChangeDate = (value: string) => {
    if (!value) return;
    router.push(`/history/${value}`);
  };

  const goPrev = () => router.push(`/history/${format(subDays(targetDate, 1), "yyyy-MM-dd")}`);
  const goNext = () => router.push(`/history/${format(addDays(targetDate, 1), "yyyy-MM-dd")}`);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <div className="rounded-3xl border border-white/15 bg-white/60 p-6 shadow-2xl backdrop-blur-md dark:bg-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">{format(targetDate, "yyyy-MM-dd")}</h1>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/10">이전</button>
            <input
              type="date"
              defaultValue={format(targetDate, "yyyy-MM-dd")}
              onChange={(e) => onChangeDate(e.target.value)}
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/10"
            />
            <button onClick={goNext} className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/10">다음</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/60 p-6 shadow-2xl backdrop-blur-md dark:bg-white/5">
        {loading ? (
          <p className="text-sm text-black/60 dark:text-white/60">불러오는 중...</p>
        ) : entry ? (
          <div className="space-y-4">
            <div className="text-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">아니라고 말 함</p>
                <p className="text-xl font-semibold">{entry.said_no_count}</p>
              </div>
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">도움을 요청함</p>
                <p className="text-xl font-semibold">{entry.asked_help_count}</p>
              </div>
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">즐거움을 위해 선택함</p>
                <p className="text-xl font-semibold">{entry.chose_for_joy_count}</p>
              </div>
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">휴식</p>
                <p className="text-xl font-semibold">{entry.took_rest ? "O" : "X"}</p>
              </div>
            </div>

            <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">요리</p>
                <p className="text-xl font-semibold">{entry.did_cook ? "O" : "X"}</p>
              </div>
              <div className="rounded-2xl bg-white/70 dark:bg-white/10 p-4 border border-black/10 dark:border-white/15">
                <p className="text-xs opacity-70">운동</p>
                <p className="text-xl font-semibold">{entry.did_exercise ? "O" : "X"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/70 p-5 dark:bg-white/10">
                <p className="font-medium mb-2">해야 하지만 하기 싫은 일</p>
                <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                  {entry.must_do_tasks?.map((t, i) => (
                    <li key={i}>{t || "-"}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/70 p-5 dark:bg-white/10">
                <p className="font-medium mb-2">하고 싶었지만 하지 않은 일</p>
                <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                  {entry.wanted_but_skipped_tasks?.map((t, i) => (
                    <li key={i}>{t || "-"}</li>
                  ))}
                </ul>
              </div>
            </div>

          <div className="rounded-2xl border border-white/15 bg-white/70 p-5 dark:bg-white/10">
            <p className="font-medium mb-2">내가 시도한 자기 달래기 방법</p>
            <p className="text-sm opacity-90 whitespace-pre-wrap">
              {entry.self_soothing_methods || "-"}
            </p>
          </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-black/60 dark:text-white/60">해당 날짜의 데이터가 없습니다.</p>
            <button onClick={() => router.push("/record/step-1")}
              className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium shadow hover:shadow-lg">
              오늘 기록하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

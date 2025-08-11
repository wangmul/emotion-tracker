"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { DailyEntry } from "@/types/dailyEntry";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [jumpDate, setJumpDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("daily_entries")
        .select("*")
        .order("entry_date", { ascending: true })
        .limit(60);
      if (!error && data) setEntries(data as DailyEntry[]);
    })();
  }, []);

  const chartData = useMemo(() => {
    const labels = entries.map((e) => e.entry_date);
    return {
      labels,
      datasets: [
        {
          label: "아니라고 말 한 횟수",
          data: entries.map((e) => e.said_no_count),
          borderColor: "#6366f1",
          backgroundColor: "#6366f1",
        },
        {
          label: "도움을 요청한 횟수",
          data: entries.map((e) => e.asked_help_count),
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
        },
        {
          label: "즐거움을 위해 선택한 횟수",
          data: entries.map((e) => e.chose_for_joy_count),
          borderColor: "#ec4899",
          backgroundColor: "#ec4899",
        },
      ],
    };
  }, [entries]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <div className="rounded-3xl border border-white/15 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:bg-white/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">날짜별 보기</h2>
          <form action={(formData) => {
            const d = formData.get("jumpDate") as string;
            if (d) window.location.href = `/history/${d}`;
          }} className="flex items-center gap-2">
            <input type="date" name="jumpDate" value={jumpDate} onChange={(e) => setJumpDate(e.target.value)} className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm dark:border-white/15 dark:bg-white/10" />
            <button className="rounded-xl bg-foreground text-background px-3 py-2 text-sm font-medium">이동</button>
          </form>
        </div>
      </div>
      <div className="rounded-3xl border border-white/15 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:bg-white/5">
        <h1 className="text-2xl font-semibold mb-4">히스토리</h1>
        {entries.length > 0 ? (
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        ) : (
          <p className="text-sm text-black/60 dark:text-white/60">아직 데이터가 없습니다. 오늘의 기록을 추가해보세요.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((e) => (
          <a href={`/history/${e.entry_date}`} key={e.id ?? `${e.entry_date}-${e.said_no_count}`} className="rounded-2xl border border-white/15 bg-white/60 p-5 shadow-xl backdrop-blur-md dark:bg-white/5 hover:shadow-2xl transition-shadow">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">{e.entry_date}</h3>
              <span className="text-xs rounded-full border px-2 py-0.5 opacity-80">
                {e.took_rest ? "휴식 O" : "휴식 X"}
              </span>
            </div>
            <div className="text-sm space-y-1 opacity-90">
              <p>아니라고 말 함: <b>{e.said_no_count}</b></p>
              <p>도움을 요청함: <b>{e.asked_help_count}</b></p>
              <p>즐거움을 위해 선택함: <b>{e.chose_for_joy_count}</b></p>
              <p>휴식: <b>{e.took_rest ? "O" : "X"}</b></p>
              <p>요리: <b>{e.did_cook ? "O" : "X"}</b></p>
              <p>운동: <b>{e.did_exercise ? "O" : "X"}</b></p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium mb-1">해야 하지만 하기 싫은 일</p>
                <ul className="list-disc list-inside space-y-0.5 opacity-90">
                  {e.must_do_tasks?.map((t, i) => (
                    <li key={i}>{t || "-"}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">하고 싶었지만 하지 않은 일</p>
                <ul className="list-disc list-inside space-y-0.5 opacity-90">
                  {e.wanted_but_skipped_tasks?.map((t, i) => (
                    <li key={i}>{t || "-"}</li>
                  ))}
                </ul>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

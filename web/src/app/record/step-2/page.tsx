"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStepOne, clearStepOne } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/client";
import type { DailyEntry } from "@/types/dailyEntry";
import { format } from "date-fns";

const schema = z.object({
  mustDo0: z.string().trim(),
  mustDo1: z.string().trim(),
  mustDo2: z.string().trim(),
  wantSkip0: z.string().trim(),
  wantSkip1: z.string().trim(),
  wantSkip2: z.string().trim(),
});

type FormData = z.infer<typeof schema>;

export const dynamic = "force-dynamic";

export default function StepTwoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      mustDo0: "",
      mustDo1: "",
      mustDo2: "",
      wantSkip0: "",
      wantSkip1: "",
      wantSkip2: "",
    },
  });

  useEffect(() => {
    const stepOne = loadStepOne();
    if (!stepOne) {
      router.replace("/record/step-1");
    }
  }, [router]);

  const onSubmit = async (data: FormData) => {
    const stepOne = loadStepOne();
    if (!stepOne) return;

    setSubmitting(true);
    setError(null);
    const today = format(new Date(), "yyyy-MM-dd");

    const payload: DailyEntry = {
      entry_date: today,
      said_no_count: stepOne.saidNoCount,
      asked_help_count: stepOne.askedHelpCount,
      chose_for_joy_count: stepOne.choseForJoyCount,
      took_rest: stepOne.tookRest,
      must_do_tasks: [data.mustDo0 ?? "", data.mustDo1 ?? "", data.mustDo2 ?? ""],
      wanted_but_skipped_tasks: [
        data.wantSkip0 ?? "",
        data.wantSkip1 ?? "",
        data.wantSkip2 ?? "",
      ],
    };

    try {
      const supabase = getSupabase();
      const { data: inserted, error: insertError } = await supabase
        .from("daily_entries")
        .insert(payload)
        .select("id, entry_date")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      clearStepOne();
      const target = inserted?.entry_date ?? today;
      router.push(`/history/${target}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-xl backdrop-blur-md dark:bg-white/5 p-8">
        <h2 className="text-xl font-semibold mb-6">당신이 하고 싶지 않지만 해야 하는 일 세가지</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-3">
            <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 장보기" {...register("mustDo0")} />
            <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 청구서 정리" {...register("mustDo1")} />
            <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 운동하기" {...register("mustDo2")} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">당신이 하고 싶었지만 하지 않은 일 세가지</h2>
            <div className="space-y-3">
              <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 친구에게 연락하기" {...register("wantSkip0")} />
              <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 산책하기" {...register("wantSkip1")} />
              <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10" placeholder="예: 취미 활동" {...register("wantSkip2")} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 rounded-xl border border-black/10 px-6 py-3 font-medium hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:hover:bg-white/10"
            >
              홈으로
            </button>
            <button
              type="button"
              onClick={() => router.push("/record/step-1")}
              className="flex-1 rounded-xl border border-black/10 px-6 py-3 font-medium hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:hover:bg-white/10"
            >
              이전으로
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "기록 중..." : "기록하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStepOne, clearStepOne } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { useRequireAuth } from "@/lib/auth";

const schema = z.object({
  methods: z.string().trim().max(1000).optional().default(""),
});

type FormData = z.infer<typeof schema>;

export default function StepThreePage() {
  const router = useRouter();
  const { loading } = useRequireAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { methods: "" },
  });

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const stepOne = loadStepOne();
        const today = format(new Date(), "yyyy-MM-dd");
        const entryDate = stepOne?.selectedDate ?? today;
        const { data } = await supabase
          .from("daily_entries")
          .select("self_soothing_methods")
          .eq("entry_date", entryDate)
          .is("user_id", null)
          .maybeSingle();
        if (data?.self_soothing_methods !== undefined && data?.self_soothing_methods !== null) {
          setValue("methods", data.self_soothing_methods);
        }
      } catch {}
    })();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    const stepOne = loadStepOne();
    const today = format(new Date(), "yyyy-MM-dd");
    const entryDate = stepOne?.selectedDate ?? today;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabase();
      // 1) 날짜 무관 누적 테이블에 추가(비어있으면 스킵)
      const trimmed = (data.methods ?? "").trim();
      if (trimmed.length > 0) {
        const { error: insertErr } = await supabase
          .from("self_soothing_methods")
          .insert({ content: trimmed });
        if (insertErr) {
          setError(insertErr.message);
          setSubmitting(false);
          return;
        }
      }

      // 2) 해당 날짜 레코드에도 마지막 메모로 동기화(선택 사항이지만 유지)
      const { error: updateErr } = await supabase
        .from("daily_entries")
        .update({ self_soothing_methods: trimmed })
        .eq("entry_date", entryDate)
        .is("user_id", null);
      if (updateErr) {
        setError(updateErr.message);
        setSubmitting(false);
        return;
      }
      clearStepOne();
      router.push(`/history/${entryDate}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setSubmitting(false);
    }
  };

  if (loading) return null;
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-xl backdrop-blur-md dark:bg-white/5 p-8">
        <h2 className="text-xl font-semibold mb-6">내가 시도한 자기 달래기 방법</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <textarea
            rows={6}
            placeholder="예: 깊은 호흡, 따뜻한 차 마시기, 가벼운 스트레칭..."
            className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
            {...register("methods")}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/record/step-2")}
              className="flex-1 rounded-xl border border-black/10 px-6 py-3 font-medium hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:hover:bg-white/10"
            >
              이전으로
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "기록 중..." : "기록 완료"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

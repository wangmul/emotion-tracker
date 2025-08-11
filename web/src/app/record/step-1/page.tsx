"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveStepOne } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase/client";
import { format } from "date-fns";

const schema = z.object({
  saidNoCount: z.number().int().min(0),
  askedHelpCount: z.number().int().min(0),
  choseForJoyCount: z.number().int().min(0),
  tookRest: z.boolean(),
  selectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  didCook: z.boolean(),
  didExercise: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function StepOnePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      saidNoCount: 0,
      askedHelpCount: 0,
      choseForJoyCount: 0,
      tookRest: false,
      selectedDate: format(new Date(), "yyyy-MM-dd"),
      didCook: false,
      didExercise: false,
    },
  });

  const onSubmit = (data: FormData) => {
    saveStepOne(data);
    router.push("/record/step-2");
  };

  const selectedDate = watch("selectedDate");

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase
          .from("daily_entries")
          .select("said_no_count, asked_help_count, chose_for_joy_count, took_rest, did_cook, did_exercise")
          .eq("entry_date", selectedDate)
          .maybeSingle();
        if (data) {
          const v = data as {
            said_no_count: number;
            asked_help_count: number;
            chose_for_joy_count: number;
            took_rest: boolean;
            did_cook: boolean;
            did_exercise: boolean;
          };
          const filled: FormData = {
            saidNoCount: v.said_no_count,
            askedHelpCount: v.asked_help_count,
            choseForJoyCount: v.chose_for_joy_count,
            tookRest: v.took_rest,
            didCook: v.did_cook,
            didExercise: v.did_exercise,
            selectedDate,
          };
          Object.entries(filled).forEach(([k, val]) => setValue(k as keyof FormData, val as never));
          saveStepOne(filled);
        } else {
          const cleared: FormData = {
            saidNoCount: 0,
            askedHelpCount: 0,
            choseForJoyCount: 0,
            tookRest: false,
            didCook: false,
            didExercise: false,
            selectedDate,
          };
          Object.entries(cleared).forEach(([k, val]) => setValue(k as keyof FormData, val as never));
          saveStepOne(cleared);
        }
      } catch {
        // ignore
      }
    })();
  }, [selectedDate, setValue]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-xl backdrop-blur-md dark:bg-white/5 p-8">
        <h1 className="text-2xl font-semibold mb-6">오늘 하루를 기록하세요.</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label htmlFor="selectedDate" className="block text-sm font-medium mb-2 text-black/80 dark:text-white/85">기록할 날짜</label>
              <input
                id="selectedDate"
                type="date"
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
                {...register("selectedDate")}
              />
            </div>
            <div>
              <label htmlFor="saidNoCount" className="block text-sm font-medium mb-2 text-black/80 dark:text-white/85">아니라고 말 한 횟수</label>
              <input
                id="saidNoCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
                {...register("saidNoCount", { valueAsNumber: true })}
              />
              {errors.saidNoCount && (
                <p className="mt-1 text-sm text-red-500">0 이상의 숫자를 입력하세요.</p>
              )}
            </div>
            <div>
              <label htmlFor="askedHelpCount" className="block text-sm font-medium mb-2 text-black/80 dark:text-white/85">도움을 요청한 횟수</label>
              <input
                id="askedHelpCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
                {...register("askedHelpCount", { valueAsNumber: true })}
              />
              {errors.askedHelpCount && (
                <p className="mt-1 text-sm text-red-500">0 이상의 숫자를 입력하세요.</p>
              )}
            </div>
            <div>
              <label htmlFor="choseForJoyCount" className="block text-sm font-medium mb-2 text-black/80 dark:text-white/85">즐거움을 위해 선택한 횟수</label>
              <input
                id="choseForJoyCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
                {...register("choseForJoyCount", { valueAsNumber: true })}
              />
              {errors.choseForJoyCount && (
                <p className="mt-1 text-sm text-red-500">0 이상의 숫자를 입력하세요.</p>
              )}
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                id="tookRest"
                type="checkbox"
                className="h-5 w-5 rounded border border-black/20 accent-black dark:border-white/20 focus:ring-2 focus:ring-[#94a3b8]/30"
                {...register("tookRest")}
              />
              <label htmlFor="tookRest" className="text-sm font-medium">
                휴식을 취했나요?
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                id="didCook"
                type="checkbox"
                className="h-5 w-5 rounded border border-black/20 accent-black dark:border-white/20 focus:ring-2 focus:ring-[#94a3b8]/30"
                {...register("didCook")}
              />
              <label htmlFor="didCook" className="text-sm font-medium">
                요리를 했나요?
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                id="didExercise"
                type="checkbox"
                className="h-5 w-5 rounded border border-black/20 accent-black dark:border-white/20 focus:ring-2 focus:ring-[#94a3b8]/30"
                {...register("didExercise")}
              />
              <label htmlFor="didExercise" className="text-sm font-medium">
                운동을 했나요?
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-foreground/90 text-background px-6 py-3 text-base font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99]"
            >
              다음으로
            </button>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/"
                className="rounded-xl border border-black/10 px-6 py-3 text-center font-medium hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:hover:bg-white/10"
              >
                홈으로
              </Link>
              <Link
                href="/history"
                className="rounded-xl border border-black/10 px-6 py-3 text-center font-medium hover:bg-black/[.04] active:scale-[0.99] dark:border-white/15 dark:hover:bg-white/10"
              >
                히스토리
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

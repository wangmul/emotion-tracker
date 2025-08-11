"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveStepOne } from "@/lib/storage";

const schema = z.object({
  saidNoCount: z.number().int().min(0),
  askedHelpCount: z.number().int().min(0),
  choseForJoyCount: z.number().int().min(0),
  tookRest: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function StepOnePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      saidNoCount: 0,
      askedHelpCount: 0,
      choseForJoyCount: 0,
      tookRest: false,
    },
  });

  const onSubmit = (data: FormData) => {
    saveStepOne(data);
    router.push("/record/step-2");
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-2xl backdrop-blur-md dark:bg-white/5 p-8">
        <h1 className="text-2xl font-semibold mb-6">오늘 하루를 기록하세요.</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="saidNoCount" className="block text-sm font-medium mb-2">아니라고 말 한 횟수</label>
              <input
                id="saidNoCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 dark:border-white/15 dark:bg-white/10"
                {...register("saidNoCount", { valueAsNumber: true })}
              />
              {errors.saidNoCount && (
                <p className="mt-1 text-sm text-red-500">0 이상의 숫자를 입력하세요.</p>
              )}
            </div>
            <div>
              <label htmlFor="askedHelpCount" className="block text-sm font-medium mb-2">도움을 요청한 횟수</label>
              <input
                id="askedHelpCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 dark:border-white/15 dark:bg-white/10"
                {...register("askedHelpCount", { valueAsNumber: true })}
              />
              {errors.askedHelpCount && (
                <p className="mt-1 text-sm text-red-500">0 이상의 숫자를 입력하세요.</p>
              )}
            </div>
            <div>
              <label htmlFor="choseForJoyCount" className="block text-sm font-medium mb-2">즐거움을 위해 선택한 횟수</label>
              <input
                id="choseForJoyCount"
                type="number"
                inputMode="numeric"
                min={0}
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none ring-0 focus:border-black/30 dark:border-white/15 dark:bg-white/10"
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
                className="h-5 w-5 rounded border border-black/20 accent-black dark:border-white/20"
                {...register("tookRest")}
              />
              <label htmlFor="tookRest" className="text-sm font-medium">
                휴식을 취했나요?
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-foreground text-background px-6 py-3 text-base font-semibold shadow hover:shadow-lg transition-all"
            >
              다음으로
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

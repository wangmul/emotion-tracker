import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="w-full rounded-3xl border border-white/10 bg-white/60 p-8 shadow-xl backdrop-blur-md transition-shadow hover:shadow-2xl dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl text-black/85 dark:text-white">
          오늘 하루를 기록하세요.
        </h1>
        <p className="text-center text-base text-black/60 dark:text-white/70">
          작은 선택의 변화를 쌓아 당신의 하루를 더 선명하게.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/record/step-1"
            className="group rounded-xl bg-foreground/90 text-background px-6 py-4 text-center text-base font-medium shadow hover:shadow-lg transition-all active:scale-[0.99]"
          >
            기록 시작하기
          </Link>
          <Link
            href="/history"
            className="group rounded-xl border border-black/10 px-6 py-4 text-center text-base font-medium hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/10 transition-colors active:scale-[0.99]"
          >
            히스토리 보기
          </Link>
        </div>
      </div>
    </main>
  );
}

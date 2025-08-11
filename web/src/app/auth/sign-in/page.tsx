"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = getSupabase();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async () => {
    setError(null);
    setSent(false);
    setSending(true);
    try {
      const redirect = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      });
      if (err) {
        setError(err.message);
      } else {
        setSent(true);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16 sm:px-6 sm:py-20">
      <div className="rounded-3xl border border-white/15 bg-white/60 shadow-xl backdrop-blur-md dark:bg-white/5 p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-center">로그인</h1>
        <p className="text-sm text-black/60 dark:text-white/60 text-center">이메일로 매직 링크를 보내드립니다.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
        />
        <button
          onClick={sendMagicLink}
          disabled={sending || !email}
          className="w-full rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
        >
          {sending ? "전송 중..." : "로그인 링크 보내기"}
        </button>
        {sent && <p className="text-sm text-green-600">메일함을 확인해 로그인 링크를 클릭하세요.</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </main>
  );
}

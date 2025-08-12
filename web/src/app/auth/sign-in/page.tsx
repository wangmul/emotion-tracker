"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

type Mode = "magic" | "signin" | "signup";

export default function SignInPage() {
  const supabase = getSupabase();
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setMessage(null);
    setError(null);
  };

  const sendMagicLink = async () => {
    resetState();
    setLoading(true);
    try {
      const redirect = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      });
      if (err) setError(err.message);
      else setMessage("메일함을 확인해 로그인 링크를 클릭하세요.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithPassword = async () => {
    resetState();
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else setMessage("로그인되었습니다.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPassword = async () => {
    resetState();
    setLoading(true);
    try {
      const redirect = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirect },
      });
      if (err) setError(err.message);
      else setMessage("가입 완료. 메일 인증이 필요한 경우 메일함을 확인하세요.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = useMemo(() => {
    if (mode === "magic") return "매직링크";
    if (mode === "signin") return "이메일 로그인";
    return "회원가입";
  }, [mode]);

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative rounded-3xl border border-white/15 bg-white/70 dark:bg-white/5 shadow-xl backdrop-blur-md p-8">
        <div className="pointer-events-none absolute -top-16 right-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(147,197,253,0.25)_0%,_transparent_60%)] blur-2xl" />
        <h1 className="text-2xl font-semibold text-center mb-1">로그인</h1>
        <p className="mb-6 text-center text-sm text-black/60 dark:text-white/60">{modeLabel} 방식으로 진행합니다.</p>

        {/* Segmented control */}
        <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl bg-black/[.03] p-1 dark:bg-white/10">
          {([
            { k: "magic", label: "매직링크" },
            { k: "signin", label: "이메일" },
            { k: "signup", label: "회원가입" },
          ] as { k: Mode; label: string }[]).map((t) => (
            <button
              key={t.k}
              onClick={() => setMode(t.k)}
              aria-label={t.k === "signin" ? "이메일 로그인" : t.label}
              className={`rounded-lg px-2.5 py-2 text-[13px] sm:text-sm whitespace-nowrap transition-all ${
                mode === t.k ? "bg-foreground/90 text-background shadow" : "text-black/70 dark:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Email */}
        <label htmlFor="email" className="mb-1 block text-xs font-medium text-black/70 dark:text-white/80">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mb-3 w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
        />

        {/* Password */}
        {(mode === "signin" || mode === "signup") && (
          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-black/70 dark:text-white/80">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-[#94a3b8]/30 dark:border-white/15 dark:bg-white/10"
              />
              <button
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-black/60 hover:bg-black/[.06] dark:text-white/70 dark:hover:bg-white/10"
              >
                {showPassword ? "숨김" : "보기"}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {mode === "magic" && (
          <button
            onClick={sendMagicLink}
            disabled={loading || !email}
            className="w-full rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "전송 중..." : "로그인 링크 보내기"}
          </button>
        )}

        {mode === "signin" && (
          <button
            onClick={signInWithPassword}
            disabled={loading || !email || password.length < 6}
            className="w-full rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        )}

        {mode === "signup" && (
          <button
            onClick={signUpWithPassword}
            disabled={loading || !email || password.length < 6}
            className="w-full rounded-xl bg-foreground/90 text-background px-6 py-3 font-semibold shadow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        )}

        {/* Messages */}
        {message && <p className="mt-3 text-center text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      </div>
    </main>
  );
}

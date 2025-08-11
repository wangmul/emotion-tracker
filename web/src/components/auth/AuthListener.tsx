"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();

    const url = new URL(window.location.href);
    const hasCode = url.searchParams.get("code");
    const hash = window.location.hash;
    const hasHashTokens = hash.includes("access_token=") && hash.includes("refresh_token=");

    (async () => {
      try {
        if (hasCode) {
          await supabase.auth.exchangeCodeForSession();
        } else if (hasHashTokens) {
          const params = new URLSearchParams(hash.slice(1));
          const access_token = params.get("access_token") ?? "";
          const refresh_token = params.get("refresh_token") ?? "";
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
        }
        // Clean URL (remove query/hash)
        const clean = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", clean);
      } catch {
        // ignore
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Re-render current route to reflect auth changes
      router.refresh();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  return null;
}



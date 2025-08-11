"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export function useRequireAuth(): { userId: string | null; loading: boolean } {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      if (!uid) {
        router.replace("/auth/sign-in");
      } else if (isMounted) {
        setUserId(uid);
      }
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { userId, loading };
}

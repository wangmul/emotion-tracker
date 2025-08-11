import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("daily_entries").select("id").limit(1);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

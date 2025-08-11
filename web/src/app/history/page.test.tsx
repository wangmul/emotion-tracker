import { render, screen, waitFor } from "@testing-library/react";
import HistoryPage from "./page";
import type { DailyEntry } from "@/types/dailyEntry";

import { createSupabaseMock } from "@/test/mocks/supabase";
vi.mock("@/lib/supabase/client", () => {
  const getSupabase = vi.fn(() =>
    createSupabaseMock({ selectResult: { data: [], error: null } })
  );
  return { getSupabase };
});

describe("HistoryPage", () => {
  it("shows empty state when no data", async () => {
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText(/아직 데이터가 없습니다/)).toBeInTheDocument();
    });
  });

  it("renders cards when data exists", async () => {
    const sample: DailyEntry[] = [
      {
        id: "1",
        entry_date: "2025-01-02",
        said_no_count: 1,
        asked_help_count: 2,
        chose_for_joy_count: 3,
        took_rest: true,
        must_do_tasks: ["a", "b", "c"],
        wanted_but_skipped_tasks: ["x", "y", "z"],
      },
    ];

    const mod = (await vi.importMock("@/lib/supabase/client")) as {
      getSupabase: ReturnType<typeof vi.fn> & (() => unknown);
    };
    mod.getSupabase.mockReturnValueOnce(
      createSupabaseMock({ selectResult: { data: sample, error: null } })
    );

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText("2025-01-02")).toBeInTheDocument();
      expect(screen.getByText("2025-01-02")).toBeInTheDocument();
    });
  });
});

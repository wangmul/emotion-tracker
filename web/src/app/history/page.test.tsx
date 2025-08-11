import { render, screen, waitFor } from "@testing-library/react";
import HistoryPage from "./page";

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
    const sample: any[] = [
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

    const mod: any = await vi.importMock("@/lib/supabase/client");
    mod.getSupabase.mockReturnValueOnce(
      createSupabaseMock({ selectResult: { data: sample as any, error: null } })
    );

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText("2025-01-02")).toBeInTheDocument();
      expect(screen.getByText("2025-01-02")).toBeInTheDocument();
    });
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepTwoPage from "./page";


vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/storage", () => ({
  loadStepOne: () => ({ saidNoCount: 1, askedHelpCount: 2, choseForJoyCount: 3, tookRest: true }),
  clearStepOne: vi.fn(),
}));

// Mock Supabase insert chain
const insertResponse = { data: { entry_date: "2025-01-02" }, error: null } as const;
const insertMock = vi.fn().mockReturnValue({ select: () => ({ single: () => Promise.resolve(insertResponse) }) });
const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
vi.mock("@/lib/supabase/client", () => ({
  getSupabase: vi.fn(() => ({ from: fromMock })),
}));

describe("StepTwoPage", () => {

  it("submits and navigates to history date", async () => {
    render(<StepTwoPage />);

    // Fill all inputs to satisfy schema
    await screen.findByText("당신이 하고 싶지 않지만 해야 하는 일 세가지");
    await userEvent.type(screen.getByPlaceholderText("예: 장보기"), "장보기");
    await userEvent.type(screen.getByPlaceholderText("예: 청구서 정리"), "청구서 정리");
    await userEvent.type(screen.getByPlaceholderText("예: 운동하기"), "운동하기");
    await userEvent.type(screen.getByPlaceholderText("예: 친구에게 연락하기"), "친구에게 연락하기");
    await userEvent.type(screen.getByPlaceholderText("예: 산책하기"), "산책하기");
    await userEvent.type(screen.getByPlaceholderText("예: 취미 활동"), "취미 활동");

    await userEvent.click(screen.getByRole("button", { name: "기록하기" }));

    await waitFor(() => expect(insertMock).toHaveBeenCalled());
  });

  it("shows error message when insert fails", async () => {
    // Fail once
    const failingInsert = vi.fn().mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: "insert failed" } }) }) });
    fromMock.mockReturnValueOnce({ insert: failingInsert });

    render(<StepTwoPage />);
    await screen.findByText("당신이 하고 싶지 않지만 해야 하는 일 세가지");
    await userEvent.type(screen.getByPlaceholderText("예: 장보기"), "장보기");
    await userEvent.type(screen.getByPlaceholderText("예: 청구서 정리"), "청구서 정리");
    await userEvent.type(screen.getByPlaceholderText("예: 운동하기"), "운동하기");
    await userEvent.type(screen.getByPlaceholderText("예: 친구에게 연락하기"), "친구에게 연락하기");
    await userEvent.type(screen.getByPlaceholderText("예: 산책하기"), "산책하기");
    await userEvent.type(screen.getByPlaceholderText("예: 취미 활동"), "취미 활동");
    await userEvent.click(screen.getByRole("button", { name: "기록하기" }));
    await waitFor(async () => {
      expect(await screen.findByText("insert failed")).toBeInTheDocument();
    });
  });
});

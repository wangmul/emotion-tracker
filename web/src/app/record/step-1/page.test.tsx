import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepOnePage from "./page";

// Mock next/navigation for router push
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("StepOnePage", () => {
  it("renders labels and submits with default zero values", async () => {
    render(<StepOnePage />);

    expect(screen.getByText("오늘 하루를 기록하세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("아니라고 말 한 횟수")).toBeInTheDocument();
    expect(screen.getByLabelText("도움을 요청한 횟수")).toBeInTheDocument();
    expect(screen.getByLabelText("즐거움을 위해 선택한 횟수")).toBeInTheDocument();
    expect(screen.getByLabelText("휴식을 취했나요?")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "다음으로" });
    await userEvent.click(button);

    // No error message should appear for defaults
    expect(screen.queryByText(/0 이상의 숫자를 입력하세요/)).not.toBeInTheDocument();
  });
});

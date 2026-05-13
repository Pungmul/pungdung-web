import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatLoadFailFallback } from "./ChatLoadFailFallback";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ChatLoadFailFallback", () => {
  it("목록으로 돌아가기 클릭 시 inbox로 replace 한다", async () => {
    const user = userEvent.setup();
    render(<ChatLoadFailFallback />);

    expect(screen.getByRole("heading", { name: /접근할 수 없어요/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "목록으로 돌아가기" }));

    expect(replace).toHaveBeenCalledWith("/chats/r/inbox");
  });
});

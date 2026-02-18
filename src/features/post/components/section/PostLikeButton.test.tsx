import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PostLikeButton } from "./PostLikeButton";

const { requestToggleMock } = vi.hoisted(() => ({
  requestToggleMock: vi.fn(),
}));

vi.mock("../../hooks/actions/usePostLikeWithConfirmAction", () => ({
  usePostLikeWithConfirmAction: () => ({
    requestToggle: requestToggleMock,
  }),
}));

describe("PostLikeButton", () => {
  afterEach(() => {
    cleanup();
    requestToggleMock.mockReset();
  });

  it("좋아요 카운트를 표시하고 클릭 시 requestToggle를 호출한다", async () => {
    render(
      <PostLikeButton postId={7} isLiked={false} likedNum={12} />
    );

    expect(screen.getByText("12")).toBeInTheDocument();

    await userEvent.click(
      screen.getByText("12").closest(".cursor-pointer") as HTMLElement
    );

    expect(requestToggleMock).toHaveBeenCalledWith({
      postId: 7,
      isLikedBeforeToggle: false,
      onApplied: expect.any(Function),
    });
  });
});

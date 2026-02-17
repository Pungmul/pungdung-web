import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ImageObject } from "@/shared/types/image/type";

import type { Comment } from "../../types";

import { CommentMenu } from "./CommentMenu";

const profile = {
  id: 0,
  originalFilename: "",
  convertedFileName: "",
  fullFilePath: "",
  fileType: "image/jpeg",
  fileSize: 0,
  createdAt: "",
} satisfies ImageObject;

const commentFixture: Comment = {
  commentId: 10,
  postId: 2,
  parentId: null,
  content: "c",
  userName: "u",
  profile,
  createdAt: "",
  replies: [],
};

const deleteSpy = vi.fn();
const reportSpy = vi.fn();

vi.mock("../../hooks/actions", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../hooks/actions")>();
  return {
    ...actual,
    useCommentMenuDelete: vi.fn(() => deleteSpy),
    useCommentMenuReportOpen: vi.fn(() => reportSpy),
  };
});

vi.mock("../../hooks/view-model/useAnchorDropdownPlacement", () => ({
  useAnchorDropdownPlacement: vi.fn(() => ({ openUpward: false })),
}));

vi.mock("@/shared/hooks", () => ({
  useClickOutside: vi.fn(),
}));

describe("CommentMenu", () => {
  beforeEach(() => {
    deleteSpy.mockReset();
    reportSpy.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("케밥을 열면 신고·삭제를 보여주고 클릭 시 각 핸들러가 호출된다", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<CommentMenu comment={commentFixture} />);

    const trigger = container.querySelector(
      ".relative.select-none.cursor-pointer"
    );
    expect(trigger).not.toBeNull();

    await user.click(trigger as HTMLElement);

    await user.click(await screen.findByText("신고"));
    await user.click(screen.getByText("삭제"));

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(reportSpy).toHaveBeenCalledTimes(1);
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMenu } from "./PostMenu";

const menuMocks = vi.hoisted(() => ({
  routerPush: vi.fn(),
  openModalToReport: vi.fn(),
  mutateDelete: vi.fn(),
  alertConfirm: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: menuMocks.routerPush,
  }),
  useParams: () => ({ postId: "55" }),
}));

vi.mock("../../hooks/state/useReportPost", () => ({
  useReportPost: () => ({
    openModalToReport: menuMocks.openModalToReport,
    reportedPost: null,
    isModalOpen: false,
    closeModal: vi.fn(),
  }),
}));

vi.mock("../../hooks/actions/useDeletePostAction", () => ({
  useDeletePostAction: () => ({ mutate: menuMocks.mutateDelete }),
}));

vi.mock("@/shared/store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/store")>();
  return {
    ...actual,
    alertStore: () => ({
      confirm: menuMocks.alertConfirm,
      alert: vi.fn(),
    }),
  };
});

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: () =>
      ({
        data: { title: "제목", author: "작성자" },
      }) as never,
  };
});

async function renderOpenMenu(isWriter: boolean) {
  const view = render(<PostMenu isWriter={isWriter} />);
  const trigger = view.container.querySelector(
    ".relative.select-none.cursor-pointer"
  );
  expect(trigger).not.toBeNull();
  await userEvent.click(trigger as HTMLElement);
  return view;
}

describe("PostMenu", () => {
  beforeEach(() => {
    menuMocks.routerPush.mockClear();
    menuMocks.openModalToReport.mockClear();
    menuMocks.mutateDelete.mockClear();
    menuMocks.alertConfirm.mockClear();

    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    window.history.replaceState({}, "", "/board/d/55?board=10");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("작성자는 수정·삭제가 보인다", async () => {
    await renderOpenMenu(true);

    expect(screen.getByText("수정")).toBeInTheDocument();
    expect(screen.getByText("삭제")).toBeInTheDocument();
    expect(screen.queryByText("신고")).toBeNull();
  });

  it("비작성자는 신고만 보인다", async () => {
    await renderOpenMenu(false);

    expect(screen.getByText("신고")).toBeInTheDocument();
    expect(screen.queryByText("수정")).toBeNull();
    expect(screen.queryByText("삭제")).toBeNull();
  });

  it("비작성자가 신고를 누르면 모달 열기에 메타가 전달된다", async () => {
    await renderOpenMenu(false);

    await userEvent.click(screen.getByText("신고"));

    expect(menuMocks.openModalToReport).toHaveBeenCalledWith({
      postId: 55,
      title: "제목",
      author: "작성자",
    });
  });

  it("작성자 수정 클릭 시 documentId 포함 편집 경로로 이동한다", async () => {
    await renderOpenMenu(true);

    await userEvent.click(screen.getByText("수정"));

    expect(menuMocks.routerPush).toHaveBeenCalledWith(
      expect.stringContaining("documentId=55"),
      { scroll: false }
    );
  });

  it("삭제 확인에 동의하면 게시글 삭제 mutation이 실행된다", async () => {
    await renderOpenMenu(true);

    await userEvent.click(screen.getByText("삭제"));

    expect(menuMocks.alertConfirm).toHaveBeenCalledTimes(1);
    const payload = menuMocks.alertConfirm.mock.calls[0]?.[0];
    expect(payload).toMatchObject({ title: "게시글 삭제" });

    payload?.onConfirm?.();

    expect(menuMocks.mutateDelete).toHaveBeenCalledWith({ postId: 55 });
  });
});

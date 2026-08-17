import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { clubQueries, type ClubInfo } from "@/features/club";

import { EditProfileForm } from "./EditProfileForm";
import { myPageQueries } from "../../queries";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    replace: vi.fn(),
    push: vi.fn(),
  }),
  usePathname: () => "/my-page",
  useSearchParams: () => new URLSearchParams(),
}));

const TEST_CLUB: ClubInfo = {
  clubId: 1,
  school: "홍익대학교",
  groupName: "어흥",
};

function wrapEditProfile() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(myPageQueries.info().queryKey, {
    name: "홍길동",
    phoneNumber: "010-1234-5678",
    email: "user@test.com",
    username: "user",
    groupName: "어흥",
    clubName: "풍덩",
    clubAge: 24,
    profile: {
      id: 1,
      originalFilename: "a.png",
      convertedFileName: "a.png",
      fullFilePath: "",
      fileType: "image/png",
      fileSize: 1,
      createdAt: "2020-01-01",
    },
  });
  queryClient.setQueryData(clubQueries.list().queryKey, [TEST_CLUB]);
  queryClient.setQueryData(myPageQueries.changeInfo().queryKey, {
    updatedAt: "2020-01-01T00:00:00",
    clubNameChangedAt: null,
    clubIdChangedAt: null,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <EditProfileForm />
    </QueryClientProvider>
  );
}

describe("MY-006 | 프로필 수정 - 필수값/형식 오류", () => {
  afterEach(() => {
    cleanup();
  });

  it("패명에 허용되지 않는 형식의 값 입력", async () => {
    // 1. 프로필 수정 화면 진입
    // 2. 패명에 허용되지 않는 형식의 값 입력
    // 5. 각 필드 validation 문구 확인
    const user = userEvent.setup({ delay: null });
    render(wrapEditProfile());

    const nickname = screen.getByLabelText("패명");
    await user.clear(nickname);
    await user.type(nickname, "nick");
    await user.tab();

    expect(
      await screen.findByText("올바른 형식의 한글 패명을 입력하세요")
    ).toBeVisible();
    expect(
      screen.queryByText("올바른 값을 입력해 주세요")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "입력값을 확인해주세요" })
    ).toBeDisabled();
  });
});

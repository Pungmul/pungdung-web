import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { ChatRoomSettingScreen } from "./_ChatRoomSettingScreen";

const updateRoomName = vi.hoisted(() => vi.fn());

vi.mock("next/image", () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/chats",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/features/chat", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/chat")>();
  return {
    ...actual,
    useChatRoomDisplayOverride: () => ({
      override: undefined,
      hydrated: true,
      updateRoomName,
      updateProfileImageUrl: vi.fn(),
    }),
    useChatNotificationSettingAction: () => ({
      updateRoomNotification: vi.fn(),
      isUpdatingRoomNotification: false,
    }),
  };
});

describe("CHAT-054 | 채팅방 설정 - 로컬 이름 빈 값 저장 차단", () => {
  afterEach(() => {
    cleanup();
    updateRoomName.mockReset();
  });

  it("채팅방 이름을 모두 삭제", async () => {
    // 1. 채팅방 이름을 모두 삭제
    // 2. 저장 시도
    // 제품은 별도 저장 버튼 없이 입력 즉시 반영
    // 빈 값은 override 제거로 서버 이름을 유지
    const user = userEvent.setup({ delay: null });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    render(
      <ViewStoreProvider initialView="mobile">
        <QueryClientProvider client={queryClient}>
          <ChatRoomSettingScreen
            roomId="room-1"
            defaultRoomName="서버 방"
            defaultProfileImageUrl={null}
            onBack={vi.fn()}
          />
        </QueryClientProvider>
      </ViewStoreProvider>
    );

    const nameInput = screen.getByLabelText("채팅방 이름");
    await user.type(nameInput, "로컬");
    await user.clear(nameInput);

    expect(updateRoomName).toHaveBeenCalledWith(undefined);
    expect(nameInput).toHaveAttribute("placeholder", "서버 방");
  });
});

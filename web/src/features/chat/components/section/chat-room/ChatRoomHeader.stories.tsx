import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { ChatRoomHeader } from "./ChatRoomHeader";

const back = fn();

const meta = {
  title: "features/chat/ChatRoomHeader",
  component: ChatRoomHeader,
  args: {
    title: "강윤호",
    roomType: "NORMAL",
    group: false,
    memberCount: 2,
    onBack: back,
    onOpenDrawer: fn(),
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      router: {
        back,
      },
    },
  },
  decorators: [
    (Story) => (
      <ViewStoreProvider initialView="mobile">
        <div className="w-[390px] bg-background">
          <Story />
        </div>
      </ViewStoreProvider>
    ),
  ],
} satisfies Meta<typeof ChatRoomHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Personal: Story = {};

export const NormalGroup: Story = {
  args: {
    title: "호두마루님의 모임",
    group: true,
    memberCount: 8,
  },
};

export const Lightning: Story = {
  args: {
    title: "장구 치고 싶은 사람들",
    roomType: "LIGHTNING",
    group: true,
    memberCount: 8,
  },
};

export const Performance: Story = {
  args: {
    title: "제9회 어우러짐 흥 정기 공연",
    roomType: "PERFORMANCE",
    group: true,
    memberCount: 8,
  },
};

export const LongTitle: Story = {
  args: {
    title: "제9회 어우러짐 흥 정기 공연 아주 긴 제목은 말줄임",
    roomType: "PERFORMANCE",
    group: true,
    memberCount: 8,
  },
};

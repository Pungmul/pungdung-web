import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ChatLightningInfoPanelView } from "./ChatLightningInfoPanelView";

const meta = {
  title: "features/chat/ChatLightningInfoPanel",
  component: ChatLightningInfoPanelView,
  args: {
    phase: "ongoing",
    title: "장구 치고 싶은 사람들",
    location: "상명대 중앙교수회관 지하 소강당",
    timeLabel: "미정",
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatLightningInfoPanelView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ongoing: Story = {};

export const WithStartTime: Story = {
  args: {
    timeLabel: "13시 30분 부터",
  },
};

export const Past: Story = {
  args: {
    phase: "past",
  },
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  lightningRoom,
  longTitleRoom,
  normalGroupRoom,
  performanceRoom,
  personalRoom,
  sampleRooms,
} from "./chat-room-box.stories.fixtures";
import { ChatRoomBox } from "./index";

const storyQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: "features/chat/ChatRoomBox",
  component: ChatRoomBox,
  args: {
    room: personalRoom,
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={storyQueryClient}>
        <div className="w-[390px] bg-background">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof ChatRoomBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Personal: Story = {};

export const NormalGroup: Story = {
  args: { room: normalGroupRoom },
};

export const Lightning: Story = {
  args: { room: lightningRoom },
};

export const Performance: Story = {
  args: { room: performanceRoom },
};

export const LongTitle: Story = {
  args: { room: longTitleRoom },
};

export const List: Story = {
  render: () => (
    <div className="flex w-[390px] flex-col bg-background">
      {sampleRooms.map((item) => (
        <ChatRoomBox key={item.chatRoomUUID} room={item} />
      ))}
    </div>
  ),
};

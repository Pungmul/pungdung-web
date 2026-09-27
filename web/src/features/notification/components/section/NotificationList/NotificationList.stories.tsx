import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotificationListView } from "./NotificationListView";
import {
  previousLightning,
  unreadLightning,
  unreadPerformance,
  unreadPost,
} from "../notification.stories.fixtures";

const meta = {
  title: "features/notification/NotificationList",
  component: NotificationListView,
  args: {
    notifications: [unreadLightning, unreadPost, unreadPerformance, previousLightning],
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPrevious: Story = {};

export const UnreadOnly: Story = {
  args: { notifications: [unreadLightning, unreadPost, unreadPerformance] },
};

export const PreviousOnly: Story = {
  args: { notifications: [previousLightning] },
};

export const Empty: Story = { args: { notifications: [] } };

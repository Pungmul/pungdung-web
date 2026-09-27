import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  previousLightning,
  unreadLightning,
  unreadPerformance,
  unreadPost,
  withoutLink,
} from "./notification.stories.fixtures";
import { NotificationListItemRow } from "./NotificationListItemRow";

const meta = {
  title: "features/notification/NotificationListItemRow",
  component: NotificationListItemRow,
  args: {
    notification: unreadLightning,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-grey-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationListItemRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UnreadLightning: Story = {};

export const UnreadPost: Story = {
  args: { notification: unreadPost },
};

export const UnreadPerformance: Story = {
  args: { notification: unreadPerformance },
};

export const Read: Story = {
  args: { notification: previousLightning },
};

export const WithoutLink: Story = {
  args: { notification: withoutLink },
};

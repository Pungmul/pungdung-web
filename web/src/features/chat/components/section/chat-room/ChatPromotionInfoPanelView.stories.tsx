import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ChatPromotionInfoPanelView } from "./ChatPromotionInfoPanelView";

const meta = {
  title: "features/chat/ChatPromotionInfoPanel",
  component: ChatPromotionInfoPanelView,
  args: {
    href: "/board/promote/d/pk-8",
    posterUrl: "/example/poster.jpg",
    title: "제9회 어우러짐 흥 정기 공연: 어게인 풍물",
    location: "상명대 중앙교수회관 지하 소강당",
    scheduleLabel: "2025.05.05(금) 늦은 5시 00분",
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPromotionInfoPanelView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

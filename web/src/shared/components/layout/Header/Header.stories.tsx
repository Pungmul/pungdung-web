import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { Header } from "./Header";

type PageHeaderArgs = {
  title: string;
  isBackBtn: boolean;
};

function PageHeader({ title, isBackBtn }: PageHeaderArgs) {
  return <Header title={title} isBackBtn={isBackBtn} />;
}

const meta = {
  title: "shared/layout/Header",
  component: PageHeader,
  args: {
    title: "알림",
    isBackBtn: true,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ViewStoreProvider initialView="mobile">
        <div className="w-[390px]">
          <Story />
        </div>
      </ViewStoreProvider>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutBack: Story = {
  args: {
    isBackBtn: false,
  },
};

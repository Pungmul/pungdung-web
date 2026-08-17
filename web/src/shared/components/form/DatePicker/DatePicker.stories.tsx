import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DatePicker } from "./DatePicker";

function ScheduleDatePicker() {
  const [value, setValue] = useState("2026-08-17");

  return <DatePicker value={value} onChange={setValue} />;
}

const meta = {
  title: "shared/form/DatePicker",
  component: ScheduleDatePicker,
  decorators: [
    (Story) => (
      <div className="w-[320px] border-2 border-grey-300 rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

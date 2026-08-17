import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TimePicker } from "./TimePicker";

function ScheduleTimePicker() {
  const [value, setValue] = useState("14:30:00");

  return (
    <TimePicker
      value={value}
      onChange={setValue}
      showAmPm
    />
  );
}

const meta = {
  title: "shared/form/TimePicker",
  component: ScheduleTimePicker,
  decorators: [
    (Story) => (
      <div className="w-fit border-2 border-grey-300 rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleTimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

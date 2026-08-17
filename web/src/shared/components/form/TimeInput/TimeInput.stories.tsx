import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TimeInput } from "./TimeInput";

type ScheduleTimeArgs = {
  label: string;
  errorMessage: string;
  disabled: boolean;
  showAmPm: boolean;
};

function ScheduleTime({
  label,
  errorMessage,
  disabled,
  showAmPm,
}: ScheduleTimeArgs) {
  const [value, setValue] = useState("");

  return (
    <TimeInput
      name="time"
      label={label}
      errorMessage={errorMessage || undefined}
      disabled={disabled}
      showAmPm={showAmPm}
      value={value}
      onChange={setValue}
    />
  );
}

const meta = {
  title: "shared/form/TimeInput",
  component: ScheduleTime,
  args: {
    label: "공연 시간",
    errorMessage: "",
    disabled: false,
    showAmPm: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    errorMessage: "시간을 입력해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

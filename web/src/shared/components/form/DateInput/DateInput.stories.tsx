import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DateInput } from "./DateInput";

type ScheduleDateArgs = {
  label: string;
  errorMessage: string;
  disabled: boolean;
};

function ScheduleDate({ label, errorMessage, disabled }: ScheduleDateArgs) {
  const [value, setValue] = useState("");

  return (
    <DateInput
      name="date"
      label={label}
      errorMessage={errorMessage || undefined}
      disabled={disabled}
      value={value}
      onChange={setValue}
    />
  );
}

const meta = {
  title: "shared/form/DateInput",
  component: ScheduleDate,
  args: {
    label: "날짜",
    errorMessage: "",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  render: (args) => {
    const [value, setValue] = useState("2026-08-17");

    return (
      <DateInput
        name="date"
        label={args.label}
        errorMessage={args.errorMessage || undefined}
        disabled={args.disabled}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Error: Story = {
  args: {
    errorMessage: "날짜를 입력해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

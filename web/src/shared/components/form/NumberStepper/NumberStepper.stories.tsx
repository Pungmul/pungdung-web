import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NumberStepper } from "./NumberStepper";

type PersonnelStepperArgs = {
  label: string;
  errorMessage: string;
  disabled: boolean;
};

function PersonnelStepper({
  label,
  errorMessage,
  disabled,
}: PersonnelStepperArgs) {
  const [value, setValue] = useState(4);

  return (
    <NumberStepper
      label={label}
      value={value}
      min={4}
      max={100}
      onChange={setValue}
      onDecrement={() => {
        setValue((current) => Math.max(4, current - 1));
      }}
      onIncrement={() => {
        setValue((current) => Math.min(100, current + 1));
      }}
      canDecrement={value > 4}
      canIncrement={value < 100}
      disabled={disabled}
      {...(errorMessage ? { errorMessage } : {})}
    />
  );
}

const meta = {
  title: "shared/form/NumberStepper",
  component: PersonnelStepper,
  args: {
    label: "최소 인원",
    errorMessage: "",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px] px-4 py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PersonnelStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    errorMessage: "최소 인원을 확인해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

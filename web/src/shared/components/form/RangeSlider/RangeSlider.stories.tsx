import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RangeSlider } from "./RangeSlider";

type PersonnelRangeArgs = {
  label: string;
  errorMessage: string;
  disabled: boolean;
};

function PersonnelRange({ label, errorMessage, disabled }: PersonnelRangeArgs) {
  const [minimumValue, setMinimumValue] = useState(4);
  const [maximumValue, setMaximumValue] = useState(20);

  return (
    <RangeSlider
      minimumName="최소 인원"
      maximumName="최대 인원"
      minValue={minimumValue}
      maxValue={maximumValue}
      min={4}
      max={100}
      onChange={(nextMinimum, nextMaximum) => {
        setMinimumValue(nextMinimum);
        setMaximumValue(nextMaximum);
      }}
      disabled={disabled}
      {...(label ? { label } : {})}
      {...(errorMessage ? { errorMessage } : {})}
    />
  );
}

const meta = {
  title: "shared/form/RangeSlider",
  component: PersonnelRange,
  args: {
    label: "인원",
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
} satisfies Meta<typeof PersonnelRange>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    errorMessage: "인원 범위를 다시 선택해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

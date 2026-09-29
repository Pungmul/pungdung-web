import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RangeSlider } from "./RangeSlider";
import { NumberStepper } from "../NumberStepper";

type PersonnelRangeArgs = {
  label: string;
  errorMessage: string;
  disabled: boolean;
};

const minimumBound = 4;
const maximumBound = 100;

function PersonnelRange({ label, errorMessage, disabled }: PersonnelRangeArgs) {
  const [minimumValue, setMinimumValue] = useState(minimumBound);
  const [maximumValue, setMaximumValue] = useState(20);

  return (
    <RangeSlider
      minimumName="최소 인원"
      maximumName="최대 인원"
      minValue={minimumValue}
      maxValue={maximumValue}
      min={minimumBound}
      max={maximumBound}
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

function PersonnelRangeWithSteppers() {
  const [minimumValue, setMinimumValue] = useState(minimumBound);
  const [maximumValue, setMaximumValue] = useState(20);

  const updateRange = (nextMinimum: number, nextMaximum: number) => {
    setMinimumValue(nextMinimum);
    setMaximumValue(nextMaximum);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 px-1">
        <NumberStepper
          label="최소 인원"
          value={minimumValue}
          min={minimumBound}
          max={maximumBound - 1}
          onChange={(nextMinimum) => {
            if (nextMinimum < maximumValue) {
              updateRange(nextMinimum, maximumValue);
            }
          }}
          onDecrement={() => {
            const nextMinimum = Math.max(minimumBound, minimumValue - 1);
            if (nextMinimum < maximumValue) {
              updateRange(nextMinimum, maximumValue);
            }
          }}
          onIncrement={() => {
            updateRange(
              Math.min(maximumValue - 1, minimumValue + 1),
              maximumValue
            );
          }}
          canDecrement={minimumValue > minimumBound}
          canIncrement={minimumValue < maximumValue - 1}
        />
        <NumberStepper
          label="최대 인원"
          value={maximumValue}
          min={minimumBound + 1}
          max={maximumBound}
          onChange={(nextMaximum) => {
            if (nextMaximum > minimumValue) {
              updateRange(minimumValue, nextMaximum);
            }
          }}
          onDecrement={() => {
            updateRange(
              minimumValue,
              Math.max(minimumValue + 1, maximumValue - 1)
            );
          }}
          onIncrement={() => {
            updateRange(
              minimumValue,
              Math.min(maximumBound, maximumValue + 1)
            );
          }}
          canDecrement={maximumValue > minimumValue + 1}
          canIncrement={maximumValue < maximumBound}
        />
      </div>
      <div className="px-1">
        <RangeSlider
          minimumName="최소 인원"
          maximumName="최대 인원"
          minValue={minimumValue}
          maxValue={maximumValue}
          min={minimumBound}
          max={maximumBound}
          step={1}
          onChange={updateRange}
        />
      </div>
    </div>
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

export const Personnel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => <PersonnelRangeWithSteppers />,
};

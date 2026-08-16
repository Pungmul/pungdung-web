import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Select } from "./Select";

const CLUB_OPTIONS = [
  { label: "풍덩", value: "pungdung" },
  { label: "북악", value: "bugak" },
  { label: "소속패 없음", value: null },
] as const;

type ClubSelectArgs = {
  label: string;
  placeholder: string;
  hasSearch: boolean;
  errorMessage: string;
  disabled: boolean;
  initialValue: string | null;
};

function ClubSelect({
  label,
  placeholder,
  hasSearch,
  errorMessage,
  disabled,
  initialValue,
}: ClubSelectArgs) {
  const [value, setValue] = useState<string | null>(initialValue);

  return (
    <Select
      name="club"
      label={label}
      placeholder={placeholder}
      hasSearch={hasSearch}
      errorMessage={errorMessage || undefined}
      disabled={disabled}
      value={value}
      onChange={setValue}
    >
      {CLUB_OPTIONS.map((option) => (
        <Select.Option key={option.label} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}

const meta = {
  title: "shared/form/Select",
  component: ClubSelect,
  args: {
    label: "소속패",
    placeholder: "소속패를 선택해주세요.",
    hasSearch: false,
    errorMessage: "",
    disabled: false,
    initialValue: null,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px] min-h-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClubSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Selected: Story = {
  args: {
    initialValue: "pungdung",
  },
};

export const Search: Story = {
  args: {
    hasSearch: true,
  },
};

export const Error: Story = {
  args: {
    errorMessage: "소속패를 선택해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    initialValue: "pungdung",
    disabled: true,
  },
};

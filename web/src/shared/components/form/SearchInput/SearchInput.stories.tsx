import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SearchInput from "./SearchInput";

type FriendSearchArgs = {
  placeholder: string;
  variant: "default" | "mutedBar";
  hasClose: boolean;
  initialValue: string;
};

function FriendSearch({
  placeholder,
  variant,
  hasClose,
  initialValue,
}: FriendSearchArgs) {
  const [value, setValue] = useState(initialValue);

  return (
    <SearchInput
      name="friendSearch"
      placeholder={placeholder}
      variant={variant}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...(hasClose ? { onClose: () => setValue("") } : {})}
    />
  );
}

const meta = {
  title: "shared/form/SearchInput",
  component: FriendSearch,
  args: {
    placeholder: "검색",
    variant: "default",
    hasClose: false,
    initialValue: "",
  },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FriendSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Searching: Story = {
  args: {
    initialValue: "풍덩",
  },
};

export const WithClose: Story = {
  args: {
    hasClose: true,
    initialValue: "풍덩",
  },
};

export const MutedBar: Story = {
  args: {
    placeholder: "친구 검색",
    variant: "mutedBar",
    initialValue: "",
  },
};

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextArea } from "./TextArea";

type IntroTextAreaArgs = {
  label: string;
  placeholder: string;
  errorMessage: string;
  disabled: boolean;
};

function IntroTextArea({
  label,
  placeholder,
  errorMessage,
  disabled,
}: IntroTextAreaArgs) {
  const [value, setValue] = useState("");

  return (
    <TextArea
      name="intro"
      label={label}
      placeholder={placeholder}
      {...(errorMessage ? { errorMessage } : {})}
      disabled={disabled}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

const meta = {
  title: "shared/form/TextArea",
  component: IntroTextArea,
  args: {
    label: "소개",
    placeholder: "소개를 입력해주세요.",
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
} satisfies Meta<typeof IntroTextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    errorMessage: "소개를 입력해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

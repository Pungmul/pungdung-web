import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Input from "./Input";

type NameInputArgs = {
  label: string;
  placeholder: string;
  errorMessage: string;
  disabled: boolean;
  required: boolean;
};

function NameInput({
  label,
  placeholder,
  errorMessage,
  disabled,
  required,
}: NameInputArgs) {
  const [value, setValue] = useState("");

  return (
    <Input
      name="name"
      label={label}
      placeholder={placeholder}
      errorMessage={errorMessage || undefined}
      disabled={disabled}
      required={required}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

const meta = {
  title: "shared/form/Input",
  component: NameInput,
  args: {
    label: "이름",
    placeholder: "이름을 입력해주세요.",
    errorMessage: "",
    disabled: false,
    required: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NameInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    errorMessage: "이름을 입력해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

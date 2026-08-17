import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./Checkbox";

type TermsCheckboxArgs = {
  label: string;
  required: boolean;
  initiallyChecked: boolean;
};

function TermsCheckbox({
  label,
  required,
  initiallyChecked,
}: TermsCheckboxArgs) {
  const [checked, setChecked] = useState(initiallyChecked);

  return (
    <Checkbox
      name="agreeService"
      label={label}
      required={required}
      value={checked}
      onChange={setChecked}
    />
  );
}

const meta = {
  title: "shared/form/Checkbox",
  component: TermsCheckbox,
  args: {
    label: "이용 약관에 동의합니다",
    required: true,
    initiallyChecked: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TermsCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    initiallyChecked: true,
  },
};

export const Optional: Story = {
  args: {
    required: false,
  },
};

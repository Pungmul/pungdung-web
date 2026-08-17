import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Toggle } from "./Toggle";

type AutoLoginToggleArgs = {
  label: string;
  initiallyChecked: boolean;
};

function AutoLoginToggle({ label, initiallyChecked }: AutoLoginToggleArgs) {
  const [checked, setChecked] = useState(initiallyChecked);

  return <Toggle checked={checked} toggle={setChecked} label={label} />;
}

const meta = {
  title: "shared/form/Toggle",
  component: AutoLoginToggle,
  args: {
    label: "자동 로그인",
    initiallyChecked: false,
  },
} satisfies Meta<typeof AutoLoginToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    initiallyChecked: true,
  },
};

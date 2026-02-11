import { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@/shared/components/Icons";

export function usePasswordVisibility() {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((prev) => !prev);

  const type = visible ? "text" : "password";

  const trailingComponent = (
    <span
      className="size-[32px] p-[4px] cursor-pointer flex items-center justify-center text-grey-300 hover:text-grey-500"
      onClick={toggle}
    >
      {visible ? <EyeIcon /> : <EyeSlashIcon />}
    </span>
  );

  return { type, trailingComponent } as const;
}

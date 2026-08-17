import { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@/shared/components/Icons";

import { AUTH_UI_MESSAGE } from "../../constants";

interface PasswordVisibilityOptions {
  showLabel?: string;
  hideLabel?: string;
}

export function usePasswordVisibility(
  options: PasswordVisibilityOptions = {}
) {
  const showLabel = options.showLabel ?? AUTH_UI_MESSAGE.SHOW_PASSWORD;
  const hideLabel = options.hideLabel ?? AUTH_UI_MESSAGE.HIDE_PASSWORD;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((isCurrentlyVisible) => !isCurrentlyVisible);
  };

  const type = isPasswordVisible ? "text" : "password";
  const visibilityLabel = isPasswordVisible ? hideLabel : showLabel;

  const trailingComponent = (
    <button
      type="button"
      aria-label={visibilityLabel}
      aria-pressed={isPasswordVisible}
      onClick={togglePasswordVisibility}
      className="flex size-8 items-center justify-center p-1 text-grey-300 hover:text-grey-500"
    >
      {isPasswordVisible ? (
        <EyeIcon className="size-full" aria-hidden />
      ) : (
        <EyeSlashIcon className="size-full" aria-hidden />
      )}
    </button>
  );

  return { type, trailingComponent } as const;
}

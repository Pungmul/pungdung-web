import { useEffect } from "react";

type UseModalEscapeKeyOptions = {
  enabled: boolean;
  onEscape: () => void;
};

export function useModalEscapeKey({
  enabled,
  onEscape,
}: UseModalEscapeKeyOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onEscape]);
}

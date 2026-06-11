"use client";

import { useEffect, useMemo, useState } from "react";

import type { LightningCardRefType } from "../../types";

export const useLightningCardState = (
  onRefSet?: (ref: LightningCardRefType | null) => void
) => {
  const [isFocused, setIsFocused] = useState(false);

  const refValue = useMemo(
    () => ({
      focus: () => setIsFocused(true),
      blur: () => setIsFocused(false),
    }),
    []
  );

  useEffect(() => {
    onRefSet?.(refValue);

    return () => {
      onRefSet?.(null);
    };
  }, [onRefSet, refValue]);

  return {
    isFocused,
  };
};

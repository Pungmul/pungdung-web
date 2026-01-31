'use client';

import { useView } from "@/shared/lib/useView";
import React, { useEffect, useState } from "react";
import { match } from "ts-pattern";

type ResponsiveProps = {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  initialView?: "mobile" | "desktop";
};

export const Responsive: React.FC<ResponsiveProps> = ({
  mobile,
  desktop,
  initialView,
}) => {
  const view = useView();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const effectiveView = isHydrated ? view : initialView ?? view;

  return match(effectiveView)
    .with("desktop", () => desktop)
    .otherwise(() => mobile);
};

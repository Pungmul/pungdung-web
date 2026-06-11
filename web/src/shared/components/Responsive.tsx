"use client";

import React from "react";

import { match } from "ts-pattern";

import { useView } from "@/shared/lib/view/view-store-provider";

type ResponsiveProps = {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
};

export function Responsive({ mobile, desktop }: ResponsiveProps) {
  const view = useView();

  return match(view)
    .with("desktop", () => desktop)
    .otherwise(() => mobile);
}

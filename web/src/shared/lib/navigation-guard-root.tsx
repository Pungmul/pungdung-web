"use client";

import { NavigationGuardProvider } from "next-navigation-guard";

export function NavigationGuardRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationGuardProvider>{children}</NavigationGuardProvider>;
}

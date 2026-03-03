"use client";

import type { ReactNode } from "react";

import { useView } from "@/shared/lib/view/view-store-provider";

export function LightningBuildLayoutClient({ children }: { children: ReactNode }) {
  const view = useView();

  if (view === "desktop") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex h-[90dvh] min-h-[90dvh] max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-background shadow-xl">
          {children}
        </div>
      </div>
    );
  }

  return children;
}

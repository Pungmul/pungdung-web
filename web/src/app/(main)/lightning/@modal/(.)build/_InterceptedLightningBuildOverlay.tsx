"use client";

import { useView } from "@/shared/lib/view/view-store-provider";

export function InterceptedLightningBuildOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = useView();

  if (view === "desktop") {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 md:items-center md:p-4">
        <div className="flex h-[90dvh] min-h-[90dvh] max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl md:rounded-2xl">
          {children}
        </div>
      </div>
    );
  }

  return <div className="fixed inset-0 z-[100] flex flex-col bg-background">{children}</div>;
}

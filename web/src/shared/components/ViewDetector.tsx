"use client";

import { useEffect } from "react";

import { bindViewportChange } from "@/shared/lib/view/bindViewportChange";
import { resolveRuntimeView } from "@/shared/lib/view/resolveRuntimeView";
import { useSetView } from "@/shared/lib/view/view-store-provider";

export default function ViewDetector() {
  const setView = useSetView();

  useEffect(() => {
    const syncViewByViewport = () => {
      const runtimeView = resolveRuntimeView();
      setView(runtimeView);
    };

    syncViewByViewport();
    return bindViewportChange(syncViewByViewport);
  }, [setView]);

  return null;
}

"use client";

import { useEffect } from "react";

import { useViewStore } from "@/shared/lib/useView";
import { bindViewportChange } from "@/shared/lib/view/bindViewportChange";
import { resolveRuntimeView } from "@/shared/lib/view/resolveRuntimeView";

// ViewDetector - effect 밖에서 즉시 실행
export default function ViewDetector() {
  useEffect(() => {
    // viewport 변경 감지만 여기서
    const syncViewByViewport = () => {
      const runtimeView = resolveRuntimeView();
      useViewStore.getState().setView(runtimeView);
    };

    syncViewByViewport();
    return bindViewportChange(syncViewByViewport);
  }, []);

  return null;
}

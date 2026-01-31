'use client'
import { bindViewportChange } from "@/shared/lib/view/bindViewportChange";
import { resolveRuntimeView } from "@/shared/lib/view/resolveRuntimeView";
import { useViewStore } from "@/shared/lib/useView";
import { ViewType } from "@/shared/types";
import { useEffect, useState } from "react";

interface ViewDetectorProps {
   initialView?: ViewType;
}

export default function ViewDetector({ initialView }: ViewDetectorProps) {
   const [isInitialized, setIsInitialized] = useState(false);

   // 서버 쿠키 힌트(initialView)를 먼저 반영해 초기 렌더의 뷰 기준을 맞춥니다.
   useEffect(() => {
      if (!initialView) {
         setIsInitialized(true);
         return;
      }

      useViewStore.getState().initializeView(initialView);
      setIsInitialized(true);
   }, [initialView]);

   // 페이지에서 useView를 사용하지 않아도 루트에서 viewport 변경을 쿠키와 동기화합니다.
   useEffect(() => {
      if (!isInitialized || typeof window === "undefined") {
         return;
      }

      const syncViewByViewport = () => {
         const runtimeView = resolveRuntimeView();
         useViewStore.getState().setView(runtimeView);
      };

      // useView 사용 여부와 무관하게 루트에서 항상 동기화
      syncViewByViewport();

      // 768px 경계 교차 시 store 갱신 -> setView 내부에서 쿠키도 함께 갱신됩니다.
      return bindViewportChange(syncViewByViewport);
   }, [isInitialized]);

   return null;
}


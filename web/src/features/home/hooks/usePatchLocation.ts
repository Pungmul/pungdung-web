"use client";
import { useEffect } from "react";

import { useLocation } from "@/features/location/store";

export function usePatchLocation() {
  const { 
    getCurrentPosition,
    startWatching,
    stopWatching 
  } = useLocation();

  useEffect(() => {
    // 초기 위치 가져오기
    getCurrentPosition();
    
    // 위치 감시 시작
    startWatching();

    // 컴포넌트 언마운트 시 감시 중단
    return () => {
      stopWatching();
    };
  }, [getCurrentPosition, startWatching, stopWatching]);

  return { location: getCurrentPosition() };
} 
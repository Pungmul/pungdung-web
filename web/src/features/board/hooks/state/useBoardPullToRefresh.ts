"use client";

import { useEffect, useRef, useState } from "react";

const TRIGGER_DISTANCE = 72;
const MAX_DISTANCE = 100;

export function useBoardPullToRefresh(onRefresh: () => Promise<void>, isRefreshing: boolean) {
  const [distance, setDistance] = useState(0);
  const touch = useRef<{ x: number; y: number; distance: number; horizontal: boolean } | null>(null);

  useEffect(() => {
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    const atTop = () => Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) <= 0;
    const start = (event: TouchEvent) => {
      if (!isMobile() || isRefreshing || !atTop() || event.touches.length !== 1) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      for (let element = target instanceof HTMLElement ? target : null;
        element && element !== document.body;
        element = element.parentElement) {
        const overflow = window.getComputedStyle(element).overflowY;
        if ((overflow === "auto" || overflow === "scroll") && element.scrollTop > 0) return;
      }
      const point = event.touches[0];
      if (point) touch.current = { x: point.clientX, y: point.clientY, distance: 0, horizontal: false };
    };
    const move = (event: TouchEvent) => {
      const current = touch.current;
      const point = event.touches[0];
      if (!current || !point || !atTop()) return;
      const dx = point.clientX - current.x;
      const dy = point.clientY - current.y;
      if (current.horizontal || (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy))) {
        current.horizontal = true;
        return;
      }
      if (dy < 8) {
        current.distance = 0;
        setDistance(0);
        return;
      }
      if (event.cancelable) event.preventDefault();
      current.distance = Math.min(MAX_DISTANCE, dy * 0.5);
      setDistance(current.distance);
    };
    const end = () => {
      const current = touch.current;
      touch.current = null;
      setDistance(0);
      if (current && !current.horizontal && current.distance >= TRIGGER_DISTANCE) void onRefresh();
    };
    const cancel = () => { touch.current = null; setDistance(0); };
    document.body.addEventListener("touchstart", start, { passive: true });
    document.body.addEventListener("touchmove", move, { passive: false });
    document.body.addEventListener("touchend", end, { passive: true });
    document.body.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      document.body.removeEventListener("touchstart", start);
      document.body.removeEventListener("touchmove", move);
      document.body.removeEventListener("touchend", end);
      document.body.removeEventListener("touchcancel", cancel);
    };
  }, [onRefresh, isRefreshing]);

  return { distance, progress: Math.min(distance / TRIGGER_DISTANCE, 1), ready: distance >= TRIGGER_DISTANCE };
}

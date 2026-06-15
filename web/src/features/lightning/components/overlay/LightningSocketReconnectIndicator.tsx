"use client";

import { useIsFetching } from "@tanstack/react-query";

import { useSocketConnectionState } from "@pungdung/worker-socket-bridge/react";

import { Spinner } from "@/shared";

import { lightningQueries } from "../../queries";

/** Figma `2373:4106` LightningSocketReconnectOverlay — fixed tint, not theme tokens */
const RECONNECT_OVERLAY_BG = "rgba(35, 36, 36, 0.35)";

export function LightningSocketReconnectIndicator() {
  const { phase, isConnected } = useSocketConnectionState();
  const isLightningDataFetching =
    useIsFetching({
      queryKey: lightningQueries.lightningData().queryKey,
    }) > 0;

  const isSocketRecovering =
    phase === "connecting" ||
    phase === "reconnecting" ||
    (!isConnected && phase !== "idle");

  if (!isSocketRecovering && !isLightningDataFetching) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center backdrop-blur-[4px]"
      style={{ backgroundColor: RECONNECT_OVERLAY_BG }}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-normal leading-4 text-grey-800 shadow-up-sm bg-background"
      >
        <Spinner size={16} baseColor="var(--color-grey-100)" highlightColor="var(--color-grey-800)" />
        번개 목록 재연결 중...
      </div>
    </div>
  );
}

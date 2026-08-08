"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useOnlineStatus } from "@/shared/hooks";
import { notifyOnlineRecovery } from "@/shared/lib/online-recovery";

import { Button } from "./buttons";

function isStandaloneDisplayMode() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function OfflineNotice() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  const wasOfflineRef = useRef(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneDisplayMode());
  }, []);

  const recoverActiveQueries = useCallback(() => {
    void queryClient.invalidateQueries({ type: "active" }).then(() => {
      notifyOnlineRecovery();
    });
  }, [queryClient]);

  const handleRecover = useCallback(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }
    recoverActiveQueries();
  }, [recoverActiveQueries]);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      return;
    }
    // 최초 마운트가 이미 online이면 복구하지 않음
    if (!wasOfflineRef.current) {
      return;
    }
    wasOfflineRef.current = false;
    recoverActiveQueries();
  }, [isOnline, recoverActiveQueries]);

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-center gap-2 bg-grey-800 px-4 py-2 text-sm text-grey-100"
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-grey-700"
        aria-hidden
      >
        <ExclamationTriangleIcon className="size-4 shrink-0" />
      </span>
      <span>인터넷 연결이 끊겼습니다</span>
      {isStandalone ? (
        <Button
          type="button"
          className="h-auto px-2 py-1 text-sm"
          onClick={handleRecover}
        >
          다시 시도
        </Button>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { useSocketManager } from "@pungdung/worker-socket-bridge/react";
import * as Sentry from "@sentry/nextjs";

import { collectDeviceExtras } from "../report-app-error/report-app-error-device";

export function useReportSocketRecoveryFailure() {
  const socket = useSocketManager();

  useEffect(() => {
    let reported = false;

    const reportFailure = () => {
      const { phase, error } = socket.getSnapshot().connection;
      if (phase !== "failed" || error !== "worker-recovery-timeout") {
        reported = false;
        return;
      }
      if (reported) {
        return;
      }

      reported = true;
      Sentry.withScope((scope) => {
        scope.setLevel("error");
        scope.setTag("report_class", "failure");
        scope.setTag("feature", "socket");
        scope.setTag("component", "worker-recovery");
        scope.setTag("socket_runtime_current", socket.getRuntimeMode() ?? "unknown");
        scope.setFingerprint(["socket", "worker-recovery-failed"]);
        scope.setExtras(collectDeviceExtras());
        Sentry.captureException(new Error("Socket worker recovery failed"));
      });
    };

    const unsubscribe = socket.storeSubscribe(reportFailure);
    reportFailure();
    return () => {
      unsubscribe();
    };
  }, [socket]);
}

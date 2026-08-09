"use client";

import { useEffect } from "react";

import { registerAppServiceWorker } from "@/shared/lib/app-service-worker";

export function AppServiceWorkerRegistration() {
  useEffect(() => {
    void registerAppServiceWorker().catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
  }, []);

  return null;
}

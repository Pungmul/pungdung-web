"use client";

import { useEffect } from "react";

import { subscribeOnlineRecovery } from "@/shared/lib/online-recovery";

export function useRecoverOnOnline(reset: () => void) {
  useEffect(() => subscribeOnlineRecovery(reset), [reset]);
}

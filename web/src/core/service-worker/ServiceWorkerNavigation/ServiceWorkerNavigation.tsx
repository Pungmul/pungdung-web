"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { restoreServiceWorkerEntryHistory } from "./restore-entry-history";
import { subscribeToServiceWorkerNavigation } from "../subscribe-to-navigation";

export function ServiceWorkerNavigation() {
  const router = useRouter();

  useEffect(() => {
    restoreServiceWorkerEntryHistory();
    return subscribeToServiceWorkerNavigation((href) => {
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (current !== href) router.push(href);
    });
  }, [router]);

  return null;
}

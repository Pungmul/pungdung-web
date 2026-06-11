"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  applyThemePreferenceToDocumentRoot,
  readThemePreferenceFromClientPersistence,
} from "@/shared/lib/theme-preference";

export function ThemePreferenceInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // Cached/static route navigation can desync html data-theme, so re-sync on pathname changes.
    const preference = readThemePreferenceFromClientPersistence();
    applyThemePreferenceToDocumentRoot(preference);
  }, [pathname]);

  return null;
}

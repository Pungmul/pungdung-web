"use client";

import { useCallback, useEffect, useState } from "react";

import {
  applyThemePreferenceToDocumentRoot,
  type EffectiveTheme,
  getDarkModeMediaQuery,
  readThemePreferenceFromClientPersistence,
  resolveEffectiveTheme,
  type ThemePreference,
  writeThemePreferenceToClientPersistence,
} from "@/shared/lib/theme-preference";

export function useThemePreference() {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    const mediaQuery = getDarkModeMediaQuery();
    const nextEffectiveTheme = resolveEffectiveTheme(
      nextPreference,
      mediaQuery?.matches ?? false,
    );

    writeThemePreferenceToClientPersistence(nextPreference);
    applyThemePreferenceToDocumentRoot(nextPreference);
    setPreferenceState(nextPreference);
    setEffectiveTheme(nextEffectiveTheme);
  }, []);

  useEffect(() => {
    const storedPreference = readThemePreferenceFromClientPersistence();
    const mediaQuery = getDarkModeMediaQuery();
    const nextEffectiveTheme = resolveEffectiveTheme(
      storedPreference,
      mediaQuery?.matches ?? false,
    );

    applyThemePreferenceToDocumentRoot(storedPreference);
    setPreferenceState(storedPreference);
    setEffectiveTheme(nextEffectiveTheme);
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }

    const mediaQuery = getDarkModeMediaQuery();

    if (!mediaQuery) {
      return;
    }

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setEffectiveTheme(resolveEffectiveTheme("system", event.matches));
      applyThemePreferenceToDocumentRoot("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [preference]);

  return {
    preference,
    effectiveTheme,
    setPreference,
  };
}

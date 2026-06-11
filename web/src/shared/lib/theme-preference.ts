export type ThemePreference = "light" | "dark" | "system";
export type EffectiveTheme = "light" | "dark";

export const THEME_PREFERENCE_STORAGE_KEY = "theme-preference";
export const THEME_PREFERENCE_COOKIE_NAME = "theme-preference";
export const THEME_PREFERENCE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readThemePreferenceFromDocumentCookie(): ThemePreference | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookiePrefix = `${THEME_PREFERENCE_COOKIE_NAME}=`;
  const cookieEntry = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(cookiePrefix));

  if (!cookieEntry) {
    return null;
  }

  const cookieValue = cookieEntry.slice(cookiePrefix.length);

  if (!isThemePreference(cookieValue)) {
    return null;
  }

  return cookieValue;
}

export function writeThemePreferenceToDocumentCookie(
  preference: ThemePreference,
): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${THEME_PREFERENCE_COOKIE_NAME}=${preference}; path=/; max-age=${THEME_PREFERENCE_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function readThemePreferenceFromStorage(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const stored = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);

    if (!isThemePreference(stored)) {
      return "system";
    }

    return stored;
  } catch {
    return "system";
  }
}

export function writeThemePreferenceToStorage(
  preference: ThemePreference,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
  } catch {
    // localStorage 접근 실패 시에도 UI 동작은 유지한다.
  }
}

export function readThemePreferenceFromClientPersistence(): ThemePreference {
  const cookiePreference = readThemePreferenceFromDocumentCookie();

  if (cookiePreference) {
    return cookiePreference;
  }

  const storagePreference = readThemePreferenceFromStorage();

  if (typeof window !== "undefined") {
    try {
      const storedValue = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
      if (isThemePreference(storedValue)) {
        writeThemePreferenceToDocumentCookie(storedValue);
        return storedValue;
      }
    } catch {
      // localStorage 접근 실패 시에도 초기 테마 계산은 진행한다.
    }
  }

  return storagePreference;
}

export function writeThemePreferenceToClientPersistence(
  preference: ThemePreference,
): void {
  writeThemePreferenceToDocumentCookie(preference);
  writeThemePreferenceToStorage(preference);
}

export function isSystemDarkMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): EffectiveTheme {
  if (preference === "system") {
    return systemDark ? "dark" : "light";
  }

  return preference;
}

export function applyThemePreferenceToDocumentRoot(
  preference: ThemePreference,
): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  if (preference === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute("data-theme", preference);
}

export function getDarkModeMediaQuery(): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.matchMedia(DARK_MODE_MEDIA_QUERY);
}

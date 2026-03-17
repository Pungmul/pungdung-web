import {
  THEME_PREFERENCE_COOKIE_MAX_AGE_SECONDS,
  THEME_PREFERENCE_COOKIE_NAME,
  THEME_PREFERENCE_STORAGE_KEY,
} from "@/shared/lib/theme-preference";

// hydration 전에 테마를 먼저 적용한다.
// 서버 HTML이 쿠키/기본값 기준일 때 localStorage만 가진 사용자에서 첫 페인트 불일치를 줄인다.
const themePreferenceBootScript = `
(() => {
  const KEY = "${THEME_PREFERENCE_STORAGE_KEY}";
  const COOKIE_NAME = "${THEME_PREFERENCE_COOKIE_NAME}";
  const COOKIE_PREFIX = COOKIE_NAME + "=";
  const MAX_AGE = ${THEME_PREFERENCE_COOKIE_MAX_AGE_SECONDS};
  const isValidPreference = (value) => value === "light" || value === "dark" || value === "system";

  const readCookiePreference = () => {
    const cookieEntry = document.cookie
      .split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(COOKIE_PREFIX));

    if (!cookieEntry) {
      return null;
    }

    const cookieValue = cookieEntry.slice(COOKIE_PREFIX.length);
    return isValidPreference(cookieValue) ? cookieValue : null;
  };

  const applyTheme = (preference) => {
    if (preference === "system") {
      document.documentElement.removeAttribute("data-theme");
      return;
    }

    document.documentElement.setAttribute("data-theme", preference);
  };

  try {
    const cookiePreference = readCookiePreference();

    if (cookiePreference) {
      applyTheme(cookiePreference);
      return;
    }

    const storagePreference = window.localStorage.getItem(KEY);

    if (!isValidPreference(storagePreference)) {
      return;
    }

    applyTheme(storagePreference);
    document.cookie = COOKIE_NAME + "=" + storagePreference + "; path=/; max-age=" + MAX_AGE + "; samesite=lax";
  } catch {
    // Ignore storage/cookie access errors to avoid blocking render.
  }
})();
`;

export function ThemePreferenceBootScript() {
  return <script dangerouslySetInnerHTML={{ __html: themePreferenceBootScript }} />;
}

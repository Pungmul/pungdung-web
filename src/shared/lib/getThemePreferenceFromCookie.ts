import { cookies } from "next/headers";

import {
  isThemePreference,
  THEME_PREFERENCE_COOKIE_NAME,
  type ThemePreference,
} from "@/shared/lib/theme-preference";

const FALLBACK_THEME_PREFERENCE: ThemePreference = "system";

export const getThemePreferenceFromCookie = async (): Promise<ThemePreference> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(THEME_PREFERENCE_COOKIE_NAME)?.value;

  if (!cookieValue || !isThemePreference(cookieValue)) {
    return FALLBACK_THEME_PREFERENCE;
  }

  return cookieValue;
};

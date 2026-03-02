import { ViewType } from "@/shared/types";

import { VALID_VIEWS, VIEW_TYPE_COOKIE_NAME } from "./constants";

const isViewType = (value: string): value is ViewType =>
  VALID_VIEWS.includes(value as ViewType);

const VIEW_TYPE_MAX_AGE = 60 * 60 * 24 * 365;

export const resolveCookieView = (): ViewType | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookiePair = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${VIEW_TYPE_COOKIE_NAME}=`));
  if (!cookiePair) {
    return null;
  }

  const rawValue = cookiePair.split("=")[1];
  if (!rawValue) {
    return null;
  }

  const decodedValue = decodeURIComponent(rawValue);
  return isViewType(decodedValue) ? decodedValue : null;
};

export const persistViewCookie = (view: ViewType): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = [
    `${VIEW_TYPE_COOKIE_NAME}=${encodeURIComponent(view)}`,
    "Path=/",
    `Max-Age=${VIEW_TYPE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
};

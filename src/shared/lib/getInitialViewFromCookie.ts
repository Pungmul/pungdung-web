import { cookies } from "next/headers";

import { ViewType } from "../types";

import { VIEW_TYPE_COOKIE_NAME } from "./view/constants";
import { isViewType } from "./view/isViewType";

const FALLBACK_VIEW: ViewType = "mobile";

/** 서버 컴포넌트에서 view-type 쿠키를 읽어 초기 뷰를 반환합니다. */
export const getInitialViewFromCookie = async (): Promise<ViewType> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(VIEW_TYPE_COOKIE_NAME)?.value;

  if (!cookieValue || !isViewType(cookieValue)) {
    return FALLBACK_VIEW;
  }

  return cookieValue;
};

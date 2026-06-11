import { ViewType } from "@/shared/types";

import { VALID_VIEWS } from "./constants";

export const isViewType = (value: string): value is ViewType =>
  VALID_VIEWS.includes(value as ViewType);

import { LIGHTNING_CREATE_FORM_FIELD } from "./lightning-create-form-fields";
import type { LightningCreateFormData } from "../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;

export const LIGHTNING_CREATE_FORM_DEFAULTS: LightningCreateFormData = {
  [FIELDS.TITLE]: "",
  [FIELDS.MIN_PERSONNEL]: 4,
  [FIELDS.MAX_PERSONNEL]: 6,
  [FIELDS.LIGHTNING_TYPE]: "일반 모임",
  [FIELDS.RECRUIT_END_TIME]: "",
  [FIELDS.ADDRESS]: "",
  [FIELDS.DETAIL_ADDRESS]: "",
  [FIELDS.LOCATION_POINT]: null,
  [FIELDS.TARGET]: "전체",
  [FIELDS.TAG_LIST]: [],
};

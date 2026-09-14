import dayjs from "dayjs";

import { resolvePromotionCloseAt } from "./default-promotion-close-at";
import type { PromotionFormDraft } from "../types/promotion-form.types";
import type { PromotionPostingFormValues } from "../types/promotion-posting-form.types";

/** 서버 초안 → RHF 기본값 */
export function mapFormDetailToDefaultValues(
  formData: PromotionFormDraft
): PromotionPostingFormValues {
  const snapshot = formData.snapshot;
  const date = snapshot.startAt
    ? dayjs(snapshot.startAt).format("YYYY-MM-DD")
    : "";

  return {
    title: snapshot.title ?? "",
    address: snapshot.address ?? null,
    date,
    time: snapshot.startAt ? dayjs(snapshot.startAt).format("HH:mm") : "",
    closeAt: date
      ? resolvePromotionCloseAt({
          performanceDate: date,
          closeAt: snapshot.closeAt ?? "",
        })
      : "",
    limitPersonnel: snapshot.limitNum ?? 0,
    isUnlimitedPersonnel: snapshot.limitNum === null,
    poster: snapshot.performanceImageInfoList?.[0] ?? null,
    questions: snapshot.questions ?? [],
    descriptionSeed: snapshot.description ?? "",
  };
}

import dayjs from "dayjs";

import type { PromotionFormSavePayload } from "../types/promotion-form.types";
import type { PromotionPostingFormValues } from "../types/promotion-posting-form.types";

export function buildPromotionSavePayload({
  values,
  expectedVersion,
  descriptionMarkdown,
}: {
  values: PromotionPostingFormValues;
  expectedVersion: number;
  descriptionMarkdown: string;
}): PromotionFormSavePayload {
  const performanceImageIdList = values.poster ? [values.poster.id] : null;

  return {
    expectedVersion,
    snapshot: {
      questions: values.questions,
      title: values.title,
      description: descriptionMarkdown,
      formType: "PERFORMANCE",
      startAt: dayjs(`${values.date}T${values.time}`).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      limitNum: values.isUnlimitedPersonnel ? null : values.limitPersonnel,
      address: values.address,
      performanceImageIdList,
    },
  };
}

import dayjs from "dayjs";

import { resolvePromotionCloseAt } from "./default-promotion-close-at";
import { PROMOTION_DESCRIPTION_EXAMPLE } from "../constants/promotion-description";
import type { PromotionPostingFormValues } from "../types/promotion-posting-form.types";

export type PromotionPublishValidation =
  | { ok: true }
  | { ok: false; field: PromotionPublishField; message: string };

type PromotionPublishField =
  | "title"
  | "address"
  | "startAt"
  | "closeAt"
  | "limitPersonnel"
  | "description"
  | "questions";

// 에디터가 마크다운 기호를 바꿔 저장해도 예시 문구로 인식
const stripMarkdown = (markdown: string) => markdown.replace(/[\s#*\-_>`]/g, "");

const hasPickedAddress = (address: PromotionPostingFormValues["address"]) =>
  address !== null &&
  address.buildingName.trim() !== "" &&
  !(address.latitude === 0 && address.longitude === 0);

const hasValidPersonnel = ({
  isUnlimitedPersonnel,
  limitPersonnel,
}: PromotionPostingFormValues) =>
  isUnlimitedPersonnel ||
  (Number.isInteger(limitPersonnel) && limitPersonnel >= 1);

const isWrittenDescription = (markdown: string) => {
  const text = stripMarkdown(markdown);
  return text !== "" && text !== stripMarkdown(PROMOTION_DESCRIPTION_EXAMPLE);
};

const fail = (
  field: PromotionPublishField,
  message: string
): PromotionPublishValidation => ({ ok: false, field, message });

// 화면 위에서부터 첫 번째 누락 항목만 반환
export function validatePromotionPublish({
  values,
  descriptionMarkdown,
  hasQuestionDraft,
  now = dayjs(),
}: {
  values: PromotionPostingFormValues;
  descriptionMarkdown: string;
  hasQuestionDraft: boolean;
  now?: dayjs.Dayjs;
}): PromotionPublishValidation {
  if (values.title.trim() === "") {
    return fail("title", "공연 제목을 입력해주세요.");
  }
  if (!hasPickedAddress(values.address)) {
    return fail("address", "공연 장소를 선택해주세요.");
  }

  const startAt = dayjs(`${values.date}T${values.time}`);
  if (!values.date || !values.time || !startAt.isValid()) {
    return fail("startAt", "공연 날짜와 시간을 입력해주세요.");
  }
  if (!startAt.isAfter(now)) {
    return fail("startAt", "공연 시간은 현재 이후여야 해요.");
  }

  const closeAt = resolvePromotionCloseAt({
    performanceDate: values.date,
    closeAt: values.closeAt,
    today: now.format("YYYY-MM-DD"),
  });
  if (closeAt === "") {
    return fail("closeAt", "모집 마감일을 정하려면 공연 날짜가 모레 이후여야 해요.");
  }

  if (!hasValidPersonnel(values)) {
    return fail("limitPersonnel", "모집 인원을 1명 이상 입력해주세요.");
  }
  if (!isWrittenDescription(descriptionMarkdown)) {
    return fail("description", "공연 소개를 작성해주세요.");
  }
  if (values.questions.length === 0) {
    return fail(
      "questions",
      hasQuestionDraft
        ? "작성 중인 질문을 완료해주세요."
        : "질문을 1개 이상 추가해주세요."
    );
  }
  return { ok: true };
}

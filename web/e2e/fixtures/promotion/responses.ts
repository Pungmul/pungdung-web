import { okEnvelope } from "../envelope";

export const E2E_PROMOTION_FORM_ID = 901;
export const E2E_PROMOTION_PUBLIC_KEY = "e2e-promotion";
export const E2E_PROMOTION_TITLE = "E2E 풍물 공연";
export const E2E_PROMOTION_QUESTION_ID = 1001;

const now = "2027-12-01T00:00:00.000Z";

export const e2ePromotionAddress = {
  latitude: 37.5665,
  longitude: 126.978,
  buildingName: "시청역",
  detail: "1번 출구",
};

export const e2ePromotionPoster = {
  id: 1,
  imageUrl: "/logos/pungdeong_logo_192.png",
};

export const e2ePromotionListItem = {
  id: E2E_PROMOTION_FORM_ID,
  ownerId: 1,
  title: E2E_PROMOTION_TITLE,
  description: "E2E 공연 소개",
  publicKey: E2E_PROMOTION_PUBLIC_KEY,
  status: "OPEN",
  formType: "PERFORMANCE",
  performanceImageInfoList: [e2ePromotionPoster],
  startAt: "2027-12-31T19:00:00.000Z",
  limitNum: 50,
  address: e2ePromotionAddress,
  createdAt: now,
  updatedAt: now,
};

export const e2ePromotionDetail = {
  performanceId: E2E_PROMOTION_FORM_ID,
  title: E2E_PROMOTION_TITLE,
  description: "E2E 공연 소개",
  limitNum: 50,
  startAt: "2027-12-31T19:00:00.000Z",
  publicKey: E2E_PROMOTION_PUBLIC_KEY,
  performanceImageInfoList: [e2ePromotionPoster],
  address: e2ePromotionAddress,
  joinedFriendList: [
    {
      userId: 77,
      username: "friend@example.com",
      name: "공연 친구",
      clubName: "풍덩대",
      profileImage: {
        id: 2,
        originalFilename: "friend.png",
        convertedFileName: "friend.png",
        fullFilePath: "/logos/pungdeong_logo_192.png",
        fileType: "image/png",
        fileSize: 1,
        createdAt: now,
      },
    },
  ],
  questions: [
    {
      id: E2E_PROMOTION_QUESTION_ID,
      questionType: "TEXT" as const,
      label: "관람 이유",
      required: true,
      orderNo: 1,
      settingsJson: JSON.stringify({
        placeholder: "관람 이유를 입력해주세요.",
        maxLength: 100,
      }),
      options: [],
    },
  ],
};

export const E2E_PROMOTION_RESPONSE_ID = 501;
export const E2E_PROMOTION_DRAFT_ID = 902;

export const promotionListResponse = okEnvelope({
  performanceList: [e2ePromotionListItem],
});

export const promotionDetailResponse = okEnvelope(e2ePromotionDetail);

export const emptyPromotionListResponse = okEnvelope({
  performanceList: [],
});

export const promotionBookingRow = {
  address: e2ePromotionAddress,
  formType: "PERFORMANCE",
  performanceId: E2E_PROMOTION_FORM_ID,
  performanceImageList: [
    {
      id: 1,
      originalFilename: "poster.png",
      convertedFileName: "poster.png",
      fullFilePath: "/logos/pungdeong_logo_192.png",
      fileType: "image/png",
      fileSize: 1,
      createdAt: now,
    },
  ],
  publicKey: E2E_PROMOTION_PUBLIC_KEY,
  startAt: "2027-12-31T19:00:00.000Z",
  title: E2E_PROMOTION_TITLE,
  status: "OPEN",
  responseId: E2E_PROMOTION_RESPONSE_ID,
  updatedAt: now,
  submittedAt: now,
};

export const upcomingPromotionListResponse = okEnvelope([promotionBookingRow]);

export const emptyUpcomingPromotionListResponse = okEnvelope(
  [] as typeof promotionBookingRow[]
);

export const promotionApplicationDetail = {
  responseId: E2E_PROMOTION_RESPONSE_ID,
  formId: E2E_PROMOTION_FORM_ID,
  submitterUsername: "e2e-user",
  submitterNickname: "풍덩이",
  submittedAt: now,
  answerList: [
    {
      questionId: E2E_PROMOTION_QUESTION_ID,
      selectedOptions: [] as { id: number; label: string; orderNo: number }[],
      answerText: "공연을 관람합니다.",
    },
  ],
};

export const promotionApplicationDetailResponse = okEnvelope(
  promotionApplicationDetail
);

export const promotionDraftSnapshot = {
  title: "임시저장 공연",
  description: "초안 소개",
  questions: [
    {
      clientTempId: "q-1",
      questionType: "TEXT" as const,
      label: "관람 이유",
      required: true,
      orderNo: 1,
      settingsJson: JSON.stringify({
        placeholder: "관람 이유를 입력해주세요.",
        maxLength: 100,
      }),
      options: [],
    },
  ],
  formType: "PERFORMANCE",
  startAt: "2027-12-31T19:00:00.000Z",
  limitNum: 50 as number | null,
  address: e2ePromotionAddress,
  performanceImageInfoList: [e2ePromotionPoster],
};

export function promotionDraftResponse(
  limitNum: number | null = 50,
  title = promotionDraftSnapshot.title
) {
  return okEnvelope({
    version: 1,
    snapshotDto: {
      ...promotionDraftSnapshot,
      title,
      limitNum,
    },
  });
}

export const myPromotionDraftListItem = {
  ...e2ePromotionListItem,
  id: E2E_PROMOTION_DRAFT_ID,
  title: "임시저장 공연",
  publicKey: null as string | null,
  status: "DRAFT",
};

export const myPromotionOpenListItem = {
  ...e2ePromotionListItem,
  status: "OPEN",
};

export const myPromotionFormListResponse = okEnvelope({
  formList: [myPromotionDraftListItem, myPromotionOpenListItem],
});

export const createPromotionResponse = okEnvelope({
  formId: E2E_PROMOTION_DRAFT_ID,
});

export const savePromotionAckResponse = okEnvelope({
  formId: E2E_PROMOTION_DRAFT_ID,
  version: 2,
  autosavedAt: now,
});

export const publishPromotionResponse = okEnvelope({
  formId: E2E_PROMOTION_DRAFT_ID,
  publicKey: E2E_PROMOTION_PUBLIC_KEY,
  publicUrl: `/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}`,
});

export const uploadPromotionPosterResponse = okEnvelope({
  performanceImageList: [
    {
      id: 11,
      imageUrl: "/logos/pungdeong_logo_192.png",
      originalFileName: "poster.png",
    },
  ],
});

export const promotionManageResponses = okEnvelope([
  promotionApplicationDetail,
]);

import { queryOptions } from "@tanstack/react-query";

import {
  fetchMyPromotionFormList,
  fetchPromotionDetail,
  fetchPromotionFormDraft,
  fetchPromotionFormResponses,
  fetchPromotionList,
  fetchPromotionResponseDetail,
  fetchUpcomingPerformanceList,
} from "../api/client";

export const promotionQueries = {
  all: () => ["promotion"] as const,

  list: () =>
    queryOptions({
      queryKey: ["promotionList"] as const,
      queryFn: fetchPromotionList,
      staleTime: 0,
      gcTime: 2000,
    }),

  myFormList: () =>
    queryOptions({
      queryKey: ["myPromotionFormList"] as const,
      queryFn: fetchMyPromotionFormList,
      staleTime: 0,
      gcTime: 2000,
    }),

  detail: (publicId: string) =>
    queryOptions({
      queryKey: ["promotionDetail", publicId] as const,
      queryFn: () => fetchPromotionDetail(publicId),
    }),

  responseDetail: (responseId: string) =>
    queryOptions({
      queryKey: ["promotionResponseDetail", responseId] as const,
      queryFn: () => fetchPromotionResponseDetail(responseId),
    }),

  upcomingList: () =>
    queryOptions({
      queryKey: ["upcomingPerformanceList"] as const,
      queryFn: fetchUpcomingPerformanceList,
    }),

  formDraft: (formId: string) =>
    queryOptions({
      queryKey: ["promotion", "formDraft", formId] as const,
      queryFn: () => fetchPromotionFormDraft(Number(formId)),
    }),

  formResponses: (formId: string) =>
    queryOptions({
      queryKey: ["promotion", "formResponses", formId] as const,
      queryFn: () => fetchPromotionFormResponses(Number(formId)),
    }),
};

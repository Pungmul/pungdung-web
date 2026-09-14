import type { User } from "@/features/user";

import type { Address } from "@/shared/types";

import type { PromotionPublishedQuestion } from "./promotion-question.types";

export interface PromotionPoster {
  id: number;
  imageUrl: string;
}

export type PromotionJoinedFriend = User;

export interface PromotionDetail {
  performanceId: number;
  title: string;
  description: string;
  limitNum: number | null;
  startAt: string;
  closeAt: string | null;
  status: string;
  publicKey: string;
  performanceImageInfoList: PromotionPoster[];
  address: Address | null;
  questions: PromotionPublishedQuestion[];
  joinedFriendList: PromotionJoinedFriend[];
}

export interface Promotion {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  publicKey: string;
  status: string;
  formType: string;
  performanceImageInfoList: PromotionPoster[] | null;
  startAt: string | null;
  limitNum: number | null;
  address: Address | null;
  createdAt: string;
  updatedAt: string;
}

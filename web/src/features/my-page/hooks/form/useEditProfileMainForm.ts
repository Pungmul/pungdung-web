"use client";

import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { ClubInfo } from "@/features/club";
import { mapGroupNameToClubId } from "@/features/club";

import { formatPhoneNumber } from "@/features/auth/lib";
import type { EditProfileFormValues, MyPageInfo } from "@/features/my-page/types";
import { createEditProfileSchema } from "@/features/my-page/types";

/**
 * 마이페이지 정보·동아리 목록이 이미 준비된 뒤에만 호출한다.
 * 호출부는 `Suspense` 안에서 `useSuspenseQuery(myPageQueries.info())`,
 * `useSuspenseQuery(clubQueries.list())`처럼 선언적 queryOptions로 데이터를 받는다.
 */
export const useEditProfileMainForm = (
  userData: MyPageInfo,
  clubList: ClubInfo[],
) => {
  const schema = useMemo(() => {
    const clubIds = clubList.map((club) => club.clubId);
    return createEditProfileSchema(clubIds);
  }, [clubList]);

  const defaultValues = useMemo(
    () => ({
      profileImage: userData.profile.fullFilePath ?? undefined,
      name: userData.name,
      club: mapGroupNameToClubId(userData.groupName, clubList),
      clubAge: userData.clubAge?.toString() ?? "",
      nickname: userData.clubName,
      tellNumber: formatPhoneNumber(userData.phoneNumber ?? ""),
    }),
    [userData, clubList],
  );

  return useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });
};

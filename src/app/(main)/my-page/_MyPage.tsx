"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Suspense } from "@suspensive/react";

import { Space } from "@/shared";

import {
  MyPageAccountSection,
  MyPageAccountSectionSkeleton,
} from "../../../features/my-page/components/section/MyPageAccountSection";
import { MyInvitationCodeMenuItem } from "../../../features/my-page/components/section/MyInvitationCodeMenuItem";
import { MyPageFriendsSection } from "../../../features/my-page/components/section/MyPageFriendsSection";
import { ProfileSection, ProfileSectionSkeleton } from "../../../features/my-page/components/section/ProfileSection";

import { myPageQueries } from "@/features/my-page/queries";

export function MyPageClient() {
  return (
    <Suspense clientOnly fallback={<MyPageClientSkeleton />}>
      <MyPageClientContent />
    </Suspense>
  );
}

function MyPageClientContent() {
  // 프로필/계정 섹션에서 공통으로 쓰는 회원 정보를 상위에서 1회 조회한다.
  const { data: userInfo } = useSuspenseQuery(myPageQueries.info());

  return (
    <div className="px-8 py-6 flex-grow flex flex-col w-full bg-background">
      <ProfileSection
        profileImageSrc={userInfo?.profile.fullFilePath}
        name={userInfo?.name}
        clubName={userInfo?.clubName}
        groupName={userInfo?.groupName}
        clubAge={userInfo?.clubAge}
      />

      <Space h={32} />

      <section className="flex flex-col ">
        <h3 className="text-grey-800 font-semibold text-[18px]">계정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none relative w-full">
          <li>
            <MyPageFriendsSection />
          </li>

          <li>
            <MyPageAccountSection email={userInfo?.email} />
          </li>
          <li>
            <Link
              href="/my-page/change-password"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              비밀번호 변경
            </Link>
          </li>
          <li>
            <Link
              href="/my-page/login-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              로그인 설정
            </Link>
          </li>
          <li>
            <MyInvitationCodeMenuItem />
          </li>
        </ul>
      </section>

      <Space h={32} />

      <section>
        <h3 className="text-grey-700 font-semibold text-[18px]">내 설정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none">
          <li>
            <Link
              href="/my-page/dark-mode-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              다크 모드
            </Link>
          </li>
          <li>
            <Link
              href="/my-page/notification-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              알림 설정
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function MyPageClientSkeleton() {
  return (
    <div className="px-8 py-6 flex-grow flex flex-col w-full bg-background">
      <ProfileSectionSkeleton />

      <Space h={32} />

      <section className="flex flex-col ">
        <h3 className="text-grey-800 font-semibold text-[18px]">계정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none relative w-full">
          <li>
            <MyPageFriendsSection />
          </li>
          <li>
            <MyPageAccountSectionSkeleton />
          </li>
        </ul>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";

import { ErrorBoundary, Suspense } from "@suspensive/react";

import { authQueries, canChangePassword } from "@/features/auth";
import type { MyPageInfo } from "@/features/my-page";
import {
  MyInvitationCodeMenuItem,
  MyPageAccountSection,
  MyPageAccountSectionSkeleton,
  MyPageFriendsSection,
  ProfileSection,
  ProfileSectionSkeleton,
} from "@/features/my-page";

import { SkeletonView, Space } from "@/shared";

import { myPageQueries } from "@/features/my-page/queries";

export function MyPageClient() {
  return (
    <Suspense clientOnly fallback={<MyPageClientSkeleton />}>
      <QueryErrorResetBoundary>
        {({ reset: resetQueries }) => (
          <ErrorBoundary
            onReset={resetQueries}
            fallback={() => (
              <Suspense clientOnly fallback={<MyPageClientSkeleton />}>
                <MyPageClientWithoutPasswordMenu />
              </Suspense>
            )}
          >
            <MyPageClientContent />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}

function MyPageClientContent() {
  const [{ data: userInfo }, { data: passwordInfo }] = useSuspenseQueries({
    queries: [myPageQueries.info(), authQueries.passwordInfo()],
  });

  return (
    <MyPageLayout
      userInfo={userInfo}
      showChangePasswordMenu={canChangePassword(passwordInfo)}
    />
  );
}

function MyPageClientWithoutPasswordMenu() {
  const { data: userInfo } = useSuspenseQuery(myPageQueries.info());

  return <MyPageLayout userInfo={userInfo} showChangePasswordMenu={false} />;
}

type MyPageLayoutProps = {
  userInfo: MyPageInfo;
  showChangePasswordMenu: boolean;
};

function MyPageLayout({
  userInfo,
  showChangePasswordMenu,
}: MyPageLayoutProps) {
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
          {showChangePasswordMenu ? (
            <li>
              <Link
                href="/my-page/change-password"
                className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
              >
                비밀번호 변경
              </Link>
            </li>
          ) : null}
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
          <li aria-hidden className="p-[8px]">
            <SkeletonView className="h-[16px] w-[88px] rounded" />
          </li>
        </ul>
      </section>
    </div>
  );
}

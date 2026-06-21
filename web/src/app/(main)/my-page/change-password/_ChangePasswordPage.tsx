"use client";

import { notFound } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import type { ReactNode } from "react";

import {
  authQueries,
  canChangePassword,
  ChangePasswordForm,
  getChangePasswordDescription,
  getChangePasswordIntro,
  requiresCurrentPassword,
  useChangePasswordAction,
  useChangePasswordForm,
} from "@/features/auth";

import { Header, SkeletonView, Space } from "@/shared";

type ChangePasswordPageLayoutProps = {
  introLine?: ReactNode;
  descriptionLine?: ReactNode;
  children: ReactNode;
};

export function ChangePasswordPageLayout({
  introLine,
  descriptionLine,
  children,
}: ChangePasswordPageLayoutProps) {
  return (
    <div className="bg-grey-100 h-full w-full">
      <main className="max-w-[640px] mx-auto w-full h-full flex flex-col items-center bg-background">
        <Header title="비밀번호 변경" />
        <Space h={36} />
        <div className="w-full px-[36px]">
          <div className="p-[16px] bg-grey-200 rounded-[10px]">
            <p className="text-sm font-normal text-grey-600">
              {introLine ?? (
                <SkeletonView className="h-[20px] w-[220px] max-w-full rounded" />
              )}
            </p>
            <p className="text-sm font-normal text-grey-600">
              {descriptionLine ?? (
                <SkeletonView className="mt-1 h-[20px] w-[280px] max-w-full rounded" />
              )}
            </p>
          </div>
        </div>
        <Space h={24} />

        <div className="w-full max-w-[640px] mx-auto px-[12px] md:px-[20px] flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
}

type ChangePasswordFormSkeletonProps = {
  fieldCount?: number;
};

export function ChangePasswordFormSkeleton({
  fieldCount = 3,
}: ChangePasswordFormSkeletonProps) {
  return (
    <div className="flex h-full w-full flex-col px-[24px]">
      <div className="flex flex-grow flex-col gap-4">
        {Array.from({ length: fieldCount }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <SkeletonView className="h-[16px] w-[72px] rounded" />
            <SkeletonView className="h-[48px] w-full rounded-md" />
          </div>
        ))}
      </div>
      <SkeletonView className="h-[56px] w-full rounded-md" />
    </div>
  );
}

export function ChangePasswordPage() {
  const { data: passwordInfo } = useSuspenseQuery(authQueries.passwordInfo());
  const needsCurrentPassword = requiresCurrentPassword(passwordInfo);
  const changePasswordForm = useChangePasswordForm({
    requiresCurrentPassword: needsCurrentPassword,
  });
  const changePasswordAction = useChangePasswordAction();

  if (!canChangePassword(passwordInfo)) {
    notFound();
  }

  return (
    <ChangePasswordPageLayout
      introLine={getChangePasswordIntro(passwordInfo)}
      descriptionLine={getChangePasswordDescription(passwordInfo)}
    >
      <ChangePasswordForm
        {...changePasswordForm}
        requiresCurrentPassword={needsCurrentPassword}
        onSubmit={changePasswordAction.onSubmit}
        isPending={changePasswordAction.isPending}
        requestError={changePasswordAction.requestError}
      />
    </ChangePasswordPageLayout>
  );
}

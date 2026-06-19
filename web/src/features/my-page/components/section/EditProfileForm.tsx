"use client";

import Image from "next/image";

import { useSuspenseQueries } from "@tanstack/react-query";
import { Controller, useWatch } from "react-hook-form";

import { CameraIcon } from "@heroicons/react/24/outline";

import {
  clubQueries,
  mapGroupNameToClubId,
  useClubOptions,
} from "@/features/club";

import {
  BottomFixedButton,
  Input,
  Select,
  Space,
  Spinner,
} from "@/shared";
import { WarningCircleIcon } from "@/shared/components/Icons";

import { formatPhoneNumber } from "@/features/auth/lib";
import { useEditProfileSubmit } from "@/features/my-page/hooks/actions";
import { useEditProfileMainForm } from "@/features/my-page/hooks/form";
import { useEditProfileImage } from "@/features/my-page/hooks/state";
import { getEditProfileSubmitUiState } from "@/features/my-page/lib/get-edit-profile-submit-ui-state";
import {
  formatProfileChangeLockedAt,
  resolveProfileChangeLocks,
} from "@/features/my-page/lib/profile-change-lock";
import { myPageQueries } from "@/features/my-page/queries";

function ChangeLockNotice({
  fieldLabel,
  changedAt,
}: {
  fieldLabel: string;
  changedAt: string | null;
}) {
  const formattedDate = formatProfileChangeLockedAt(changedAt);

  if (!formattedDate) {
    return null;
  }

  return (
    <div className="mt-[4px] flex items-start gap-[4px]">
      <span className="flex size-4 p-[1px] shrink-0 items-center justify-center">
        <WarningCircleIcon className="size-full text-grey-400" />
      </span>
      <p className="text-[12px] text-grey-400 max-[430px]:whitespace-pre-line">
        {`${fieldLabel}는 6개월에 한 번 변경 가능 합니다. \n(마지막 수정 ${formattedDate})`}
      </p>
    </div>
  );
}

export function EditProfileForm() {
  const [{ data: userData }, { data: clubList }, { data: changeInfo }] =
    useSuspenseQueries({
      queries: [
        myPageQueries.info(),
        clubQueries.list(),
        myPageQueries.changeInfo(),
      ],
    });
  const clubOptions = useClubOptions(clubList);
  const currentClubId = mapGroupNameToClubId(userData.groupName, clubList) ?? null;
  const { isClubLocked, isClubNameLocked } =
    resolveProfileChangeLocks(changeInfo);

  const form = useEditProfileMainForm(userData, clubList);
  const { changedProfileImageFile, handleProfileImageChange } =
    useEditProfileImage(form);

  const { handleSubmitEditProfile, isPending } = useEditProfileSubmit({
    form,
    changedProfileImageFile,
    serverClubAgeFallback: userData.clubAge ?? 0,
    lockedClubNameFallback: userData.clubName ?? "",
    lockedClubIdFallback: currentClubId,
    isClubNameLocked,
    isClubLocked,
  });

  const {
    register,
    control,
    formState: { errors: formErrors, isDirty, isValid },
  } = form;

  const profileImageSrc = useWatch({
    control: form.control,
    name: "profileImage",
  });

  const submitUiState = getEditProfileSubmitUiState({
    isPending,
    isFormDirty: isDirty,
    isFormValid: isValid,
    hasProfileImageChange: changedProfileImageFile !== null,
  });

  return (
    <form
      className="flex flex-col flex-grow md:px-[24px]"
      onSubmit={handleSubmitEditProfile}
    >
      <div className="mx-auto relative">
        <label
          htmlFor="profile-image"
          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-grey-800 flex items-center justify-center z-10 cursor-pointer"
        >
          <span className="flex size-6 items-center justify-center">
            <CameraIcon className="size-full text-background" />
          </span>
          <input
            type="file"
            className="hidden"
            id="profile-image"
            name="profile-image"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </label>
        <div className="w-36 aspect-[1] rounded-md border-grey-300 bg-grey-200 border-2 overflow-hidden">
          <div className="relative w-full h-full bg-grey-200">
            {!!profileImageSrc && (
              <Image
                src={profileImageSrc}
                alt="profile"
                fill
                className="object-cover object-center rounded-sm"
              />
            )}
          </div>
        </div>
      </div>
      <Space h={32} />
      <div className="flex flex-col gap-[24px] flex-grow px-[24px]">
        <Input label="이름" {...register("name")} disabled={true} />
        <div>
          <Input
            label="패명"
            {...register("nickname")}
            disabled={isClubNameLocked}
            errorMessage={formErrors.nickname?.message || ""}
          />
          {isClubNameLocked && (
            <ChangeLockNotice
              fieldLabel="패명"
              changedAt={changeInfo.clubNameChangedAt}
            />
          )}
        </div>
        <div>
          <Controller
            control={control}
            name="club"
            render={({ field }) => (
              <Select
                hasSearch={true}
                label="동아리"
                name="club"
                value={field.value}
                disabled={isClubLocked}
                onChange={(value) => {
                  field.onChange(value);
                }}
                errorMessage={formErrors.club?.message || ""}
              >
                {clubOptions.map((option) => (
                  <Select.Option key={option.label} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
          {isClubLocked && (
            <ChangeLockNotice
              fieldLabel="동아리"
              changedAt={changeInfo.clubIdChangedAt}
            />
          )}
        </div>
        <Input
          label="학번"
          {...register("clubAge")}
          type="number"
          errorMessage={formErrors.clubAge?.message || ""}
        />
        <Controller
          control={control}
          name="tellNumber"
          render={({ field }) => (
            <Input
              label="전화번호"
              errorMessage={formErrors.tellNumber?.message || ""}
              placeholder="전화번호를 입력해주세요."
              className="w-full"
              type="tel"
              {...field}
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />
      </div>
      <BottomFixedButton
        type="submit"
        disabled={submitUiState.disabled}
        className="bg-primary text-background"
      >
        {submitUiState.showSpinner ? <Spinner /> : submitUiState.label}
      </BottomFixedButton>
    </form>
  );
}

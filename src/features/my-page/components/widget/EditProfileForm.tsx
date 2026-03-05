"use client";

import Image from "next/image";

import { Controller } from "react-hook-form";

import { CameraIcon } from "@heroicons/react/24/outline";

import {
  BottomFixedButton,
  Input,
  Select,
  Space,
  Spinner,
} from "@/shared";

import { formatPhoneNumber } from "@/features/auth/lib";
import { useClubOptions } from "@/features/club/hooks";
import { useClubList } from "@/features/club/queries";
import {
  useEditProfileImage,
  useEditProfileMainForm,
  useEditProfilePasswordForm,
  useEditProfileSchema,
  useEditProfileSubmit,
} from "@/features/my-page/hooks";
import { useSuspenseGetMyPageInfo } from "@/features/my-page/queries";

export default function EditProfileForm() {
  const { data: userData } = useSuspenseGetMyPageInfo();
  const { data: clubList } = useClubList();
  const clubOptions = useClubOptions();

  const schema = useEditProfileSchema(clubList);
  const form = useEditProfileMainForm(schema, userData, clubList);
  const passwordForm = useEditProfilePasswordForm();
  const { changedProfileImageFile, handleProfileImageChange } =
    useEditProfileImage(form);
  const { handleSubmitEditProfile, isPending } = useEditProfileSubmit({
    form,
    passwordForm,
    changedProfileImageFile,
  });

  const {
    register,
    control,
    watch,
    formState: { errors: formErrors },
  } = form;

  const {
    register: registerPassword,
    formState: {
      errors: passwordErrors,
      isDirty: passwordIsDirty,
      isValid: passwordIsValid,
    },
  } = passwordForm;

  return (
    <form
      className="flex flex-col px-[32px] flex-grow"
      onSubmit={handleSubmitEditProfile}
    >
      <div className="mx-auto relative">
        <label
          htmlFor="profile-image"
          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-grey-800 flex items-center justify-center z-10 cursor-pointer"
        >
          <CameraIcon className="size-6 text-background" />
          <input
            type="file"
            className="hidden"
            id="profile-image"
            name="profile-image"
            accept="image/*"
            size={1024 * 1024 * 2}
            onChange={handleProfileImageChange}
          />
        </label>
        <div className="w-36 aspect-[1] rounded-md border-grey-300 bg-grey-200 border-2 overflow-hidden">
          <div className="relative w-full h-full bg-grey-200">
            {!!watch("profileImage") && (
              <Image
                src={watch("profileImage")!}
                alt="profile"
                fill
                className="object-cover object-center rounded-sm"
              />
            )}
          </div>
        </div>
      </div>
      <Space h={32} />
      <div className="flex flex-col gap-[24px] md:px-[32px] flex-grow">
        <Input label="이름" {...register("name")} disabled={true} />
        <Input
          label="패명"
          {...register("nickname")}
          errorMessage={formErrors.nickname?.message || ""}
        />
        <Controller
          control={control}
          name="club"
          render={({ field }) => (
            <Select
              hasSearch={true}
              label="동아리"
              name="club"
              value={field.value}
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
        <Input
          label="현재 비밀번호"
          type="password"
          {...registerPassword("oldPassword")}
          errorMessage={passwordErrors.oldPassword?.message || ""}
          placeholder="현재 비밀번호를 입력해주세요."
          required
        />
      </div>
      <BottomFixedButton
        type="submit"
        disabled={isPending || !passwordIsDirty || !passwordIsValid}
        className="bg-primary text-background"
      >
        {isPending ? (
          <Spinner />
        ) : !passwordIsValid ? (
          "비밀번호를 입력해주세요"
        ) : (
          "프로필 수정"
        )}
      </BottomFixedButton>
    </form>
  );
}

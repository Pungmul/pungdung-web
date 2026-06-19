import type {
  EditPageRequestForm,
  EditProfileFormValues,
} from "@/features/my-page/types";

type TransformEditProfileOptions = {
  serverClubAgeFallback: number;
  lockedClubNameFallback: string;
  lockedClubIdFallback: number | null;
  isClubNameLocked: boolean;
  isClubLocked: boolean;
};

function resolveClubAge(
  raw: string | undefined,
  serverClubAgeFallback: number,
): number {
  const trimmed = raw?.trim() ?? "";
  if (trimmed === "") {
    return serverClubAgeFallback;
  }
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : serverClubAgeFallback;
}

function resolveClubName(raw: string | undefined): string | null {
  const trimmed = raw?.trim() ?? "";
  return trimmed === "" ? null : trimmed;
}

export const transformEditProfileData = (
  formData: EditProfileFormValues,
  options: TransformEditProfileOptions,
): EditPageRequestForm => {
  return {
    clubName: resolveClubName(
      options.isClubNameLocked
        ? options.lockedClubNameFallback
        : formData.nickname
    ),
    clubId: options.isClubLocked
      ? options.lockedClubIdFallback
      : formData.club === undefined
        ? null
        : formData.club,
    phoneNumber: formData.tellNumber?.replace(/-/g, "") ?? "",
    clubAge: resolveClubAge(formData.clubAge, options.serverClubAgeFallback),
  };
};

import type {
  EditPageRequestForm,
  EditProfileFormValues,
} from "@/features/my-page/types";

type TransformEditProfileOptions = {
  serverClubAgeFallback: number;
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

export const transformEditProfileData = (
  formData: EditProfileFormValues,
  options: TransformEditProfileOptions,
): EditPageRequestForm => {
  return {
    clubName: formData.nickname || "",
    clubId: formData.club === undefined ? null : formData.club,
    phoneNumber: formData.tellNumber?.replace(/-/g, "") ?? "",
    clubAge: resolveClubAge(formData.clubAge, options.serverClubAgeFallback),
  };
};

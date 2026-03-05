import { EditPageRequestForm, EditProfileFormValues } from "@/features/my-page";

export const transformEditProfileData = (
  formData: EditProfileFormValues
): EditPageRequestForm => {
  return {
    clubName: formData.nickname || "",
    clubId: formData.club === undefined ? null : formData.club,
    phoneNumber: formData.tellNumber?.replace(/-/g, "") ?? "",
    clubAge: parseInt(formData.clubAge ?? ""),
  };
};

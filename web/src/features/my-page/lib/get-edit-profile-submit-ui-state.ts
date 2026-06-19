/**
 * 수정 버튼의 비활성/문구 정책을 컴포넌트 렌더링에서 분리한다.
 */
type GetEditProfileSubmitUiStateInput = {
  isPending: boolean;
  isFormDirty: boolean;
  isFormValid: boolean;
  hasProfileImageChange: boolean;
};

type EditProfileSubmitUiState = {
  disabled: boolean;
  showSpinner: boolean;
  label: string;
};

export function getEditProfileSubmitUiState({
  isPending,
  isFormDirty,
  isFormValid,
  hasProfileImageChange,
}: GetEditProfileSubmitUiStateInput): EditProfileSubmitUiState {
  const hasChanges = isFormDirty || hasProfileImageChange;
  const disabled = isPending || !hasChanges || !isFormValid;

  if (isPending) {
    return { disabled, showSpinner: true, label: "프로필 수정" };
  }

  if (!isFormValid) {
    return { disabled, showSpinner: false, label: "입력값을 확인해주세요" };
  }

  return { disabled, showSpinner: false, label: "프로필 수정" };
}

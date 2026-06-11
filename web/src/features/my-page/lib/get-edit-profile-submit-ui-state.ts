/**
 * 수정 버튼의 비활성/문구 정책을 컴포넌트 렌더링에서 분리한다.
 */
type GetEditProfileSubmitUiStateInput = {
  isPending: boolean;
  passwordIsDirty: boolean;
  passwordIsValid: boolean;
};

type EditProfileSubmitUiState = {
  disabled: boolean;
  showSpinner: boolean;
  label: string;
};

export function getEditProfileSubmitUiState({
  isPending,
  passwordIsDirty,
  passwordIsValid,
}: GetEditProfileSubmitUiStateInput): EditProfileSubmitUiState {
  const disabled = isPending || !passwordIsDirty || !passwordIsValid;

  if (isPending) {
    return { disabled, showSpinner: true, label: "프로필 수정" };
  }

  if (!passwordIsValid) {
    return { disabled, showSpinner: false, label: "비밀번호를 입력해주세요" };
  }

  return { disabled, showSpinner: false, label: "프로필 수정" };
}

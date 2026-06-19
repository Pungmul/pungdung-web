import { describe, expect, it } from "vitest";

import { getEditProfileSubmitUiState } from "./get-edit-profile-submit-ui-state";

describe("getEditProfileSubmitUiState", () => {
  it("변경 사항이 없으면 비활성화한다", () => {
    const result = getEditProfileSubmitUiState({
      isPending: false,
      isFormDirty: false,
      isFormValid: true,
      hasProfileImageChange: false,
    });

    expect(result.disabled).toBe(true);
    expect(result.label).toBe("프로필 수정");
  });

  it("폼이 수정됐으면 활성화한다", () => {
    const result = getEditProfileSubmitUiState({
      isPending: false,
      isFormDirty: true,
      isFormValid: true,
      hasProfileImageChange: false,
    });

    expect(result.disabled).toBe(false);
  });

  it("프로필 이미지만 바뀌어도 활성화한다", () => {
    const result = getEditProfileSubmitUiState({
      isPending: false,
      isFormDirty: false,
      isFormValid: true,
      hasProfileImageChange: true,
    });

    expect(result.disabled).toBe(false);
  });

  it("유효하지 않은 입력이면 비활성화하고 안내 문구를 보여준다", () => {
    const result = getEditProfileSubmitUiState({
      isPending: false,
      isFormDirty: true,
      isFormValid: false,
      hasProfileImageChange: false,
    });

    expect(result.disabled).toBe(true);
    expect(result.label).toBe("입력값을 확인해주세요");
  });
});

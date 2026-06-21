import { AUTH_UI_MESSAGE } from "../constants";

import type { PasswordChangeInfoDto } from "../api/client/dto.schema";

export function canChangePassword(info: PasswordChangeInfoDto): boolean {
  return !info.kakaoSignup;
}

export function requiresCurrentPassword(info: PasswordChangeInfoDto): boolean {
  return !info.firstPasswordChange;
}

export function getChangePasswordDescription(
  info: PasswordChangeInfoDto
): string {
  if (info.firstPasswordChange) {
    return AUTH_UI_MESSAGE.CHANGE_PASSWORD.PAGE.DESCRIPTION_FIRST;
  }

  return AUTH_UI_MESSAGE.CHANGE_PASSWORD.PAGE.DESCRIPTION_CHANGE;
}

export function getChangePasswordIntro(info: PasswordChangeInfoDto): string {
  if (info.firstPasswordChange) {
    return AUTH_UI_MESSAGE.CHANGE_PASSWORD.PAGE.INTRO_FIRST;
  }

  return AUTH_UI_MESSAGE.CHANGE_PASSWORD.PAGE.INTRO_CHANGE;
}

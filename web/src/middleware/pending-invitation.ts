const INVITATION_CODE_PATTERN = /^\d{6}$/;

export const PENDING_INVITATION_COOKIE = "pendingInvitation";

export const PENDING_INVITATION_MAX_AGE = 60 * 30;

export function readPendingInvitationCode(value: string | undefined): string {
  if (value && INVITATION_CODE_PATTERN.test(value)) {
    return value;
  }

  return "";
}

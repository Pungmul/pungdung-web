import { ClientApiError } from "@/core/api/client/client-api-error";

export function isSectionAuthError(error: unknown): boolean {
  if (error instanceof ClientApiError) {
    return error.status === 401 || error.status === 403;
  }
  return error instanceof Error && error.name === "AuthError";
}

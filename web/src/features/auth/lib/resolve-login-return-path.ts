const DEFAULT_RETURN_PATH = "/home";

export function resolveLoginReturnPath(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return DEFAULT_RETURN_PATH;
  }

  return value;
}

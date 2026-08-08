// Sentry 전송용 복제
// 원본 name/메시지는 앱 분류와 UI에 그대로 둠
export function createSentryCaptureError(
  error: unknown,
  name: string
): Error {
  if (error instanceof Error) {
    const captured = new Error(error.message);
    captured.name = name;
    captured.stack = error.stack;
    return captured;
  }
  const captured = new Error("분류되지 않은 앱 오류");
  captured.name = name;
  return captured;
}

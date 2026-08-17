type ApiEnvelope<T> = {
  code: string;
  message: string;
  response: T;
  isSuccess: boolean;
};

export function okEnvelope<T>(response: T): ApiEnvelope<T> {
  return {
    code: "SUCCESS",
    message: "ok",
    response,
    isSuccess: true,
  };
}

export function failEnvelope(message: string, code = "FAIL"): ApiEnvelope<null> {
  return {
    code,
    message,
    response: null,
    isSuccess: false,
  };
}

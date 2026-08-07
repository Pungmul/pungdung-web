import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    const { initSentry } = await import("./core/config/sentry");
    initSentry();
  }
}

export const onRequestError = Sentry.captureRequestError;

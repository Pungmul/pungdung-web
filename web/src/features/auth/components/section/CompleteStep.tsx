"use client";

import { Spinner } from "@/shared";

import { AUTH_DOMAIN_MESSAGE } from "../../constants";

export interface CompleteStepProps {
  isPending: boolean;
  error: Error | null;
  onRetry: () => void;
  onBackToInput?: () => void;
  onNavigateToLogin: () => void;
}

export const CompleteStep = ({
  isPending,
  error,
  onRetry,
  onBackToInput,
  onNavigateToLogin,
}: CompleteStepProps) => {
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow">
        <div className="text-center flex flex-col items-center justify-center space-y-8">
          <Spinner size={64} />
          <h2 className="text-2xl font-bold text-grey-800">
            {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.PENDING_TITLE}
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 flex-grow">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-grey-800 mb-2">
            {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.FAILURE_TITLE}
          </h2>
          <p className="text-grey-600 mb-4">
            {error.message || AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.GENERIC_ERROR}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBackToInput && (
            <button
              type="button"
              onClick={onBackToInput}
              className="px-6 py-2 border border-grey-300 text-grey-700 rounded-lg hover:bg-grey-100 transition-colors"
            >
              {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.BACK_TO_EDIT}
            </button>
          )}
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-2 bg-grey-800 text-background rounded-lg hover:bg-grey-700 transition-colors"
          >
            {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.RETRY}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 flex-grow">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-background"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-grey-800 mb-2">
          {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.SUCCESS_TITLE}
        </h2>
        <p className="text-grey-600 mb-4">
          {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.SUCCESS_SUBTITLE}
        </p>
      </div>

      <button
        type="button"
        onClick={onNavigateToLogin}
        className="px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary-light transition-colors"
      >
        {AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.GO_TO_LOGIN}
      </button>
    </div>
  );
};

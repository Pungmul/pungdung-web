"use client";
import { Button, Input, Space } from "@/shared/components";

import { AUTH_UI_MESSAGE, SIGN_UP_FORM_FIELD } from "../../constants";
import { useAccountStepForm, usePasswordVisibility } from "../../hooks/form";
import type { AccountFormData } from "../../types/schemas/email-sign-up.schema";

const ACCOUNT_FIELDS = SIGN_UP_FORM_FIELD.ACCOUNT;
const ACCOUNT_FIELDS_LABEL = AUTH_UI_MESSAGE.ACCOUNT_STEP;

interface AccountStepProps {
  onSubmit: ({ email, password, confirmPassword }: AccountFormData) => void;
  onPrevStep: () => void;
}

export const AccountStep: React.FC<AccountStepProps> = ({
  onSubmit,
  onPrevStep,
}) => {
  const {
    register,
    inputErrors,
    canSubmit,
    submitAccountStep,
    emailRegisterOptions,
    passwordRegisterOptions,
  } = useAccountStepForm();

  const password = usePasswordVisibility();
  const confirmPassword = usePasswordVisibility();

  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={(event) => {
        event.preventDefault();
        void submitAccountStep(onSubmit);
      }}
    >
      <div className="flex-grow px-6">
        <Space h={24} />
        <Input
          label={ACCOUNT_FIELDS_LABEL.EMAIL_LABEL}
          placeholder={ACCOUNT_FIELDS_LABEL.EMAIL_PLACEHOLDER}
          {...register(ACCOUNT_FIELDS.EMAIL, emailRegisterOptions)}
          errorMessage={inputErrors.email?.message || ""}
        />

        <Space h={24} />
        <Input
          label={ACCOUNT_FIELDS_LABEL.PASSWORD_LABEL}
          placeholder={ACCOUNT_FIELDS_LABEL.PASSWORD_PLACEHOLDER}
          type={password.type}
          trailingComponent={password.trailingComponent}
          {...register(ACCOUNT_FIELDS.PASSWORD, passwordRegisterOptions)}
          errorMessage={inputErrors.password?.message || ""}
        />

        <Space h={24} />
        <Input
          label={ACCOUNT_FIELDS_LABEL.CONFIRM_PASSWORD_LABEL}
          placeholder={ACCOUNT_FIELDS_LABEL.CONFIRM_PASSWORD_PLACEHOLDER}
          type={confirmPassword.type}
          trailingComponent={confirmPassword.trailingComponent}
          {...register(ACCOUNT_FIELDS.CONFIRM_PASSWORD)}
          errorMessage={inputErrors.confirmPassword?.message || ""}
        />
      </div>

      <div className="w-full sticky bottom-0 left-0 right-0 px-[24px] pb-[32px] pt-[24px] bg-gradient-to-t from-background via-background via-80% to-transparent flex flex-col gap-4 z-50">
        <Button type="button" className="bg-grey-200 text-grey-500" onClick={onPrevStep}>
          {AUTH_UI_MESSAGE.FLOW.BACK}
        </Button>
        <Button className={"bg-red-500 disabled:bg-red-200 text-background"} disabled={!canSubmit} type="submit">
          {canSubmit ? AUTH_UI_MESSAGE.FLOW.NEXT : AUTH_UI_MESSAGE.FLOW.FILL_ALL_FIELDS}
        </Button>
      </div>
    </form>
  );
};

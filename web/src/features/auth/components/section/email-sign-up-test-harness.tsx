import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormProvider } from "react-hook-form";

import type { ReactNode } from "react";

import { type ClubInfo, clubQueries } from "@/features/club";

import { useEmailSignUpStepForm } from "../../hooks/form";

export const TEST_CLUB: ClubInfo = {
  clubId: 1,
  school: "홍익대학교",
  groupName: "어흥",
};

export function createAuthQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(clubQueries.list().queryKey, [TEST_CLUB]);
  return queryClient;
}

function SignUpFormProvider({ children }: { children: ReactNode }) {
  const methods = useEmailSignUpStepForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

export function wrapSignUpStep(ui: ReactNode) {
  return (
    <QueryClientProvider client={createAuthQueryClient()}>
      <SignUpFormProvider>{ui}</SignUpFormProvider>
    </QueryClientProvider>
  );
}

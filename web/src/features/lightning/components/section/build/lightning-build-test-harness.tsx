import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { myPageQueries } from "@/features/my-page";

import { LIGHTNING_CREATE_FORM_DEFAULTS } from "../../../constants";
import { LightningBuildContext } from "../../../providers";
import type { BuildStep } from "../../../types";
import {
  lightningBuildSchema,
  type LightningCreateFormData,
} from "../../../types/schemas";

export const LIGHTNING_BUILD_READY_VALUES: Partial<LightningCreateFormData> = {
  address: "홍익대학교",
  locationPoint: { latitude: 37.55, longitude: 126.92 },
  recruitEndTime: "23:59",
};

const LIGHTNING_TEST_MEMBER = {
  name: "홍길동",
  phoneNumber: "010-1234-5678",
  email: "user@test.com",
  username: "user",
  clubName: "어흥",
  profile: {
    id: 1,
    originalFilename: "a.png",
    convertedFileName: "a.png",
    fullFilePath: "",
    fileType: "image/png",
    fileSize: 1,
    createdAt: "2020-01-01",
  },
};

function createLightningQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(myPageQueries.info().queryKey, LIGHTNING_TEST_MEMBER);
  return queryClient;
}

function LightningFormShell({
  children,
  defaults,
  onBuildStepChange,
}: {
  children: ReactNode;
  defaults?: Partial<LightningCreateFormData> | undefined;
  onBuildStepChange?: ((step: BuildStep) => void) | undefined;
}) {
  const form = useForm<LightningCreateFormData>({
    defaultValues: {
      ...LIGHTNING_CREATE_FORM_DEFAULTS,
      ...defaults,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(lightningBuildSchema),
  });
  const [buildStep, setBuildStep] = useState<BuildStep>(
    "SelectTimeAndPersonnel"
  );

  return (
    <FormProvider {...form}>
      <LightningBuildContext.Provider
        value={{
          buildStep,
          setBuildStep: (step) => {
            setBuildStep(step);
            onBuildStepChange?.(step);
          },
          allowLeave: () => {},
        }}
      >
        {children}
      </LightningBuildContext.Provider>
    </FormProvider>
  );
}

export function wrapLightningBuildStep(
  ui: ReactNode,
  options?: {
    defaults?: Partial<LightningCreateFormData>;
    onBuildStepChange?: (step: BuildStep) => void;
  }
) {
  return (
    <QueryClientProvider client={createLightningQueryClient()}>
      <LightningFormShell
        defaults={options?.defaults}
        onBuildStepChange={options?.onBuildStepChange}
      >
        {ui}
      </LightningFormShell>
    </QueryClientProvider>
  );
}

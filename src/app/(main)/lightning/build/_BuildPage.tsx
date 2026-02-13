"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { match } from "ts-pattern";

import { Header } from "@/shared";

import {
  LightningBuildCompleteStep,
  SelectLocationStep,
  SelectTargetStep,
  SelectTimeAndPersonnelStep,
  SelectTypeStep,
  TitleStep,
} from "@/features/lightning/components/section/build";
import { BuildProgressBar } from "@/features/lightning/components/section/build/BuildProgressBar";
import { SelectionSummary } from "@/features/lightning/components/ui";
import { BUILD_STEPS, LIGHTNING_CREATE_FORM_DEFAULTS } from "@/features/lightning/constants";
import {
  LightningBuildContext,
  type LightningBuildState,
} from "@/features/lightning/providers";
import type { BuildStep } from "@/features/lightning/types";
import {
  lightningBuildSchema,
  type LightningCreateFormData,
} from "@/features/lightning/types/schemas";

/** `/lightning/build` — `page`·모달 인터셉트에서 그대로 쓰는 화면 */
export function LightningBuildPage() {
  const formMethods = useForm<LightningCreateFormData>({
    defaultValues: {
      ...LIGHTNING_CREATE_FORM_DEFAULTS,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(lightningBuildSchema),
  });
  const { reset } = formMethods;
  const [buildStep, setBuildStep] = useState<BuildStep>(BUILD_STEPS[0]);

  useEffect(() => {
    reset({
      ...LIGHTNING_CREATE_FORM_DEFAULTS,
    });
  }, [reset]);

  const isSummaryVisible = useMemo(
    () => BUILD_STEPS.indexOf(buildStep) <= BUILD_STEPS.indexOf("Summary"),
    [buildStep],
  );

  const contextValue = useMemo<LightningBuildState>(
    () => ({ buildStep, setBuildStep }),
    [buildStep],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header title="" isBackBtn={true} />
      <FormProvider {...formMethods}>
        <LightningBuildContext.Provider value={contextValue}>
          <main className="flex min-h-0 flex-1 flex-col">
            <BuildProgressBar />
            {isSummaryVisible && <SelectionSummary />}
            {match(buildStep)
              .with("SelectType", () => <SelectTypeStep />)
              .with("SelectLocation", () => <SelectLocationStep />)
              .with("SelectTimeAndPersonnel", () => (
                <SelectTimeAndPersonnelStep />
              ))
              .with("SelectTarget", () => <SelectTargetStep />)
              .with("Summary", () => <TitleStep />)
              .with("Complete", () => <LightningBuildCompleteStep />)
              .exhaustive()}
          </main>
        </LightningBuildContext.Provider>
      </FormProvider>
    </div>
  );
}

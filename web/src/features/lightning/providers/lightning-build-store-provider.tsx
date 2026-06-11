"use client";

import { createContext, useContext } from "react";

import type { BuildStep } from "../types";

export interface LightningBuildState {
  buildStep: BuildStep;
  setBuildStep: (step: BuildStep) => void;
}

export const LightningBuildContext = createContext<LightningBuildState | null>(
  null,
);

export function useLightningBuildStore<T>(
  selector: (state: LightningBuildState) => T,
): T {
  const ctx = useContext(LightningBuildContext);

  if (!ctx) {
    throw new Error(
      "useLightningBuildStore must be used within LightningBuildContext.Provider",
    );
  }

  return selector(ctx);
}

export function useLightningBuildContext(): LightningBuildState {
  const ctx = useContext(LightningBuildContext);

  if (!ctx) {
    throw new Error(
      "useLightningBuildContext must be used within LightningBuildContext.Provider",
    );
  }

  return ctx;
}

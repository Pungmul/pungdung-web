"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { lightningQueries } from "../../queries";
import { deriveDisplayLightningLists } from "../../services";

export const useLightningLists = () => {
  const { data } = useQuery(lightningQueries.lightningData());

  return useMemo(() => deriveDisplayLightningLists(data), [data]);
};

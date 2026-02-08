"use client";

import { z } from "zod";

import { CLUB_NAMES, NO_CLUB_VALUE } from "@/features/club";

export function createClubFieldSchema(dynamicClubNames: string[]) {
  const resolvedClubNames =
    dynamicClubNames.length > 0 ? dynamicClubNames : [...CLUB_NAMES];

  const clubNames = Array.from(
    new Set([...resolvedClubNames, NO_CLUB_VALUE, "없음"])
  );

  return z
    .enum(clubNames as [string, ...string[]])
    .nullable()
    .optional();
}

'use client';

import React from "react";

type ConditionalProps<T extends string> = {
  value: T;
  cases: Record<T, React.ReactNode>;
  fallback?: React.ReactNode;
};

export function Conditional<T extends string>({
  value,
  cases,
  fallback = null,
}: ConditionalProps<T>) {
  return cases[value] ?? fallback;
}

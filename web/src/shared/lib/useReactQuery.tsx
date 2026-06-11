"use client";

import { ReactNode } from 'react';

import { QueryProvider } from '@/core';

interface ReactQueryProvidersProps {
  children: ReactNode;
}

export default function ReactQueryProviders({ children }: ReactQueryProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
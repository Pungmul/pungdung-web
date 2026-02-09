'use client'
import React, { createContext, useContext } from 'react'

const TokenContext = createContext<string | null>(null);

export function TokenProvider({ token, children }: { token: string | undefined, children: React.ReactNode }) {
  return (
    <TokenContext.Provider value={token ?? null}>
      {children}
    </TokenContext.Provider>
  )
}

export function useToken() {
  return useContext(TokenContext);
}

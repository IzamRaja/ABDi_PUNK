import React, { createContext, useContext, ReactNode } from 'react';
import { useArisanStore } from '@/hooks/useArisanStore';

type ArisanContextType = ReturnType<typeof useArisanStore>;

const ArisanContext = createContext<ArisanContextType | null>(null);

export function ArisanProvider({ children }: { children: ReactNode }) {
  const store = useArisanStore();
  
  return (
    <ArisanContext.Provider value={store}>
      {children}
    </ArisanContext.Provider>
  );
}

export function useArisan() {
  const context = useContext(ArisanContext);
  if (!context) {
    throw new Error('useArisan must be used within ArisanProvider');
  }
  return context;
}

'use client';

import { createContext, useContext } from 'react';
import type { FeatureFlags } from '../config/features';

const FeatureContext = createContext<FeatureFlags | undefined>(undefined);

interface FeatureProviderProps {
  features: FeatureFlags;
  children: React.ReactNode;
}

export function FeatureProvider({ features, children }: FeatureProviderProps) {
  return (
    <FeatureContext.Provider value={features}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeature<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeature must be used within a FeatureProvider');
  }
  return context[key];
}

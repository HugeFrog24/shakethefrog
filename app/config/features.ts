/**
 * Server-side feature flag definitions.
 *
 * Flags are read from environment variables. The abstraction is kept thin
 * so a runtime provider (Flipt, Unleash, Flags SDK adapter, etc.) can be
 * swapped in later without changing any consumer code.
 *
 * Convention: FEATURE_<NAME>=1  → enabled
 *             anything else     → disabled
 */

export interface FeatureFlags {
  paymentsEnabled: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    paymentsEnabled: process.env.FEATURE_PAYMENTS === '1',
  };
}

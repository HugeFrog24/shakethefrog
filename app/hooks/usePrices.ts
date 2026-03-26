'use client';

import { useState, useEffect } from 'react';
import { useFeature } from '../providers/FeatureProvider';

interface PricesData {
  prices: Record<string, string>;
}

export function usePrices() {
  const paymentsEnabled = useFeature('paymentsEnabled');
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentsEnabled) {
      setLoading(false);
      return;
    }

    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/prices');

        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }

        const data: PricesData = await response.json();
        setPrices(data.prices);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [paymentsEnabled]);

  const getPrice = (skinId: string): string | null => {
    if (!paymentsEnabled || loading) {
      return null;
    }
    return prices[skinId] ?? null;
  };

  return {
    prices,
    loading,
    error,
    enabled: paymentsEnabled,
    getPrice
  };
}
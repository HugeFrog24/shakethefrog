'use client';

import { useState, useEffect } from 'react';

interface PricesData {
  prices: Record<string, string>;
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        throw err; // Fail fast - don't set fallback prices
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getPrice = (skinId: string): string => {
    // Don't throw error if still loading
    if (loading) {
      return '...';
    }
    
    const price = prices[skinId];
    if (!price) {
      throw new Error(`Price not found for skin: ${skinId}`);
    }
    return price;
  };

  return {
    prices,
    loading,
    error,
    getPrice
  };
}
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { appConfig } from '../config/app';
import { SkinId } from '../types';
import { useLocalizedSkinName } from '../hooks/useLocalizedSkinName';

export function SkinSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLocalizedSkinName = useLocalizedSkinName();

  const handleSkinChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSkin = event.target.value as SkinId;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSkin === appConfig.defaultSkin) {
      params.delete('skin');
    } else {
      params.set('skin', newSkin);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
  }, [router, searchParams]);

  const skinParam = searchParams.get('skin');
  
  // Validate that the skin exists in our config
  const isValidSkin = skinParam && Object.keys(appConfig.skins).includes(skinParam);
  
  // Use the skin from URL if valid, otherwise use default skin
  const currentSkin = (isValidSkin ? skinParam : appConfig.defaultSkin) as SkinId;

  return (
    <div className="flex items-center gap-2">
      <Image
        src={appConfig.skins[currentSkin].normal}
        alt={getLocalizedSkinName(currentSkin)}
        width={20}
        height={20}
        className="text-gray-600 dark:text-gray-400"
      />
      <select
        value={currentSkin}
        onChange={handleSkinChange}
        className="bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        aria-label="Select skin"
      >
        {Object.entries(appConfig.skins).map(([id]) => (
          <option key={id} value={id}>
            {getLocalizedSkinName(id)}
          </option>
        ))}
      </select>
    </div>
  );
}
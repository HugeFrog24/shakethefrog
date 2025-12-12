'use client';

import { useSearchParams } from 'next/navigation';
import { appConfig } from '../config/app';
import { SkinId } from '../types';

export function useSkin() {
  const searchParams = useSearchParams();
  const skinParam = searchParams.get('skin');
  
  // Validate that the skin exists in our config
  const isValidSkin = skinParam && Object.keys(appConfig.skins).includes(skinParam);
  
  // Return the skin from URL if valid, otherwise return default skin
  const currentSkin = (isValidSkin ? skinParam : appConfig.defaultSkin) as SkinId;
  
  return currentSkin;
}
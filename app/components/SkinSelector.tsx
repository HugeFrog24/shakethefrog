'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { appConfig } from '../config/app';
import { SkinId } from '../types';
import { useLocalizedSkinName } from '../hooks/useLocalizedSkinName';
import { usePrices } from '../hooks/usePrices';
import { ChevronDownIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { PremiumCheckout } from './PremiumCheckout';

interface SkinOption {
  id: SkinId;
  name: string;
  image: string;
}

export function SkinSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLocalizedSkinName = useLocalizedSkinName();
  const { getPrice, loading: pricesLoading } = usePrices();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState<SkinId | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skinOptions: SkinOption[] = Object.entries(appConfig.skins).map(([id, skin]) => ({
    id: id as SkinId,
    name: getLocalizedSkinName(id),
    image: skin.normal
  }));

  const skinParam = searchParams.get('skin');
  
  // Validate that the skin exists in our config
  const isValidSkin = skinParam && Object.keys(appConfig.skins).includes(skinParam);
  
  // Use the skin from URL if valid, otherwise use default skin
  const currentSkin = (isValidSkin ? skinParam : appConfig.defaultSkin) as SkinId;
  const currentSkinOption = skinOptions.find(skin => skin.id === currentSkin) || skinOptions[0];

  const handleSkinChange = useCallback((newSkin: SkinId) => {
    const skin = appConfig.skins[newSkin];
    
    // If it's a premium skin, show checkout modal
    if (skin.isPremium) {
      setShowCheckout(newSkin);
      setIsOpen(false);
      return;
    }

    // For free skins, change immediately
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSkin === appConfig.defaultSkin) {
      params.delete('skin');
    } else {
      params.set('skin', newSkin);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
    setIsOpen(false);
  }, [router, searchParams]);

  const handleCheckoutClose = useCallback(() => {
    setShowCheckout(null);
  }, []);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main toggle button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-label="Skin selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src={currentSkinOption.image}
          alt={currentSkinOption.name}
          width={16}
          height={16}
          className="rounded"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[60px] text-left hidden min-[360px]:block">
          {currentSkinOption.name}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {skinOptions.map((option) => {
              const skin = appConfig.skins[option.id];
              const isPremium = skin.isPremium;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSkinChange(option.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentSkin === option.id
                      ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  role="menuitem"
                >
                  <div className="relative">
                    <Image
                      src={option.image}
                      alt={option.name}
                      width={16}
                      height={16}
                      className="rounded"
                    />
                    {isPremium && (
                      <LockClosedIcon className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <span className="flex-1">{option.name}</span>
                  {isPremium && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      {pricesLoading ? '...' : getPrice(option.id)}
                    </span>
                  )}
                  {currentSkin === option.id && (
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Premium Checkout Modal */}
      {showCheckout && (
        <PremiumCheckout
          skinId={showCheckout}
          onClose={handleCheckoutClose}
        />
      )}
    </div>
  );
}
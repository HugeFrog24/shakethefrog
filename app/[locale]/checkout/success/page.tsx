'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { appConfig } from '../../../config/app';
import { SkinId } from '../../../types';
import { useLocalizedSkinName } from '../../../hooks/useLocalizedSkinName';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('ui');
  const getLocalizedSkinName = useLocalizedSkinName();
  const [countdown, setCountdown] = useState(5);

  const skinId = searchParams.get('skin') as SkinId;
  const skin = skinId ? appConfig.skins[skinId] : null;
  const skinName = skinId ? getLocalizedSkinName(skinId) : '';

  useEffect(() => {
    // Countdown timer to redirect to home
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to home with the purchased skin
          const params = new URLSearchParams();
          if (skinId && skinId !== appConfig.defaultSkin) {
            params.set('skin', skinId);
          }
          const newUrl = `/${params.toString() ? '?' + params.toString() : ''}`;
          router.push(newUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [skinId, router]);

  const handleGoToApp = () => {
    const params = new URLSearchParams();
    if (skinId && skinId !== appConfig.defaultSkin) {
      params.set('skin', skinId);
    }
    const newUrl = `/${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('checkout.success.title')}
        </h1>

        {skin && (
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <img
                src={skin.normal}
                alt={skinName}
                className="w-16 h-16"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('checkout.success.unlockedSkin', { skinName })}
            </p>
          </div>
        )}

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('checkout.success.thankYou')}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoToApp}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            {t('checkout.success.goToApp')}
          </button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('checkout.success.redirecting', { countdown })}
          </p>
        </div>

        {/* Receipt Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('checkout.success.receiptSent')}
          </p>
        </div>
      </div>
    </div>
  );
}
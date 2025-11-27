'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CheckoutCancelPage() {
  const router = useRouter();
  const t = useTranslations('ui');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer to redirect to home
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('checkout.cancel.title')}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('checkout.cancel.message')}
        </p>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('checkout.cancel.tryAgain')}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {t('checkout.cancel.backToApp')}
          </button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('checkout.cancel.redirecting', { countdown })}
          </p>
        </div>

        {/* Help Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('checkout.cancel.needHelp')}
          </p>
        </div>
      </div>
    </div>
  );
}
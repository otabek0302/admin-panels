'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">{t('not-found.title')}</h1>
      <p className="mt-4 text-2xl">{t('not-found.description')}</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        {t('not-found.button')}
      </Link>
    </div>
  );
};

export default NotFound;

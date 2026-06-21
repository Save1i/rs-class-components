'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {usePathname, useRouter} from '../i18n/navigation';

const locales = ['en', 'ru'] as const;

function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Header');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (nextLocale: (typeof locales)[number]) => {
    const query = Object.fromEntries(searchParams.entries());
    router.replace(
      query && Object.keys(query).length > 0 ? {pathname, query} : pathname,
      {locale: nextLocale}
    );
  };

  return (
    <label className="language-control">
      <span className="language-control__label">{t('languageLabel')}</span>
      <select
        className="theme-select"
        value={locale}
        onChange={(event) => handleChange(event.target.value as (typeof locales)[number])}
      >
        <option value="en">{t('languageEn')}</option>
        <option value="ru">{t('languageRu')}</option>
      </select>
    </label>
  );
}

export default LanguageSwitcher;

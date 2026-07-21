'use client';

import {useTranslations} from 'next-intl';
import {Link} from '../i18n/navigation';
import {useTheme} from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

export const Header = () => {
  const t = useTranslations('Header');
  const {theme, setTheme} = useTheme();

  return (
    <header className="header">
      <Link className="logo" href="/">
        {t('brand')}
      </Link>

      <nav className="header-nav">
        <Link className="link" href="/about">
          {t('about')}
        </Link>
      </nav>

      <LanguageSwitcher />

      <label className="theme-controler">
        <span>{t('themeLabel')}</span>
        <select
          className="theme-select"
          value={theme}
          onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
        >
          <option value="light">{t('themeLight')}</option>
          <option value="dark">{t('themeDark')}</option>
        </select>
      </label>
    </header>
  );
};

export default Header;

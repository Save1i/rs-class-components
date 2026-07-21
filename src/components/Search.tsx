import type {FormEvent} from 'react';
import {useTranslations} from 'next-intl';

interface Props {
  onSearch: (event: FormEvent) => void;
  onChange: (value: string) => void;
  searchValue: string;
}

function Search({onSearch, onChange, searchValue}: Props) {
  const t = useTranslations('Search');

  return (
    <div className="search-form">
      <form className="search-form-content" onSubmit={onSearch}>
        <input
          className="search-input"
          type="text"
          value={searchValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('placeholder')}
        />

        <input className="search-button" type="submit" value={t('submit')} />
      </form>

      <p className="text-info">{t('hint')}</p>
    </div>
  );
}

export default Search;

import {useTranslations} from 'next-intl';
import type {Pokemon} from './Main';
import {useSelectedItemsStore} from '../store/selectedItemsStore';
import {Link} from '../i18n/navigation';

import Image from 'next/image';

interface Props {
  item: Pokemon[] | null | undefined;
  error: string;
  isLoading: boolean;
  page: number;
  showPagination: boolean;
  onPageChange: (page: number) => void;
}

function CardList({item: pokemon, error: searchError, isLoading, page, showPagination, onPageChange}: Props) {
  const t = useTranslations('CardList');
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);
  const clearAll = useSelectedItemsStore((state) => state.clearAll);
  

const downloadSelectedAsCsv = async () => {
  const response = await fetch('/api/export-csv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedItems),
  });

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = `${selectedItems.length}_items.csv`;

  a.click();

  URL.revokeObjectURL(url);
};

  if (searchError) {
    return <p className="error">{t('error', {message: searchError})}</p>;
  }

  if (isLoading || pokemon == null) {
    return <p className="loading">{t('loading')}</p>;
  }

  return (
    <div className="card-list">
      <ul className="card-list__content">
        {pokemon.map((el) => (
          <li className="card" key={el.id}>
            <div className="card-selection">
              <input
                checked={selectedItems.some((item) => item.id === el.id)}
                type="checkbox"
                name={`select ${el.name}`}
                aria-label={`select ${el.name}`}
                onChange={() => toggleItem(el)}
              />
            </div>
            <Link className="card-link" href={`/pokemon/${el.id}?page=${page}`}>
              <div className="card-image__wrapper">
                <Image src={el.image} alt={el.name} height={100} width={100} />
              </div>

              <h2 className="card-name">{el.name}</h2>

              <div className="card-info">
                <p className="card-text">{t('height', { value: el.height })}</p>
                <p className="card-text">{t('weight', { value: el.weight })}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {selectedItems.length > 0 && (
        <div className="selected-panel">
          <p>{t('selectedCount', { count: selectedItems.length })}</p>
          <div className="selected-panel-actions">
            <button className="pagination-button" onClick={clearAll}>
              {t('unselectAll')}
            </button>
            <button className="search-button" onClick={downloadSelectedAsCsv}>
              {t('download')}
            </button>
          </div>
        </div>
      )}

      {showPagination && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t('previous')}
          </button>
          <span className="pagination-page">{t('page', { page })}</span>
          <button
            className="pagination-button"
            onClick={() => onPageChange(page + 1)}
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
}

export default CardList;

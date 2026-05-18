import { Link } from 'react-router-dom';
import type { Pokemon } from './Main';

interface Props {
  item: Pokemon[] | null;
  error: string;
  isLoading: boolean;
  page: number;
  showPagination: boolean;
  onPageChange: (page: number) => void;
}

function CardList({ item: pokemon, error: searchError, isLoading, page, showPagination, onPageChange }: Props) {
  if (searchError) {
    return <p className="error">Error: {searchError}</p>;
  }

  if (isLoading || pokemon === null) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="card-list">
      <ul className="card-list__content">
        {pokemon.map((el) => (
          <li className="card" key={el.id}>
            <Link className="card-link" to={`/pokemon/${el.id}?page=${page}`}>
              <div className="card-image__wrapper">
                <img className="card-image" src={el.image} alt={el.name} />
              </div>

              <h2 className="card-name">{el.name}</h2>

              <div className="card-info">
                <p className="card-text">Height: {el.height}</p>
                <p className="card-text">Weight: {el.weight}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {showPagination && (
        <div className="pagination">
          <button className="pagination-button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Prev
          </button>
          <span className="pagination-page">Page {page}</span>
          <button className="pagination-button" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CardList;

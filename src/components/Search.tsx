import type { FormEvent } from 'react';

interface Props {
  onSearch: (event: FormEvent) => void;
  onChange: (value: string) => void;
  searchValue: string;
}

function Search({ onSearch, onChange, searchValue }: Props) {
  return (
    <div className="search-form">
      <form className="search-form-content" onSubmit={onSearch}>
        <input
          className="search-input"
          type="text"
          value={searchValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter pokemon name..."
        />

        <input className="search-button" type="submit" value="search" />
      </form>

      <p className="text-info">The search is performed by the full name of the Pokemon</p>
    </div>
  );
}

export default Search;

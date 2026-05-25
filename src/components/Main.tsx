import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Search from './Search';
import CardList from './CardList';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  image: string;
  baseExperience?: number;
  order?: number;
  types?: string[];
  abilities?: string[];
}

interface ResultArr {
  name: string; 
  url: string;
}

interface ListResponse {
  results: Array<ResultArr>;
}

const PAGE_LIMIT = 12;

async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (response.status === 404) {
    throw new Error(`Pokemon "${name}" not found`);
  }

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    image: data.sprites.front_default,
  };
}

async function fetchPokemonPage(page: number): Promise<Pokemon[]> {
  const offset = (page - 1) * PAGE_LIMIT;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_LIMIT}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data: ListResponse = await response.json();

  const list = await Promise.all(
    data.results.map(async (pokemon) => {
      const detailsResponse = await fetch(pokemon.url);

      if (!detailsResponse.ok) {
        throw new Error('Pokemon loading error');
      }

      const details = await detailsResponse.json();

      return {
        id: details.id,
        name: details.name,
        height: details.height,
        weight: details.weight,
        image: details.sprites.front_default,
      };
    })
  );

  return list;
}

function parsePage(rawValue: string | null): number {
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedSearch, setSavedSearch] = useLocalStorage('searchInput', '');
  const [searchInput, setSearchInput] = useState(savedSearch);
  const [pokemon, setPokemon] = useState<Pokemon[] | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasTestError, setHasTestError] = useState(false);

  const currentPage = useMemo(() => parsePage(searchParams.get('page')), [searchParams]);

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: '1' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const cleanSearchInput = savedSearch.trim().toLowerCase();

    const loadPokemon = async () => {
      setIsLoading(true);
      setSearchError('');

      try {
        if (cleanSearchInput) {
          if (!/^[a-z]+$/i.test(cleanSearchInput)) {
            throw new Error('Incorrect Pokemon name');
          }

          const result = await fetchPokemonByName(cleanSearchInput);
          setPokemon([result]);
          return;
        }

        const pageList = await fetchPokemonPage(currentPage);
        setPokemon(pageList);
      } catch (error: unknown) {
        setPokemon([]);

        if (error instanceof Error) {
          setSearchError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();
  }, [savedSearch, currentPage]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const cleanValue = searchInput.trim().toLowerCase();

    setSavedSearch(cleanValue);
    setPokemon(null);
    setSearchParams({ page: '1' });
    navigate('/?page=1', { replace: true });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });

    if (location.pathname.includes('/pokemon/')) {
      navigate(`/?page=${nextPage}`);
    }
  };

  if (hasTestError) {
    throw new Error('Test application error');
  }

  return (
    <>
      <h1 className="title">Pokemon Search</h1>

      <Search searchValue={searchInput} onChange={setSearchInput} onSearch={handleSubmit} />

      <button className="search-button" onClick={() => setHasTestError(true)}>
        Test Error
      </button>

      <div className={`detail ${location.pathname.includes('/pokemon/') ? 'detail_open' : ''}`}>
        <div className="detail-list">
          <CardList
            item={pokemon}
            error={searchError}
            isLoading={isLoading}
            page={currentPage}
            showPagination={!savedSearch.trim() && Array.isArray(pokemon) && pokemon.length > 0}
            onPageChange={handlePageChange}
          />
        </div>

        <Outlet />
      </div>
    </>
  );
}

function DetailsPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { detailsId } = useParams();
  const [details, setDetails] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const page = parsePage(searchParams.get('page'));

  useEffect(() => {
    const loadDetails = async () => {
      if (!detailsId) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${detailsId}`);

        if (!response.ok) {
          throw new Error('Pokemon details loading error');
        }

        const data = await response.json();

        setDetails({
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          image: data.sprites.front_default,
          baseExperience: data.base_experience,
          order: data.order,
          types: data.types?.map((item: { type: { name: string } }) => item.type.name) ?? [],
          abilities:
            data.abilities?.map((item: { ability: { name: string } }) => item.ability.name) ?? [],
        });
      } catch (loadError: unknown) {
        if (loadError instanceof Error) {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [detailsId]);

  const closeDetails = () => {
    navigate(`/?page=${page}`);
  };

  return (
    <aside className="details-panel" onClick={closeDetails}>
      <div className="details-panel__content" onClick={(event) => event.stopPropagation()}>
        <button className="close-details" onClick={closeDetails}>
          Close
        </button>

        {isLoading && <p className="loading">Loading details...</p>}
        {!isLoading && error && <p className="error">Error: {error}</p>}

        {!isLoading && details && (
          <div className="card">
            <div className="card-image-wrapper">
              <img className="card-image" src={details.image} alt={details.name} />
            </div>
            <h2 className="card-name">{details.name}</h2>
            <div className="card-info">
              <p className="card-text">Height: {details.height}</p>
              <p className="card-text">Weight: {details.weight}</p>
              <p className="card-text">Base experience: {details.baseExperience ?? 'unknown'}</p>
              <p className="card-text">Order: {details.order ?? 'unknown'}</p>
              <p className="card-text">
                Types: {details.types && details.types.length ? details.types.join(', ') : 'unknown'}
              </p>
              <p className="card-text">
                Abilities: {details.abilities && details.abilities.length ? details.abilities.join(', ') : 'unknown'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

Main.Details = DetailsPanel;

export default Main;

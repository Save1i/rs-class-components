'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Search from './Search';
import CardList from './CardList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
const QUERY_KEY = ['pokemon'] as const;

async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (response.status === 404) {
    throw new Error('Incorrect Pokemon name');
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

async function fetchPokemonById(id: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (response.status === 404) {
    throw new Error(`Pokemon "${id}" not found`);
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
    baseExperience: data.base_experience,
    order: data.order,
    types: data.types?.map((item: { type: { name: string } }) => item.type.name) ?? [],
    abilities: data.abilities?.map((item: { ability: { name: string } }) => item.ability.name) ?? [],
  };
}

function parsePage(rawValue: string | null): number {
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function Main() {
const router = useRouter();

  const searchParams = useSearchParams();
  const [savedSearch, setSavedSearch] = useLocalStorage('searchInput', '');
  const [searchInput, setSearchInput] = useState(savedSearch);
  const queryClient = useQueryClient();

  const pathName = usePathname();


  const [hasTestError, setHasTestError] = useState(false);

  const currentPage = useMemo(() => parsePage(searchParams.get('page')), [searchParams]);


  const pokemonQuery = useQuery({
    queryKey: [...QUERY_KEY, savedSearch, currentPage],
    queryFn: async () => {
      if (savedSearch) {
        return [await fetchPokemonByName(savedSearch)];
      }

      return fetchPokemonPage(currentPage);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const cleanValue = searchInput.trim().toLowerCase();

    setSavedSearch(cleanValue);
    // searchParams({ page: '1' });
  };

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));

    router.push(`?${params.toString()}`);

    if (pathName.includes('/pokemon/')) {
      router.push(`/?page=${nextPage}`);
    }
  };

  if (hasTestError) {
    throw new Error('Test application error');
  }

  return (
    <>
      <h1 className="title">Pokemon Search</h1>

      <Search searchValue={searchInput} onChange={setSearchInput} onSearch={handleSubmit} />

      <div className="search-actions">
        <button className="search-button" onClick={handleRefresh}>
          Refresh
        </button>

        <button className="search-button" onClick={() => setHasTestError(true)}>
          Test Error
        </button>
      </div>

      <div className={`detail ${pathName.includes('/pokemon/') ? 'detail_open' : ''}`}>
        <div className="detail-list">
          <CardList
            item={pokemonQuery.data}
            error={pokemonQuery.error?.message ?? ''}
            isLoading={pokemonQuery.isPending}
            page={currentPage}
            showPagination={true}
            onPageChange={handlePageChange}
          />
        </div>

        {/* <Outlet /> */}
      </div>
    </>
  );
}

export function DetailsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { detailsId } = useParams();

  const queryClient = useQueryClient();
  const detailsQuery = useQuery({
    queryKey: [...QUERY_KEY, detailsId ?? ''],
    enabled: Boolean(detailsId),
    queryFn: async () => {
      if (!detailsId) {
        throw new Error('Pokemon details loading error');
      }

      return fetchPokemonById(String(detailsId));
    },
  });

  const page = parsePage(searchParams.get('page'));

  const closeDetails = () => {
    router.push(`/?page=${page}`);
  };

  const refreshDetails = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const detailsError = detailsQuery.error instanceof Error ? detailsQuery.error.message : '';

  if (!detailsId) {
    return null;
  }

  return (
    <aside className="details-panel" onClick={closeDetails}>
      <div className="details-panel__content" onClick={(event) => event.stopPropagation()}>
        <div className="details-panel__actions">
          <button className="close-details" onClick={closeDetails}>
            Close
          </button>

          <button className="search-button" onClick={refreshDetails}>
            Refresh
          </button>
        </div>

        {detailsQuery.isPending && <p className="loading">Loading details...</p>}
        {!detailsQuery.isPending && detailsError && <p className="error">Error: {detailsError}</p>}

        {!detailsQuery.isPending && detailsQuery.data && (
          <div className="card">
            <div className="card-image-wrapper">
              <img className="card-image" src={detailsQuery.data.image} alt={detailsQuery.data.name} />
            </div>
            <h2 className="card-name">{detailsQuery.data.name}</h2>
            <div className="card-info">
              <p className="card-text">Height: {detailsQuery.data.height}</p>
              <p className="card-text">Weight: {detailsQuery.data.weight}</p>
              <p className="card-text">Base experience: {detailsQuery.data.baseExperience ?? 'unknown'}</p>
              <p className="card-text">Order: {detailsQuery.data.order ?? 'unknown'}</p>
              <p className="card-text">
                Types:{' '}
                {detailsQuery.data.types && detailsQuery.data.types.length
                  ? detailsQuery.data.types.join(', ')
                  : 'unknown'}
              </p>
              <p className="card-text">
                Abilities:{' '}
                {detailsQuery.data.abilities && detailsQuery.data.abilities.length
                  ? detailsQuery.data.abilities.join(', ')
                  : 'unknown'}
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

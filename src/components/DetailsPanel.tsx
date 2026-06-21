'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {useQuery, useQueryClient} from '@tanstack/react-query';

const QUERY_KEY = ['pokemon'] as const;

async function fetchPokemonById(id: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (response.status === 404) {
    throw new Error(`Pokemon "${id}" not found`);
  }

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

function parsePage(rawValue: string | null): number {
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export default function DetailsPanel() {
  const t = useTranslations('Details');
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const detailsId = params.detailsId as string;
  const page = parsePage(searchParams.get('page'));

  const detailsQuery = useQuery({
    queryKey: [...QUERY_KEY, detailsId],
    enabled: !!detailsId,
    queryFn: async () => fetchPokemonById(detailsId)
  });

  const close = () => {
    router.push(`/${locale}?page=${page}`);
  };

  const refresh = () => {
    void queryClient.invalidateQueries({queryKey: QUERY_KEY});
  };

  if (!detailsId) {
    return null;
  }

  const data = detailsQuery.data as
    | {
        name: string;
        sprites: {front_default: string};
        height: number;
        weight: number;
        base_experience?: number;
        order?: number;
        types?: Array<{type: {name: string}}>;
        abilities?: Array<{ability: {name: string}}>;
      }
    | undefined;

  return (
    <aside className="details-panel" onClick={close}>
      <div className="details-panel__content" onClick={(event) => event.stopPropagation()}>
        <div className="details-panel__actions">
          <button className="close-details" onClick={close}>
            {t('close')}
          </button>
          <button className="search-button" onClick={refresh}>
            {t('refresh')}
          </button>
        </div>

        {detailsQuery.isPending && <p className="loading">{t('loading')}</p>}
        {!detailsQuery.isPending && detailsQuery.error instanceof Error && (
          <p className="error">{t('error', {message: detailsQuery.error.message})}</p>
        )}

        {!detailsQuery.isPending && data && (
          <div className="card">
            <div className="card-image__wrapper">
              <img className="card-image" src={data.sprites.front_default} alt={data.name} />
            </div>
            <h2 className="card-name">{data.name}</h2>
            <div className="card-info">
              <p className="card-text">{t('height', {value: data.height})}</p>
              <p className="card-text">{t('weight', {value: data.weight})}</p>
              <p className="card-text">{t('baseExperience', {value: data.base_experience ?? t('unknown')})}</p>
              <p className="card-text">{t('order', {value: data.order ?? t('unknown')})}</p>
              <p className="card-text">
                {t('types', {
                  value: data.types && data.types.length ? data.types.map((item) => item.type.name).join(', ') : t('unknown')
                })}
              </p>
              <p className="card-text">
                {t('abilities', {
                  value:
                    data.abilities && data.abilities.length ? data.abilities.map((item) => item.ability.name).join(', ') : t('unknown')
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

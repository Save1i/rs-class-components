'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const QUERY_KEY = ['pokemon'] as const;

export default function DetailsPanel() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const detailsId = params.detailsId as string;

  const page = Number(searchParams.get('page') ?? 1);

  const detailsQuery = useQuery({
    queryKey: [...QUERY_KEY, detailsId],
    enabled: !!detailsId,
    queryFn: async () => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${detailsId}`
      );

      if (!res.ok) throw new Error('Pokemon not found');

      return res.json();
    },
  });

  const close = () => {
    router.push(`/?page=${page}`); // ✅ вместо navigate
  };

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  if (!detailsId) return null;

  return (
    <aside className="details-panel" onClick={close}>
      <div onClick={(e) => e.stopPropagation()}>
        <button onClick={close}>Close</button>
        <button onClick={refresh}>Refresh</button>

        {detailsQuery.isPending && <p>Loading...</p>}

        {detailsQuery.data && (
          <div>
            <h2>{detailsQuery.data.name}</h2>
            <img src={detailsQuery.data.sprites.front_default} />
          </div>
        )}
      </div>
    </aside>
  );
}
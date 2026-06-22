import { NextRequest } from 'next/server';
import { Pokemon } from '../../../components/Main';

export async function POST(req: NextRequest) {
  const items = await req.json();

  const rows = items.map((item: Pokemon) =>
    [
      item.id,
      item.name,
      item.height,
      item.weight,
      item.baseExperience ?? '',
      item.order ?? '',
      `https://pokeapi.co/api/v2/pokemon/${item.id}`,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  );

  const header =
    '"id","name","height","weight","base_experience","order","details_url"';

  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="pokemon.csv"',
    },
  });
}

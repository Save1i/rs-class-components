import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function renderApp(initialEntries: string[] = ['/?page=1']) {
const QUERY_CACHE_TIME  = 5 * 60 * 1000;

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CACHE_TIME ,
        gcTime: QUERY_CACHE_TIME ,
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('App routing and main flow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('opens About page from navigation', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ results: [] }) } as Response);

    renderApp();

    expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /about/i }));
    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
  });

  test('shows 404 page on unknown route', () => {
    renderApp(['/unknown']);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  test('saves trimmed search term to localStorage', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 25, name: 'pikachu', height: 4, weight: 60, sprites: { front_default: 'img.png' } }),
    } as Response);

    renderApp();

    await userEvent.type(screen.getByPlaceholderText(/Enter pokemon name.../i), ' Pikachu  ');
    await userEvent.click(screen.getByDisplayValue(/search/i));

    expect(localStorage.getItem('searchInput')).toBe('pikachu');
  });

  test('shows validation error for invalid pokemon name', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: false, status: 404 } as Response);

    renderApp();

    await userEvent.type(screen.getByPlaceholderText(/Enter pokemon name.../i), 'pikachu67');
    await userEvent.click(screen.getByDisplayValue(/search/i));

    await waitFor(() => expect(screen.getByText(/Incorrect Pokemon name/i)).toBeInTheDocument());
  });

  test('loads pokemon list and opens details by clicking card content', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes('/pokemon?limit=')) {
        return {
          ok: true,
          json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' }] }),
        } as Response;
      }

      if (url.endsWith('/pokemon/1')) {
        return {
          ok: true,
          json: async () => ({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: { front_default: 'img.png' },
            base_experience: 64,
            order: 1,
            types: [{ type: { name: 'grass' } }],
            abilities: [{ ability: { name: 'overgrow' } }],
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'img.png' },
        }),
      } as Response;
    });

    renderApp();

    await waitFor(() => expect(screen.getByText('bulbasaur')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('link', { name: /bulbasaur/i }));
    await waitFor(() => expect(screen.getByText(/Base experience:/i)).toBeInTheDocument());
  });

  test('keeps selected item after navigation and unselects from flyout', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes('/pokemon?limit=')) {
        return {
          ok: true,
          json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' }] }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'img.png' },
        }),
      } as Response;
    });

    renderApp();

    await waitFor(() => expect(screen.getByText('bulbasaur')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('checkbox', { name: /select bulbasaur/i }));
    expect(screen.getByText(/1 selected item/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: /about/i }));
    await userEvent.click(screen.getByRole('link', { name: /pokemon search/i }));
    expect(screen.getByText(/1 selected item/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(screen.queryByText(/selected item/i)).not.toBeInTheDocument();
  });

  test('reuses cached pokemon list when returning to a page', async () => {
    const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes('/pokemon?limit=')) {
        return {
          ok: true,
          json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' }] }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'img.png' },
        }),
      } as Response;
    });

    renderApp();

    await waitFor(() => expect(screen.getByText('bulbasaur')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});

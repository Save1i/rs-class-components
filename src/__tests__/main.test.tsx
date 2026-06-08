import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';

function renderApp(initialEntries: string[] = ['/forms']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
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

class MockFileReader {
  result: string | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  readAsDataURL(file: Blob) {
    this.result = `data:${file.type};base64,MOCK_IMAGE`;
    this.onload?.();
  }
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('opens the modal and closes it with Escape', async () => {
    renderApp();

    await userEvent.click(screen.getByRole('button', { name: /open uncontrolled form/i }));
    expect(screen.getByRole('dialog', { name: /uncontrolled form/i })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /uncontrolled form/i })).not.toBeInTheDocument());
  });

  test('submits the uncontrolled form and shows the saved card', async () => {
    renderApp();

    await userEvent.click(screen.getByRole('button', { name: /open uncontrolled form/i }));
    await userEvent.type(screen.getByLabelText(/^name$/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/^country$/i), 'Belarus');
    await userEvent.upload(
      screen.getByLabelText(/profile image/i),
      new File(['image'], 'avatar.png', { type: 'image/png' })
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Abc1!');
    await userEvent.type(screen.getByLabelText(/^confirm password$/i), 'Abc1!');
    await userEvent.click(screen.getByRole('button', { name: /submit uncontrolled/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/Country: Belarus/i)).toBeInTheDocument();
    expect(screen.getByText(/Password: 4\/4/i)).toBeInTheDocument();
  });
});

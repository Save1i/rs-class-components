import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Search from '../components/Search';

describe('Search', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders input and button', () => {
    render(
      <MemoryRouter>
        <Search searchValue="" onChange={() => {}} onSearch={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Enter pokemon name.../i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/search/i)).toBeInTheDocument();
  });

  test('calls onChange when typing', async () => {
    const onChange = vi.fn();

    render(
      <MemoryRouter>
        <Search searchValue="" onChange={onChange} onSearch={() => {}} />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/Enter pokemon name.../i), 'ditto');
    expect(onChange).toHaveBeenCalled();
  });
});

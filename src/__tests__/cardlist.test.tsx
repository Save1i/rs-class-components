import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CardList from '../components/CardList';
import { useSelectedItemsStore } from '../store/selectedItemsStore';

describe('CardList', () => {
  test('displays error message', () => {
    render(
      <MemoryRouter>
        <CardList item={[]} error="error" isLoading={false} page={1} showPagination={false} onPageChange={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error: error/i)).toBeInTheDocument();
  });

  test('renders pokemon list item with details link', () => {
    const mockData = [{ id: 1, name: 'bulbasaur', height: 7, weight: 69, image: 'bulbasaur.png' }];

    render(
      <MemoryRouter>
        <CardList item={mockData} error="" isLoading={false} page={2} showPagination={false} onPageChange={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/1?page=2');
  });

  test('checks item and shows selected flyout', async () => {
    const mockData = [{ id: 1, name: 'bulbasaur', height: 7, weight: 69, image: 'bulbasaur.png' }];
    useSelectedItemsStore.setState({ selectedItems: [] });

    render(
      <MemoryRouter>
        <CardList item={mockData} error="" isLoading={false} page={2} showPagination={false} onPageChange={() => {}} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('checkbox', { name: /select bulbasaur/i }));

    expect(screen.getByText(/1 selected item/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  test('downloads selected items as csv', async () => {
    const mockData = [{ id: 1, name: 'bulbasaur', height: 7, weight: 69, image: 'bulbasaur.png' }];
    useSelectedItemsStore.setState({ selectedItems: mockData });

    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <CardList item={mockData} error="" isLoading={false} page={2} showPagination={false} onPageChange={() => {}} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /download/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  test('shows loading', () => {
    render(
      <MemoryRouter>
        <CardList item={null} error="" isLoading={true} page={1} showPagination={false} onPageChange={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

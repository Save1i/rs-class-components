import { create } from 'zustand';
import type { Pokemon } from '../components/Main';

interface SelectedItemsState {
  selectedItems: Pokemon[];
  isSelected: (id: number) => boolean;
  toggleItem: (pokemon: Pokemon) => void;
  clearAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  selectedItems: [],
  isSelected: (id) => get().selectedItems.some((item) => item.id === id),
  toggleItem: (pokemon) =>
    set((state) => {
      const exists = state.selectedItems.some((item) => item.id === pokemon.id);

      if (exists) {
        return { selectedItems: state.selectedItems.filter((item) => item.id !== pokemon.id) };
      }

      return { selectedItems: [...state.selectedItems, pokemon] };
    }),
  clearAll: () => set({ selectedItems: [] }),
}));

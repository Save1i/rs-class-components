import { describe, expect, test } from 'vitest';
import { useSelectedItemsStore } from '../store/selectedItemsStore';

describe('selectedItemsStore', () => {
  test('toggles selection and clears all', () => {
    const pokemon = { id: 25, name: 'pikachu', height: 4, weight: 60, image: 'img.png' };

    useSelectedItemsStore.setState({ selectedItems: [] });
    useSelectedItemsStore.getState().toggleItem(pokemon);

    expect(useSelectedItemsStore.getState().isSelected(25)).toBe(true);

    useSelectedItemsStore.getState().toggleItem(pokemon);
    expect(useSelectedItemsStore.getState().isSelected(25)).toBe(false);

    useSelectedItemsStore.getState().toggleItem(pokemon);
    useSelectedItemsStore.getState().clearAll();
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});

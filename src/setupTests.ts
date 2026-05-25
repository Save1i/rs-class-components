import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { useSelectedItemsStore } from './store/selectedItemsStore'


afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  useSelectedItemsStore.setState({ selectedItems: [] })
})

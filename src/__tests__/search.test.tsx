import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import Search from '../components/Search'
import Main from '../components/Main'

describe('Rendering Tests', () => {
  test('Renders search input and search button', () => {
    render(
      <Search
        searchValue=""
        onChange={() => {}}
        onSearch={() => {}}
      />
    )

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    expect(inputElement).toBeInTheDocument()
    expect(buttonElement).toBeInTheDocument()
  }),
  test('Displays previously saved search term from localStorage on mount', () => {
    render(
      <Search
        searchValue="ditto"
        onChange={() => {}}
        onSearch={() => {}}
      />
    )

    const prevSearch = screen.getByDisplayValue(/ditto/i)

    expect(prevSearch).toBeInTheDocument()
  }),
  test('Shows empty input when no saved term exists', () => {
    render(
      <Search
        searchValue=""
        onChange={() => {}}
        onSearch={() => {}}
      />
    )

    const prevSearch = screen.getByDisplayValue('')

    expect(prevSearch).toBeInTheDocument()
  }),
  test('Updates input value when user types', async () => {

    const handleChange = vi.fn()

    render(
      <Search
        searchValue=""
        onChange={handleChange}
        onSearch={() => {}}
      />
    )

    const searchInput = screen.getByPlaceholderText(/Enter pokemon name.../i)

    await userEvent.type(searchInput, 'ditto')

    expect(handleChange).toHaveBeenCalledTimes(5)
    expect(handleChange).toHaveBeenLastCalledWith('o')

  }),
  test('Saves search term to localStorage when search button is clicked', async() => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
    new Response(
      JSON.stringify({
        id: 132,
        name: 'ditto',
        height: 3,
        weight: 40,
        sprites: {
          front_default: 'ditto.png'
        }
      }),
      { status: 200 }
    )
  )

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    const user = userEvent.setup()

    render(<Main />)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.type(inputElement, 'ditto')

    await user.click(buttonElement)

    expect(setItemSpy).toHaveBeenCalledWith('searchInput', 'ditto')

  })
})

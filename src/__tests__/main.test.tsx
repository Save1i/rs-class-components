import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, afterEach} from 'vitest'
import { userEvent } from '@testing-library/user-event'
import Main from '../components/Main'
import ErrorBoundary from '../components/ErrorBoundary'

describe('Rendering Tests', () => {

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  const mockSuccessFetch = () => {
  vi.spyOn(window, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 1,
      name: 'pikachu',
      height: 10,
      weight: 20,
      sprites: {
        front_default: 'img.png',
      },
    }),
  } as Response)
}

const mockNotFound = () => {
  vi.spyOn(window, 'fetch').mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({}),
  } as Response)
}

const user = userEvent.setup();

  test('Saves search term to localStorage when search button is clicked', async() => {
    const setItemSpy = vi.spyOn(
      Storage.prototype,
      'setItem'
    )

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.type(inputElement, 'ditto')

    await user.click(buttonElement)

    expect(setItemSpy).toHaveBeenCalledWith('searchInput', 'ditto')

  }),
  test('Trims whitespace from search input before saving', async() => {
    const setItemSpy = vi.spyOn(
      Storage.prototype,
      'setItem'
    )

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.type(inputElement, ' ditto  ')

    await user.click(buttonElement)

    expect(setItemSpy).toHaveBeenCalledWith('searchInput', 'ditto')

  }),
  test('Retrieves saved search term on component mount', () => {

    localStorage.setItem('searchInput', 'ditto')

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/enter pokemon name.../i)

    expect(inputElement).toHaveValue('ditto')

  }),
  test('Overwrites existing localStorage value when new search is performed', async() => {
    const setItemSpy = vi.spyOn(
      Storage.prototype,
      'setItem'
    )

    localStorage.setItem('searchInput', 'ditto')

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.clear(inputElement)

    await user.type(inputElement, 'pikachu')

    await user.click(buttonElement)

    expect(setItemSpy).toHaveBeenCalledWith('searchInput', 'pikachu')

    expect(localStorage.getItem('searchInput')).toBe('pikachu')

  }),
  test('Trigger test error ui', async() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  render(
    <ErrorBoundary>
      <Main/>
    </ErrorBoundary>
  )

    const errorTestBtn = screen.getByText(/Test Error/i)

    await user.click(errorTestBtn)

    const errorElement = screen.getByText(/The application encountered an unexpected error./i)

    expect(errorElement).toBeInTheDocument()

  }),
  test('Show error when name is invalid (52, pikachu67)', async() => {

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.type(inputElement, 'pikachu67')

    await user.click(buttonElement)

    const invalidNameError = await screen.findByText(/Incorrect Pokemon name/i)

    expect(invalidNameError).toBeInTheDocument()

  }),
  test('display error when pokemon is not found', async() => {
    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await user.type(inputElement, 'pikach')

    await user.click(buttonElement)

    const invalidNameError = await screen.findByText(/Error: Pokemon "pikach" not found/i)

    expect(invalidNameError).toBeInTheDocument()
  }),
  test('loads pokemon from API', async () => {
    mockSuccessFetch()

    render(<Main />)

    const input = screen.getByPlaceholderText(/enter pokemon/i)
    const button = screen.getByDisplayValue(/search/i)

    await user.type(input, 'pikachu')
    await user.click(button)

    expect(await screen.findByText('pikachu')).toBeInTheDocument()
  }),
  test('handles 404 api error correctly', async () => {
    mockNotFound()

    render(<Main />)

    const input = screen.getByPlaceholderText(/enter pokemon/i)
    const button = screen.getByDisplayValue(/search/i)

    await user.type(input, 'pikach')
    await user.click(button)

    expect(
      await screen.findByText(/not found/i)
    ).toBeInTheDocument()
  }),
  test('loads initial pokemon list on mount', async () => {
    mockSuccessFetch()

    render(<Main />)

    expect(await screen.findByText('pikachu')).toBeInTheDocument()
  })
})
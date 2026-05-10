import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, afterEach} from 'vitest'
import userEvent from '@testing-library/user-event'
import Main from '../components/Main'
import ErrorBoundary from '../components/ErrorBoundary'

describe('Rendering Tests', () => {

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  test('Saves search term to localStorage when search button is clicked', async() => {
    const setItemSpy = vi.spyOn(
      Storage.prototype,
      'setItem'
    )

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await userEvent.type(inputElement, 'ditto')

    await userEvent.click(buttonElement)

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

    await userEvent.type(inputElement, ' ditto  ')

    await userEvent.click(buttonElement)

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

    await userEvent.clear(inputElement)

    await userEvent.type(inputElement, 'pikachu')

    await userEvent.click(buttonElement)

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

    await userEvent.click(errorTestBtn)

    const errorElement = screen.getByText(/The application encountered an unexpected error./i)

    expect(errorElement).toBeInTheDocument()

  }),
  test('Show error when name is invalid (52, pikachu67)', async() => {

    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await userEvent.type(inputElement, 'pikachu67')

    await userEvent.click(buttonElement)

    const invalidNameError = screen.getByText(/Incorrect Pokemon name/i)

    expect(invalidNameError).toBeInTheDocument()

  }),
  test('display error when pokemon is not found', async() => {
    render(<Main/>)

    const inputElement = screen.getByPlaceholderText(/Enter pokemon name.../i)

    const buttonElement = screen.getByDisplayValue(/search/i)

    await userEvent.type(inputElement, 'pikach')

    await userEvent.click(buttonElement)

    const invalidNameError = await screen.findByText(/Error: Pokemon "pikach" not found/i)

    expect(invalidNameError).toBeInTheDocument()
  })
})
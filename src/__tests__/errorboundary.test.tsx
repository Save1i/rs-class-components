import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi} from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'

function ErrorComp() {
  throw new Error('Test application error')

  return <></>
}

describe('Rendering Tests', () => {
  test('Displays fallback UI when error occurs', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary> 
        <ErrorComp/>
      </ErrorBoundary>
    )



    const errorElement = screen.getByText(/The application encountered an unexpected error./i)

    expect(errorElement).toBeInTheDocument()
  })

  test('logs error to console when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComp />
      </ErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})

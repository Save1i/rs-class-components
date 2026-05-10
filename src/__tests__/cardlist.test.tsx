import { render, screen } from '@testing-library/react'
import { describe, test, expect} from 'vitest'
import CardList from '../components/CardList'

describe('Rendering Tests', () => {
  test('Display the error', () => {
    render(
      <CardList
        item={[]}
        error={'error'}
      />
    )

    const errorElement = screen.getByText(/Error: error/i)

    expect(errorElement).toBeInTheDocument()
  })

})
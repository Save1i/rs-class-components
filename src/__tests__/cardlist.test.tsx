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
  }),
  test('renders pokemon list correctly', () => {
    const mockData = [
      {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        image: 'bulbasaur.png',
      },
    ]

    render(<CardList item={mockData} error="" />)

    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    expect(screen.getByText(/Height:/)).toBeInTheDocument()
    expect(screen.getByText(/Weight:/)).toBeInTheDocument()
  }),
  test('shows loading when item is null', () => {
    render(<CardList item={null} error="" />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  }),
  test('renders empty list correctly', () => {
    render(<CardList item={[]} error="" />)

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
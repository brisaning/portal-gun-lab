import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import { DimensionColumn } from './DimensionColumn'
import type { Character, DimensionalStone } from '../types/character'

const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Rick',
    status: 'alive',
    species: 'Human',
    origin_dimension: 'C-137',
    current_dimension: 'C-137',
    image_url: null,
    captured_at: '2024-01-01T00:00:00Z',
  },
]

const mockStones: DimensionalStone[] = [
  { id: 'stone-1', dimension: 'C-137', previous_character_id: 'old-1' },
]

describe('DimensionColumn', () => {
  it('muestra el nombre de la dimension', () => {
    render(<DimensionColumn dimension="C-137" characters={[]} />)
    expect(screen.getByRole('heading', { name: 'C-137' })).toBeInTheDocument()
  })

  it('muestra contador de personajes en singular', () => {
    render(<DimensionColumn dimension="C-137" characters={mockCharacters} />)
    expect(screen.getByText(/1 personaje/)).toBeInTheDocument()
  })

  it('muestra piedras cuando se pasan', () => {
    render(<DimensionColumn dimension="C-137" characters={[]} stones={mockStones} />)
    expect(screen.getByText(/Piedra dimensional/)).toBeInTheDocument()
  })

  it('muestra mensaje de arrastrar cuando no hay items', () => {
    render(<DimensionColumn dimension="C-137" characters={[]} />)
    expect(screen.getByText(/Arrastra personajes aquí/)).toBeInTheDocument()
  })

  it('muestra personaje cuando hay characters', () => {
    render(<DimensionColumn dimension="C-137" characters={mockCharacters} />)
    expect(screen.getByText('Rick')).toBeInTheDocument()
  })
})

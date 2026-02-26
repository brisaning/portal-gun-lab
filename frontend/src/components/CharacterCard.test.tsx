import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import { CharacterCard, CharacterCardOverlay } from './CharacterCard'
import type { Character } from '../types/character'

const baseCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'alive',
  species: 'Human',
  origin_dimension: 'C-137',
  current_dimension: 'C-137',
  image_url: null,
  captured_at: '2024-01-01T00:00:00Z',
}

describe('CharacterCard', () => {
  it('muestra nombre especie y estado', () => {
    render(<CharacterCard character={baseCharacter} />)
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
    expect(screen.getByText('alive')).toBeInTheDocument()
  })

  it('muestra etiqueta Origen cuando dimensiones coinciden', () => {
    render(<CharacterCard character={baseCharacter} />)
    expect(screen.getByText('Origen')).toBeInTheDocument()
  })

  it('no muestra Origen cuando current_dimension difiere', () => {
    const char = { ...baseCharacter, current_dimension: 'C-131' }
    render(<CharacterCard character={char} />)
    expect(screen.queryByText('Origen')).not.toBeInTheDocument()
  })
})

describe('CharacterCardOverlay', () => {
  it('muestra nombre y especie', () => {
    render(<CharacterCardOverlay character={baseCharacter} />)
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '../test-utils'
import { DndContext } from '@dnd-kit/core'
import { DimensionColumn } from '../../components/DimensionColumn'
import type { Character } from '../../types/character'

const initialCharacters: Character[] = [
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

describe('Integración: columnas y actualización de UI', () => {
  it('renderiza dos columnas con personajes repartidos', () => {
    const charsC137: Character[] = [initialCharacters[0]]
    const charsC131: Character[] = [
      { ...initialCharacters[0], id: '2', name: 'Morty', current_dimension: 'C-131' },
    ]

    render(
      <DndContext onDragEnd={() => {}} onDragStart={() => {}} onDragOver={() => {}}>
        <div>
          <DimensionColumn dimension="C-137" characters={charsC137} />
          <DimensionColumn dimension="C-131" characters={charsC131} />
        </div>
      </DndContext>
    )

    expect(screen.getByRole('heading', { name: 'C-137' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'C-131' })).toBeInTheDocument()
    expect(screen.getByText('Rick')).toBeInTheDocument()
    expect(screen.getByText('Morty')).toBeInTheDocument()
  })

  it('cada columna muestra su contador correcto', () => {
    render(
      <DndContext onDragEnd={() => {}} onDragStart={() => {}} onDragOver={() => {}}>
        <DimensionColumn dimension="C-137" characters={initialCharacters} />
      </DndContext>
    )
    expect(screen.getByText(/1 personaje/)).toBeInTheDocument()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Characters } from '../../pages/Characters'
import * as characterService from '../../services/characterService'
import type { Character } from '../../types/character'

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn(), custom: vi.fn() },
}))

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
  {
    id: '2',
    name: 'Morty',
    status: 'alive',
    species: 'Human',
    origin_dimension: 'C-137',
    current_dimension: 'C-131',
    image_url: null,
    captured_at: '2024-01-01T00:00:00Z',
  },
]

function Wrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('Flujo Characters - API mockeada', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra cargando y luego lista de personajes tras GET', async () => {
    vi.spyOn(characterService, 'getCharacters').mockResolvedValue(mockCharacters)

    render(
      <Wrapper>
        <Characters />
      </Wrapper>
    )

    expect(screen.getByText(/Cargando dimensiones/)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dimensiones' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Rick')).toBeInTheDocument()
      expect(screen.getByText('Morty')).toBeInTheDocument()
    })

    expect(characterService.getCharacters).toHaveBeenCalled()
  })

  it('muestra error cuando getCharacters falla', async () => {
    vi.spyOn(characterService, 'getCharacters').mockRejectedValue(new Error('Network error'))

    render(
      <Wrapper>
        <Characters />
      </Wrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })
})

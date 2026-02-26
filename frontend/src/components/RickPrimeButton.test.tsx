import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../test/test-utils'
import { RickPrimeButton } from './RickPrimeButton'
import * as rickPrimeService from '../services/rickPrimeService'
import * as insultService from '../services/insultService'

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    custom: vi.fn(),
  },
}))

const mockCharacter = {
  id: 'char-1',
  name: 'Morty',
  status: 'alive',
  species: 'Human',
  origin_dimension: 'C-137',
  current_dimension: 'C-137',
  image_url: null,
  captured_at: '2024-01-01T00:00:00Z',
}

describe('RickPrimeButton', () => {
  const onStealSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el botón con el texto esperado', () => {
    render(<RickPrimeButton onStealSuccess={onStealSuccess} />)
    expect(screen.getByRole('button', { name: /Rick Prime Attack/i })).toBeInTheDocument()
  })

  it('está deshabilitado cuando disabled es true', () => {
    render(<RickPrimeButton onStealSuccess={onStealSuccess} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('llama a onStealSuccess con id y dimensión cuando el robo tiene éxito', async () => {
    vi.spyOn(rickPrimeService, 'stealCharacter').mockResolvedValue(mockCharacter)
    vi.spyOn(insultService, 'getRandomInsult').mockResolvedValue({ insult: 'Test insult' })

    const user = userEvent.setup()
    render(<RickPrimeButton onStealSuccess={onStealSuccess} />)
    await user.click(screen.getByRole('button'))

    await vi.waitFor(() => {
      expect(onStealSuccess).toHaveBeenCalledWith('char-1', 'C-137')
    })
  })

  it('muestra animación durante el robo', async () => {
    vi.spyOn(rickPrimeService, 'stealCharacter').mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockCharacter), 100))
    )
    vi.spyOn(insultService, 'getRandomInsult').mockResolvedValue({ insult: 'x' })

    const user = userEvent.setup()
    render(<RickPrimeButton onStealSuccess={onStealSuccess} />)
    await user.click(screen.getByRole('button'))

    expect(screen.getByText(/Rick Prime Attack\.\.\./)).toBeInTheDocument()
    expect(screen.getByText(/¡Robo dimensional!/)).toBeInTheDocument()
  })

  it('no llama a onStealSuccess cuando stealCharacter devuelve null (404)', async () => {
    vi.spyOn(rickPrimeService, 'stealCharacter').mockResolvedValue(null as never)

    const user = userEvent.setup()
    render(<RickPrimeButton onStealSuccess={onStealSuccess} />)
    await user.click(screen.getByRole('button'))

    await vi.waitFor(() => {
      expect(onStealSuccess).not.toHaveBeenCalled()
    })
  })
})

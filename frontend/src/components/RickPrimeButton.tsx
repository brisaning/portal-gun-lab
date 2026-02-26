import { memo, useState } from 'react'
import toast from 'react-hot-toast'
import type { Character, DimensionalStone } from '../types/character'
import { NotificationToast } from './NotificationToast'
import { stealCharacter } from '../services/rickPrimeService'
import { getRandomInsult } from '../services/insultService'

const RICK_PRIME_INSULTS = [
  'Rick Prime se lo llevó. No había nada que hacer.',
  'Rick Prime ataca de nuevo. Patético.',
  'Rick Prime lo robó. Ese era mi favorito.',
  'Rick Prime se lo llevó. El multiverso es cruel.',
]

interface RickPrimeButtonProps {
  onStealSuccess: (updatedCharacter: Character, newStone: DimensionalStone) => void
  disabled?: boolean
}

function RickPrimeButtonComponent({
  onStealSuccess,
  disabled = false,
}: RickPrimeButtonProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [robbing, setRobbing] = useState(false)

  const handleAttack = async () => {
    if (robbing || disabled) return
    setRobbing(true)
    setShowAnimation(true)

    try {
      const { character, stone } = await stealCharacter()
      onStealSuccess(character, stone)
      toast.success(`⚡ Rick Prime stole ${character.name}! Ha! Pathetic!`, {
        duration: 5000,
        style: { background: '#1a0033', color: '#ff00ff', border: '1px solid #b300ff' },
      })

      setTimeout(() => {
        setShowAnimation(false)
        setRobbing(false)
        const specialInsult =
          RICK_PRIME_INSULTS[Math.floor(Math.random() * RICK_PRIME_INSULTS.length)]
        getRandomInsult()
          .then(({ insult }) => {
            const message = `${specialInsult} — ${insult}`
            toast.custom(
              (t) => (
                <NotificationToast
                  message={message}
                  visible={t.visible}
                  toastId={t.id}
                />
              ),
              { duration: 6000 }
            )
          })
          .catch(() => {
            toast.custom(
              (t) => (
                <NotificationToast
                  message={specialInsult}
                  visible={t.visible}
                  toastId={t.id}
                />
              ),
              { duration: 5000 }
            )
          })
      }, 1200)
    } catch {
      setShowAnimation(false)
      setRobbing(false)
      toast.error('No hay personajes para que Rick Prime robe')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAttack}
        disabled={disabled || robbing}
        className="rick-prime-button fixed bottom-8 right-8 z-50 rounded-full border-2 border-neon-bright/80 bg-dark-bg px-5 py-3 font-display text-sm font-bold text-neon-bright shadow-neon transition hover:border-neon-lime hover:shadow-neon disabled:opacity-50"
        title="Rick Prime roba un personaje aleatorio"
      >
        {robbing ? '...' : 'Rick Prime Attack'}
      </button>

      {showAnimation && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          aria-live="polite"
        >
          <div className="rick-prime-animation rounded-2xl border-2 border-neon-bright bg-dark-bg px-8 py-6 text-center shadow-neon">
            <p className="font-display text-xl font-bold text-neon-bright text-glow">
              Rick Prime Attack...
            </p>
            <p className="mt-2 text-neon-lime/90">¡Robo dimensional!</p>
          </div>
        </div>
      )}
    </>
  )
}

export const RickPrimeButton = memo(RickPrimeButtonComponent)

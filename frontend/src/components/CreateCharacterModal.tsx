import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { ALL_DIMENSIONS, RICK_PRIME_DIMENSION } from '../constants/dimensions'
import { createCharacter } from '../services/characterService'
import { getRandomInsult } from '../services/insultService'
import type { CharacterCreatePayload } from '../services/characterService'
import { NotificationToast } from './NotificationToast'

const DEFAULT_IMAGE_URL = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'

const SPECIES_OPTIONS = [
  { value: 'Humano', label: 'Humano' },
  { value: 'Alien', label: 'Alien' },
  { value: 'Robot', label: 'Robot' },
  { value: 'Monstruo', label: 'Monstruo' },
  { value: 'Desconocido', label: 'Desconocido' },
] as const

const STATUS_OPTIONS = [
  { value: 'alive', label: 'Vivo' },
  { value: 'dead', label: 'Muerto' },
  { value: 'unknown', label: 'Desconocido' },
  { value: 'captured', label: 'Capturado' },
] as const

interface CreateCharacterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const initialForm = {
  name: '',
  species: 'Humano',
  status: 'alive' as const,
  image_url: '',
  origin_dimension: 'C-137',
  current_dimension: 'C-137',
}

function CreateCharacterModalComponent({
  isOpen,
  onClose,
  onSuccess,
}: CreateCharacterModalProps) {
  const [form, setForm] = useState(initialForm)
  const [nameError, setNameError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const update = useCallback((updates: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates }
      if ('origin_dimension' in updates && updates.origin_dimension != null) {
        next.current_dimension = updates.origin_dimension
      }
      return next
    })
    setNameError('')
  }, [])

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm)
      setNameError('')
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedName = form.name.trim()
      if (!trimmedName) {
        setNameError('El nombre es obligatorio')
        return
      }

      setSubmitting(true)
      try {
        const payload: CharacterCreatePayload = {
          name: trimmedName,
          species: form.species,
          status: form.status,
          origin_dimension: form.origin_dimension,
          current_dimension: form.current_dimension,
          image_url: form.image_url.trim() || undefined,
        }
        if (!payload.image_url) {
          payload.image_url = DEFAULT_IMAGE_URL
        }
        if (form.current_dimension === RICK_PRIME_DIMENSION) {
          payload.stolen_by_rick_prime = true
        }

        const created = await createCharacter(payload)
        onSuccess()
        onClose()
        toast.success(`🧪 ${created.name} ha sido creado en ${created.current_dimension}!`, {
          duration: 4000,
          style: { background: '#0a0f0a', color: '#39ff14', border: '1px solid rgba(57,255,20,0.3)' },
        })
        getRandomInsult()
          .then(({ insult }) => {
            toast.custom(
              (t) => (
                <NotificationToast
                  message={`¡Otra criatura patética en ${created.current_dimension}! — ${insult}`}
                  visible={t.visible}
                  toastId={t.id}
                />
              ),
              { duration: 5000 }
            )
          })
          .catch(() => {})
      } catch {
        toast.error('¡Wubba Lubba Dub Dub! Algo salió mal en la creación')
      } finally {
        setSubmitting(false)
      }
    },
    [form, onClose, onSuccess]
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  if (!isOpen) return null

  const isPrimeCurrent = form.current_dimension === RICK_PRIME_DIMENSION

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-character-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-neon-bright bg-dark-bg/95 p-6 shadow-[0_0_30px_rgba(57,255,20,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-character-title"
          className="mb-6 font-display text-xl font-bold text-neon-bright text-glow"
        >
          🔬 Portal Gun Character Lab - Crear Nuevo Ser
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="create-name" className="mb-1 block text-sm font-medium text-neon/80">
              Nombre *
            </label>
            <input
              ref={nameInputRef}
              id="create-name"
              type="text"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright placeholder:text-neon/40 focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
              placeholder="Ej. Morty Smith"
              autoComplete="off"
            />
            {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
          </div>

          <div>
            <label htmlFor="create-species" className="mb-1 block text-sm font-medium text-neon/80">
              Especie
            </label>
            <select
              id="create-species"
              value={form.species}
              onChange={(e) => update({ species: e.target.value })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
            >
              {SPECIES_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="create-status" className="mb-1 block text-sm font-medium text-neon/80">
              Estado
            </label>
            <select
              id="create-status"
              value={form.status}
              onChange={(e) => update({ status: e.target.value as typeof form.status })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="create-image" className="mb-1 block text-sm font-medium text-neon/80">
              URL de Imagen (opcional)
            </label>
            <input
              id="create-image"
              type="url"
              value={form.image_url}
              onChange={(e) => update({ image_url: e.target.value })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright placeholder:text-neon/40 focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
              placeholder={DEFAULT_IMAGE_URL}
            />
          </div>

          <div>
            <label htmlFor="create-origin" className="mb-1 block text-sm font-medium text-neon/80">
              Dimensión de Origen
            </label>
            <select
              id="create-origin"
              value={form.origin_dimension}
              onChange={(e) => update({ origin_dimension: e.target.value })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
            >
              {ALL_DIMENSIONS.map((dim) => (
                <option key={dim} value={dim}>
                  {dim === RICK_PRIME_DIMENSION ? "🔮 Rick Prime's Trophies" : dim}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="create-current" className="mb-1 block text-sm font-medium text-neon/80">
              Dimensión Actual (donde aparecerá)
            </label>
            <select
              id="create-current"
              value={form.current_dimension}
              onChange={(e) => update({ current_dimension: e.target.value })}
              className="w-full rounded-lg border border-neon/40 bg-dark-deeper px-3 py-2 text-neon-bright focus:border-neon-bright focus:outline-none focus:ring-1 focus:ring-neon-bright"
            >
              {ALL_DIMENSIONS.map((dim) => (
                <option key={dim} value={dim}>
                  {dim === RICK_PRIME_DIMENSION ? "🔮 Rick Prime's Trophies" : dim}
                </option>
              ))}
            </select>
            {isPrimeCurrent && (
              <p className="mt-2 rounded-lg border border-amber-500/50 bg-amber-950/30 px-3 py-2 text-sm text-amber-200">
                ⚠️ Los personajes en la colección de Rick Prime no podrán moverse después.
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-neon/50 bg-dark-bg/80 px-4 py-2 font-display text-sm font-medium text-neon/80 transition hover:border-neon hover:text-neon-bright"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-neon-bright bg-neon-bright/10 px-4 py-2 font-display text-sm font-bold text-neon-bright shadow-neon transition hover:bg-neon-bright/20 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neon-bright border-t-transparent" />
                  Creando...
                </>
              ) : (
                'Generar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const CreateCharacterModal = memo(CreateCharacterModalComponent)

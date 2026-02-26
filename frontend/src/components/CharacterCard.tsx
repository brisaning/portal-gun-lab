import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { memo } from 'react'
import { CachedCharacterImage } from './CachedCharacterImage'
import type { Character } from '../types/character'

interface CharacterCardProps {
  character: Character
  isDragging?: boolean
}

function CharacterCardComponent({ character, isDragging = false }: CharacterCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: character.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dragging = isDragging || isSortableDragging
  const isOriginDimension = character.origin_dimension === character.current_dimension

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        card-neon-hover
        group relative flex cursor-grab active:cursor-grabbing
        gap-3 rounded-xl border bg-dark-bg/90 p-3
        ${dragging ? 'z-50 scale-105 opacity-90 shadow-neon' : 'border-neon/30'}
      `}
    >
      {/* Indicador de dimensión de origen */}
      {isOriginDimension && (
        <div
          className="absolute -top-1 right-3 rounded-b px-2 py-0.5 text-[10px] font-medium text-dark-bg bg-neon-lime/90"
          title="Dimensión de origen"
        >
          Origen
        </div>
      )}

      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neon/30 bg-dark-deeper">
        <CachedCharacterImage
          src={character.image_url}
          fallbackLetter={character.name.slice(0, 1)}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-neon-bright">
          {character.name}
        </p>
        <p className="truncate text-sm text-neon/80">{character.species}</p>
        <p className="mt-0.5 text-xs text-neon/60">{character.status}</p>
      </div>

      {dragging && (
        <div className="absolute inset-0 rounded-xl bg-neon/5 ring-2 ring-neon-bright/50" />
      )}
    </div>
  )
}

export const CharacterCard = memo(CharacterCardComponent)

/** Versión estática (no draggable) para la columna de Rick Prime */
function StaticCharacterCardComponent({ character }: { character: Character }) {
  const isOriginDimension = character.origin_dimension === character.current_dimension
  const isStolen = character.stolen_by_rick_prime

  return (
    <div
      className="group relative flex cursor-default gap-3 rounded-xl border border-neon/30 bg-dark-bg/90 p-3"
      title={isStolen ? 'Trofeo de Rick Prime' : undefined}
    >
      {isStolen && (
        <div
          className="absolute -top-1 left-3 rounded-b px-2 py-0.5 text-[10px] font-medium text-white bg-fuchsia-600/90"
          title="Robado por Rick Prime"
        >
          ⚡
        </div>
      )}
      {isOriginDimension && !isStolen && (
        <div
          className="absolute -top-1 right-3 rounded-b px-2 py-0.5 text-[10px] font-medium text-dark-bg bg-neon-lime/90"
          title="Dimensión de origen"
        >
          Origen
        </div>
      )}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neon/30 bg-dark-deeper">
        <CachedCharacterImage
          src={character.image_url}
          fallbackLetter={character.name.slice(0, 1)}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-neon-bright">
          {character.name}
        </p>
        <p className="truncate text-sm text-neon/80">{character.species}</p>
        <p className="mt-0.5 text-xs text-neon/60">{character.status}</p>
      </div>
    </div>
  )
}

export const StaticCharacterCard = memo(StaticCharacterCardComponent)

/** Versión para el overlay de arrastre (sin useSortable, solo visual) */
function CharacterCardOverlayComponent({ character }: { character: Character }) {
  const isOriginDimension = character.origin_dimension === character.current_dimension

  return (
    <div
      className="portal-move flex gap-3 rounded-xl border-2 border-neon-bright bg-dark-bg p-3 shadow-neon"
      style={{ width: 280 }}
    >
      {isOriginDimension && (
        <div className="absolute -top-1 right-3 rounded-b px-2 py-0.5 text-[10px] font-medium text-dark-bg bg-neon-lime/90">
          Origen
        </div>
      )}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neon/30 bg-dark-deeper">
        <CachedCharacterImage
          src={character.image_url}
          fallbackLetter={character.name.slice(0, 1)}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-neon-bright">
          {character.name}
        </p>
        <p className="truncate text-sm text-neon/80">{character.species}</p>
        <p className="text-xs text-neon/60">{character.status}</p>
      </div>
    </div>
  )
}

export const CharacterCardOverlay = memo(CharacterCardOverlayComponent)

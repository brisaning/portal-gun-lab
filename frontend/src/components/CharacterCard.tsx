import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Character } from '../types/character'

interface CharacterCardProps {
  character: Character
  isDragging?: boolean
}

export function CharacterCard({ character, isDragging = false }: CharacterCardProps) {
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
        group relative flex cursor-grab active:cursor-grabbing
        gap-3 rounded-xl border bg-dark-bg/90 p-3
        transition-all duration-200
        hover:border-neon-bright/60 hover:shadow-neon-sm
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
        {character.image_url ? (
          <img
            src={character.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-xl font-bold text-neon/60"
            aria-hidden
          >
            {character.name.slice(0, 1)}
          </div>
        )}
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

/** Versión para el overlay de arrastre (sin useSortable, solo visual) */
export function CharacterCardOverlay({ character }: { character: Character }) {
  const isOriginDimension = character.origin_dimension === character.current_dimension

  return (
    <div
      className="flex gap-3 rounded-xl border-2 border-neon-bright bg-dark-bg p-3 shadow-neon"
      style={{ width: 280 }}
    >
      {isOriginDimension && (
        <div className="absolute -top-1 right-3 rounded-b px-2 py-0.5 text-[10px] font-medium text-dark-bg bg-neon-lime/90">
          Origen
        </div>
      )}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neon/30 bg-dark-deeper">
        {character.image_url ? (
          <img
            src={character.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-neon/60">
            {character.name.slice(0, 1)}
          </div>
        )}
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

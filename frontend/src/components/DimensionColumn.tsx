import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Character, DimensionalStone } from '../types/character'
import { CharacterCard } from './CharacterCard'
import { DimensionalStoneCard } from './DimensionalStoneCard'
import { getDroppableId } from '../hooks/useDimensions'

interface DimensionColumnProps {
  dimension: string
  characters: Character[]
  stones?: DimensionalStone[]
  isOver?: boolean
}

export function DimensionColumn({
  dimension,
  characters,
  stones = [],
  isOver = false,
}: DimensionColumnProps) {
  const { setNodeRef, isOver: droppableIsOver } = useDroppable({
    id: getDroppableId(dimension),
  })

  const active = droppableIsOver || isOver
  const totalItems = characters.length + stones.length

  return (
    <div
      ref={setNodeRef}
      className={`
        flex min-h-[320px] w-72 flex-shrink-0 flex-col rounded-2xl border-2
        bg-dark-bg/50 p-4 backdrop-blur-sm transition-all duration-200
        hover:border-neon-bright/50 hover:shadow-neon-sm
        ${active ? 'border-neon-lime shadow-neon bg-dark-bg/70' : 'border-neon/30'}
      `}
    >
      <h3 className="mb-3 font-display text-lg font-bold text-neon-bright text-glow">
        {dimension}
      </h3>
      <p className="mb-3 text-xs text-neon/70">
        {characters.length} personaje{characters.length !== 1 ? 's' : ''}
        {stones.length > 0 && ` · ${stones.length} piedra${stones.length !== 1 ? 's' : ''}`}
      </p>

      <SortableContext
        items={characters.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {characters.map((char) => (
            <li key={char.id}>
              <CharacterCard character={char} />
            </li>
          ))}
          {stones.map((stone) => (
            <li key={stone.id}>
              <DimensionalStoneCard stone={stone} />
            </li>
          ))}
        </ul>
      </SortableContext>

      {totalItems === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neon/30 py-8 text-center text-sm text-neon/50">
          Arrastra personajes aquí
        </div>
      )}
    </div>
  )
}

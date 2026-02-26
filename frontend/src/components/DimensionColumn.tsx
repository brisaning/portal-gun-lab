import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useMemo, useRef } from 'react'
import type { Character, DimensionalStone } from '../types/character'
import { getDroppableId } from '../hooks/useDimensions'
import { CharacterCard } from './CharacterCard'
import { DimensionalStoneCard } from './DimensionalStoneCard'

const ROW_HEIGHT = 72
const VIRTUAL_THRESHOLD = 20

interface DimensionColumnProps {
  dimension: string
  characters: Character[]
  stones?: DimensionalStone[]
  isOver?: boolean
}

type RowItem =
  | { type: 'character'; data: Character }
  | { type: 'stone'; data: DimensionalStone }

function DimensionColumnComponent({
  dimension,
  characters,
  stones = [],
  isOver = false,
}: DimensionColumnProps) {
  const { setNodeRef, isOver: droppableIsOver } = useDroppable({
    id: getDroppableId(dimension),
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const active = droppableIsOver || isOver
  const totalItems = characters.length + stones.length

  const rows: RowItem[] = useMemo(
    () => [
      ...characters.map((c) => ({ type: 'character' as const, data: c })),
      ...stones.map((s) => ({ type: 'stone' as const, data: s })),
    ],
    [characters, stones]
  )

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  const useVirtual = totalItems > VIRTUAL_THRESHOLD

  return (
    <div
      ref={setNodeRef}
      className={`
        dimension-column-portal
        flex min-h-[320px] w-72 flex-shrink-0 flex-col rounded-2xl border-2
        bg-dark-bg/50 p-4 backdrop-blur-sm
        hover:border-neon-bright/60 hover:shadow-neon
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

      {totalItems === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neon/30 py-8 text-center text-sm text-neon/50">
          Arrastra personajes aquí
        </div>
      ) : (
        <SortableContext
          items={characters.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {useVirtual ? (
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto"
              style={{ maxHeight: '55vh' }}
            >
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const item = rows[virtualRow.index]
                  return (
                    <div
                      key={item.type === 'character' ? item.data.id : item.data.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="pb-2"
                    >
                      {item.type === 'character' ? (
                        <CharacterCard character={item.data} />
                      ) : (
                        <DimensionalStoneCard stone={item.data} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
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
          )}
        </SortableContext>
      )}
    </div>
  )
}

export const DimensionColumn = memo(DimensionColumnComponent)

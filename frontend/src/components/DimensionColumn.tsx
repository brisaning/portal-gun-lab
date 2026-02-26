import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useMemo, useRef } from 'react'
import type { Character, DimensionalStone } from '../types/character'
import { RICK_PRIME_DIMENSION } from '../constants/dimensions'
import { getDroppableId } from '../hooks/useDimensions'
import { CharacterCard, StaticCharacterCard } from './CharacterCard'
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
  const isPrimeColumn = dimension === RICK_PRIME_DIMENSION

  const columnTitle = isPrimeColumn ? "🔮 Trofeos de Rick Prime" : dimension
  const columnClassName = isPrimeColumn
    ? `prime-column dimension-column-portal flex min-h-[320px] w-72 flex-shrink-0 flex-col rounded-2xl border-2 p-4 backdrop-blur-sm
       border-[#b300ff] bg-gradient-to-br from-[#1a0033] to-[#330033] shadow-[0_0_20px_rgba(179,0,255,0.5)]
       hover:border-[#ff00ff] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]
       ${active ? 'border-[#ff00ff] shadow-[0_0_25px_rgba(255,0,255,0.6)]' : ''}`
    : `
        dimension-column-portal
        flex min-h-[320px] w-72 flex-shrink-0 flex-col rounded-2xl border-2
        bg-dark-bg/50 p-4 backdrop-blur-sm
        hover:border-neon-bright/60 hover:shadow-neon
        ${active ? 'border-neon-lime shadow-neon bg-dark-bg/70' : 'border-neon/30'}
      `

  return (
    <div ref={setNodeRef} className={columnClassName}>
      <h3
        className={`mb-3 font-display text-lg font-bold text-glow ${
          isPrimeColumn ? 'text-[#ff00ff] [text-shadow:0_0_10px_#ff00ff]' : 'text-neon-bright'
        }`}
      >
        {columnTitle}
      </h3>
      <p className="mb-3 text-xs text-neon/70">
        {characters.length} personaje{characters.length !== 1 ? 's' : ''}
        {stones.length > 0 && ` · ${stones.length} piedra${stones.length !== 1 ? 's' : ''}`}
      </p>

      {totalItems === 0 ? (
        <div
          className={`flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center text-sm ${
            isPrimeColumn ? 'border-[#b300ff]/50 text-[#ff00ff]/70' : 'border-neon/30 text-neon/50'
          }`}
        >
          {isPrimeColumn ? 'Los trofeos de Rick Prime aparecen aquí' : 'Arrastra personajes aquí'}
        </div>
      ) : isPrimeColumn ? (
        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {characters.map((char) => (
            <li key={char.id}>
              <StaticCharacterCard character={char} />
            </li>
          ))}
        </ul>
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

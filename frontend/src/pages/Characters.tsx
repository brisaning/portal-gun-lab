import { DndContext, DragOverlay, pointerWithin, type DragEndEvent } from '@dnd-kit/core'
import { useRef, useEffect } from 'react'
import { CharacterCardOverlay } from '../components/CharacterCard'
import { DimensionColumn } from '../components/DimensionColumn'
import { RickPrimeButton } from '../components/RickPrimeButton'
import { useDimensions } from '../hooks/useDimensions'

export function Characters() {
  const {
    dimensions,
    charactersByDimension,
    stonesByDimension,
    loading,
    error,
    activeId,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleRickPrimeSteal,
  } = useDimensions()

  const handleDragEndRef = useRef(handleDragEnd)
  useEffect(() => {
    handleDragEndRef.current = handleDragEnd
  }, [handleDragEnd])

  const onDragEnd = (event: DragEndEvent) => {
    console.log('🔥 [DndContext] onDragEnd disparado', event)
    handleDragEndRef.current(event)
  }

  const activeCharacter = activeId
    ? Object.values(charactersByDimension)
        .flat()
        .find((c) => c.id === activeId)
    : null

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-display text-neon-bright">Cargando dimensiones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-neon/30 bg-dark-bg/80 p-6 text-center">
        <p className="font-display text-neon-bright">Error</p>
        <p className="mt-2 text-sm text-neon/80">{error}</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h1 className="font-display text-2xl font-bold text-neon-bright text-glow">
        Dimensiones
      </h1>
      <p className="mt-2 font-sans text-neon/80">
        Arrastra personajes entre columnas para cambiar de dimensión.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="mt-8 flex flex-wrap gap-6 overflow-x-auto pb-4">
          {dimensions.map((dim) => (
            <DimensionColumn
              key={dim}
              dimension={dim}
              characters={charactersByDimension[dim] ?? []}
              stones={stonesByDimension[dim] ?? []}
            />
          ))}
        </div>

        <RickPrimeButton
          onStealSuccess={handleRickPrimeSteal}
          disabled={Object.values(charactersByDimension).flat().length === 0}
        />

        <DragOverlay dropAnimation={null}>
          {activeCharacter ? (
            <CharacterCardOverlay character={activeCharacter} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

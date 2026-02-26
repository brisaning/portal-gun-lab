import { DndContext, DragOverlay, pointerWithin, type DragEndEvent } from '@dnd-kit/core'
import { useRef, useEffect, useState } from 'react'
import { RICK_PRIME_DIMENSION } from '../constants/dimensions'
import { CharacterCardOverlay } from '../components/CharacterCard'
import { CreateCharacterModal } from '../components/CreateCharacterModal'
import { DimensionColumn } from '../components/DimensionColumn'
import { RickPrimeButton } from '../components/RickPrimeButton'
import { useDimensions } from '../hooks/useDimensions'

export function Characters() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const {
    characters,
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
    loadCharacters,
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neon-bright text-glow">
            Dimensiones
          </h1>
          <p className="mt-2 font-sans text-neon/80">
            Arrastra personajes entre columnas para cambiar de dimensión.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          title="Crear nuevo ser dimensional"
          className="rounded-xl border-2 border-neon-bright bg-neon-bright/10 px-4 py-2 font-display text-sm font-bold text-neon-bright shadow-[0_0_15px_rgba(57,255,20,0.4)] transition hover:bg-neon-bright/20 hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
        >
          🔬 Generar Personaje
        </button>
      </div>

      <CreateCharacterModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadCharacters}
      />

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

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          title="Crear nuevo ser dimensional"
          className="fixed bottom-8 left-8 z-50 rounded-full border-2 border-neon-bright/80 bg-dark-bg px-4 py-3 font-display text-sm font-bold text-neon-bright shadow-[0_0_15px_rgba(57,255,20,0.4)] transition hover:border-neon-lime hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
        >
          + Crear Personaje
        </button>

        <RickPrimeButton
          onStealSuccess={handleRickPrimeSteal}
          disabled={characters.filter((c) => c.current_dimension !== RICK_PRIME_DIMENSION).length === 0}
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

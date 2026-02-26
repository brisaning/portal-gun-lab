import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getCharacters, moveCharacter } from '../api/client'
import type { Character } from '../types/character'

const DROPPABLE_PREFIX = 'dim-'

export function getDroppableId(dimension: string): string {
  return `${DROPPABLE_PREFIX}${dimension}`
}

export function getDimensionFromDroppableId(droppableId: string): string | null {
  if (!droppableId.startsWith(DROPPABLE_PREFIX)) return null
  return droppableId.slice(DROPPABLE_PREFIX.length)
}

const DEFAULT_DIMENSIONS = ['C-137']

export function useDimensions() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const dimensions = useMemo(() => {
    const fromChars = Array.from(
      new Set(characters.map((c) => c.current_dimension).filter(Boolean))
    ).sort()
    if (fromChars.length === 0) return DEFAULT_DIMENSIONS
    return fromChars
  }, [characters])

  const charactersByDimension = useMemo(() => {
    const map: Record<string, Character[]> = {}
    for (const dim of dimensions) {
      map[dim] = characters
        .filter((c) => c.current_dimension === dim)
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    return map
  }, [characters, dimensions])

  const loadCharacters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCharacters()
      setCharacters(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al cargar personajes'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  const moveCharacterToDimension = useCallback(
    async (characterId: string, targetDimension: string) => {
      const character = characters.find((c) => c.id === characterId)
      if (!character) return
      if (character.current_dimension === targetDimension) return
      try {
        const updated = await moveCharacter(characterId, targetDimension)
        setCharacters((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )
        toast.success(
          `${updated.name} movido a ${targetDimension}`
        )
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Error al mover personaje'
        toast.error(message)
      }
    },
    [characters]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Optional: visual feedback during drag
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over?.id) return

      const activeId = active.id as string
      const overId = String(over.id)

      let targetDimension: string | null = getDimensionFromDroppableId(overId)
      if (targetDimension === null) {
        const overCharacter = characters.find((c) => c.id === overId)
        targetDimension = overCharacter?.current_dimension ?? null
      }
      if (targetDimension === null) return

      const character = characters.find((c) => c.id === activeId)
      if (!character) return
      if (character.current_dimension === targetDimension) return

      moveCharacterToDimension(activeId, targetDimension)
    },
    [characters, moveCharacterToDimension]
  )

  return {
    characters,
    setCharacters,
    dimensions,
    charactersByDimension,
    loading,
    error,
    activeId,
    loadCharacters,
    moveCharacterToDimension,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}

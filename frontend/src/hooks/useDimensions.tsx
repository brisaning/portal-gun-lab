import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { NotificationToast } from '../components/NotificationToast'
import { getCharacters, moveCharacter } from '../services/characterService'
import { getRandomInsult } from '../services/insultService'
import type { Character, DimensionalStone } from '../types/character'

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
  const [stones, setStones] = useState<DimensionalStone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const lastOverIdRef = useRef<string | null>(null)

  const dimensions = useMemo(() => {
    const fromChars = characters.map((c) => c.current_dimension).filter(Boolean)
    const fromStones = stones.map((s) => s.dimension)
    const all = Array.from(new Set([...fromChars, ...fromStones])).sort()
    if (all.length === 0) return DEFAULT_DIMENSIONS
    return all
  }, [characters, stones])

  const charactersByDimension = useMemo(() => {
    const map: Record<string, Character[]> = {}
    for (const dim of dimensions) {
      map[dim] = characters
        .filter((c) => c.current_dimension === dim)
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    return map
  }, [characters, dimensions])

  const stonesByDimension = useMemo(() => {
    const map: Record<string, DimensionalStone[]> = {}
    for (const dim of dimensions) {
      map[dim] = stones.filter((s) => s.dimension === dim)
    }
    return map
  }, [stones, dimensions])

  const loadCharacters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCharacters()
      setCharacters(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al cargar personajes'
      setError(message)
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
        toast.success(`${updated.name} movido a ${targetDimension}`)
        try {
          const { insult } = await getRandomInsult()
          toast.custom(
            (t) => (
              <NotificationToast
                message={insult}
                visible={t.visible}
                toastId={t.id}
              />
            ),
            { duration: 5000 }
          )
        } catch {
          // Insulto opcional; no bloquear si falla
        }
      } catch {
        // Error ya mostrado por el handler global de API
      }
    },
    [characters]
  )

  const handleRickPrimeSteal = useCallback(
    (stolenId: string, dimension: string) => {
      setCharacters((prev) => prev.filter((c) => c.id !== stolenId))
      setStones((prev) => [
        ...prev,
        { id: stolenId, dimension, previous_character_id: stolenId },
      ])
    },
    []
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    lastOverIdRef.current = null
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (event.over?.id != null) {
      lastOverIdRef.current = String(event.over.id)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      const overId = over?.id != null ? String(over.id) : lastOverIdRef.current
      lastOverIdRef.current = null
      setActiveId(null)

      if (!overId) return

      const activeId = active.id as string
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
    stones,
    dimensions,
    charactersByDimension,
    stonesByDimension,
    loading,
    error,
    activeId,
    loadCharacters,
    moveCharacterToDimension,
    handleRickPrimeSteal,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}

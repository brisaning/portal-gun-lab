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

const DEFAULT_DIMENSIONS = ['C-137', 'C-131']

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
    const all = Array.from(new Set([...DEFAULT_DIMENSIONS, ...fromChars, ...fromStones])).sort()
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

  /**
   * Mueve el personaje al backend y, si tiene éxito, obtiene y muestra el insulto de Rick.
   * Punto de disparo: llamado desde handleDragEnd después de resolver la dimensión objetivo.
   */
  const moveCharacterToDimension = useCallback(
    async (characterId: string, targetDimension: string) => {
      console.log('📤 [useDimensions] moveCharacterToDimension llamado', { characterId, targetDimension })
      const character = characters.find((c) => c.id === characterId)
      if (!character) {
        console.warn('moveCharacterToDimension: personaje no encontrado', characterId)
        return
      }
      if (character.current_dimension === targetDimension) {
        console.warn('moveCharacterToDimension: misma dimensión, omitiendo')
        return
      }

      // 1. Llamada API: mover personaje
      console.log('📡 [useDimensions] Llamando API moveCharacter...')
      const updated = await moveCharacter(characterId, targetDimension)
      console.log('📡 [useDimensions] moveCharacter OK', updated.name)

      // 2. Actualizar estado local
      setCharacters((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )

      // 3. Toast de movimiento exitoso
      toast.success(`${updated.name} movido a ${targetDimension}`)

      // 4. Solo si el movimiento fue exitoso: obtener y mostrar insulto de Rick
      try {
        console.log('📡 [useDimensions] Llamando API getRandomInsult...')
        const { insult } = await getRandomInsult()
        console.log('📡 [useDimensions] getRandomInsult OK', insult?.slice(0, 50))
        toast.custom(
          (t) => (
            <NotificationToast
              message={insult}
              visible={t.visible}
              toastId={t.id}
            />
          ),
          {
            duration: 5000,
            style: {
              border: '1px solid #39ff14',
              background: '#0a0f0a',
              color: '#39ff14',
            },
          }
        )
      } catch (insultError) {
        console.warn('Error al cargar insulto de Rick:', insultError)
        toast.error('No se pudo cargar el insulto de Rick')
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
    console.log('🟢 [useDimensions] handleDragStart', event.active.id)
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
      console.log('🎯 [useDimensions] handleDragEnd entrada', { active: event.active?.id, over: event.over?.id, lastOverRef: lastOverIdRef.current })

      const { active, over } = event
      const overId = over?.id != null ? String(over.id) : lastOverIdRef.current
      lastOverIdRef.current = null
      setActiveId(null)

      if (!overId) {
        console.log('⚠️ [useDimensions] Salida temprana: sin overId')
        return
      }

      const activeId = active.id as string
      let targetDimension: string | null = getDimensionFromDroppableId(overId)
      if (targetDimension === null) {
        const overCharacter = characters.find((c) => c.id === overId)
        targetDimension = overCharacter?.current_dimension ?? null
      }
      if (targetDimension === null) {
        console.log('⚠️ [useDimensions] Salida temprana: no se pudo resolver targetDimension para overId', overId)
        return
      }

      const character = characters.find((c) => c.id === activeId)
      if (!character) {
        console.log('⚠️ [useDimensions] Salida temprana: personaje no encontrado', activeId)
        return
      }
      if (character.current_dimension === targetDimension) {
        console.log('⚠️ [useDimensions] Salida temprana: misma dimensión', targetDimension)
        toast('Suelta en otra columna (dimensión) para mover y ver el insulto de Rick', {
          icon: '👆',
          duration: 4000,
          style: { background: '#0a0f0a', color: '#39ff14', border: '1px solid rgba(57,255,20,0.3)' },
        })
        return
      }

      console.log('✅ [useDimensions] Ejecutando movimiento', { activeId, targetDimension })
      void moveCharacterToDimension(activeId, targetDimension).catch((error) => {
        console.error('Error en Drag & Drop:', error)
        toast.error('¡Wubba Lubba Dub Dub! Algo salió mal.')
      })
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

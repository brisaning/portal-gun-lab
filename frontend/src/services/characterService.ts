import { api, getErrorMessage } from './api'
import type { Character, DimensionalStone } from '../types/character'

export interface CharacterCreatePayload {
  name: string
  status: string
  species: string
  origin_dimension: string
  current_dimension: string
  image_url?: string | null
  captured_at?: string
}

export interface CharacterUpdatePayload {
  name?: string
  status?: string
  species?: string
  origin_dimension?: string
  current_dimension?: string
  image_url?: string | null
  captured_at?: string
}

export async function getCharacters(
  dimension?: string
): Promise<Character[]> {
  const { data } = await api.get<Character[]>('/characters', {
    params: dimension ? { dimension } : undefined,
  })
  return data
}

export async function getStones(): Promise<DimensionalStone[]> {
  const { data } = await api.get<DimensionalStone[]>('/stones')
  return data
}

export async function createCharacter(
  payload: CharacterCreatePayload
): Promise<Character> {
  try {
    const { data } = await api.post<Character>('/characters', payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateCharacter(
  id: string,
  payload: CharacterUpdatePayload
): Promise<Character> {
  try {
    const { data } = await api.put<Character>(`/characters/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteCharacter(id: string): Promise<void> {
  try {
    await api.delete(`/characters/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function moveCharacter(
  id: string,
  targetDimension: string
): Promise<Character> {
  try {
    const { data } = await api.post<Character>(`/characters/${id}/move`, {
      target_dimension: targetDimension,
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

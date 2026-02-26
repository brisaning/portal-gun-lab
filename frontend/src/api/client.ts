import axios from 'axios'
import type { Character } from '../types/character'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export async function getCharacters(dimension?: string): Promise<Character[]> {
  const { data } = await api.get<Character[]>('/characters', {
    params: dimension ? { dimension } : undefined,
  })
  return data
}

export async function moveCharacter(
  id: string,
  targetDimension: string
): Promise<Character> {
  const { data } = await api.post<Character>(
    `/characters/${id}/move`,
    { target_dimension: targetDimension }
  )
  return data
}

export default api

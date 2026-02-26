import { api, getErrorMessage } from './api'
import type { Character } from '../types/character'

export async function stealCharacter(): Promise<Character> {
  try {
    const { data } = await api.post<Character>('/rick-prime/steal')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

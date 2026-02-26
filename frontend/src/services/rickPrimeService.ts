import { api, getErrorMessage } from './api'
import type { Character, DimensionalStone } from '../types/character'

export interface StealCharacterResponse {
  character: Character
  stone: DimensionalStone
}

export async function stealCharacter(): Promise<StealCharacterResponse> {
  try {
    const { data } = await api.post<StealCharacterResponse>('/rick-prime/steal')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

import { api, getErrorMessage } from './api'

export interface InsultResponse {
  insult: string
}

/**
 * Obtiene un insulto aleatorio de Rick desde GET /api/insults/random.
 * Usar después de un movimiento exitoso para mostrar en toast.
 */
export async function getRandomInsult(): Promise<InsultResponse> {
  try {
    const { data } = await api.get<InsultResponse>('/insults/random')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/** Alias para uso en flujo de Drag & Drop (mismo endpoint). */
export const fetchRandomInsult = getRandomInsult

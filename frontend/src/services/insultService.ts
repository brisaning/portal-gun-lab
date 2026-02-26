import { api, getErrorMessage } from './api'

export interface InsultResponse {
  insult: string
}

export async function getRandomInsult(): Promise<InsultResponse> {
  try {
    const { data } = await api.get<InsultResponse>('/insults/random')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

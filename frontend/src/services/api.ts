import axios, { type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

/** Contador de peticiones en curso para loading global */
let pendingRequests = 0

export type RequestHandlers = {
  onRequestStart?: () => void
  onRequestEnd?: () => void
  onError?: (message: string, error: AxiosError) => void
}

let handlers: RequestHandlers = {}

export function setRequestHandlers(h: RequestHandlers): void {
  handlers = { ...handlers, ...h }
}

function notifyStart(): void {
  pendingRequests++
  handlers.onRequestStart?.()
}

function notifyEnd(): void {
  pendingRequests--
  if (pendingRequests <= 0) {
    pendingRequests = 0
  }
  handlers.onRequestEnd?.()
}

/**
 * Extrae mensaje de error de la respuesta o del error de red.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data && typeof data === 'object') {
      if (typeof (data as { detail?: string }).detail === 'string') {
        return (data as { detail: string }).detail
      }
      if (typeof (data as { message?: string }).message === 'string') {
        return (data as { message: string }).message
      }
    }
    return error.message || 'Error de conexión'
  }
  if (error instanceof Error) return error.message
  return 'Error desconocido'
}

api.interceptors.request.use(
  (config) => {
    notifyStart()
    return config
  },
  (error) => {
    notifyEnd()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    notifyEnd()
    return response
  },
  (error: AxiosError) => {
    notifyEnd()
    const message = getErrorMessage(error)
    handlers.onError?.(message, error)
    return Promise.reject(error)
  }
)

export function getPendingRequestsCount(): number {
  return pendingRequests
}

export function isLoading(): boolean {
  return pendingRequests > 0
}

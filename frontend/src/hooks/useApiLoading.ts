import { useEffect, useState } from 'react'
import { setRequestHandlers } from '../services/api'

export interface UseApiHandlersOptions {
  onError?: (message: string) => void
}

/**
 * Hook que registra manejo global de API (loading + errores) y devuelve el estado de carga.
 * Usar una sola vez en la app (p. ej. en App).
 */
export function useApiHandlers(options: UseApiHandlersOptions = {}) {
  const { onError } = options
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setRequestHandlers({
      onRequestStart: () => setLoading(true),
      onRequestEnd: () => setLoading(false),
      onError: onError ? (_message, _err) => onError(_message) : undefined,
    })
    return () => setRequestHandlers({
      onRequestStart: undefined,
      onRequestEnd: undefined,
      onError: undefined,
    })
  }, [onError])

  return loading
}

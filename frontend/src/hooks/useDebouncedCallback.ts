import { useCallback, useRef } from 'react'

/**
 * Devuelve una versión con debounce de la función.
 * Solo ejecuta la última llamada después de `delay` ms sin nuevas llamadas.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        fnRef.current(...args)
      }, delay)
    },
    [delay]
  ) as T

  return debounced
}

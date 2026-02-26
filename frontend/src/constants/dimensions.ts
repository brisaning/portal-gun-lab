/** Dimensiones regulares entre las que se puede arrastrar personajes */
export const REGULAR_DIMENSIONS = ['C-137', 'C-131'] as const

/** ID de la columna especial de Rick Prime (solo entrada vía botón, no drag) */
export const RICK_PRIME_DIMENSION = 'RICK_PRIME_DIMENSION'

export const DIMENSIONS = {
  REGULAR: REGULAR_DIMENSIONS,
  PRIME: RICK_PRIME_DIMENSION,
} as const

export function isPrimeDimension(dimension: string): boolean {
  return dimension === RICK_PRIME_DIMENSION
}

export function isRegularDimension(dimension: string): boolean {
  return REGULAR_DIMENSIONS.includes(dimension as (typeof REGULAR_DIMENSIONS)[number])
}

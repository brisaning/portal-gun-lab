export interface Character {
  id: string
  name: string
  status: string
  species: string
  origin_dimension: string
  current_dimension: string
  image_url: string | null
  captured_at: string
  stolen_by_rick_prime?: boolean
  original_dimension?: string | null
}

export interface DimensionalStone {
  id: string
  dimension: string
  previous_character_id: string
}

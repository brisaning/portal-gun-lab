export interface Character {
  id: string
  name: string
  status: string
  species: string
  origin_dimension: string
  current_dimension: string
  image_url: string | null
  captured_at: string
}

export interface DimensionalStone {
  id: string
  dimension: string
  previous_character_id: string
}

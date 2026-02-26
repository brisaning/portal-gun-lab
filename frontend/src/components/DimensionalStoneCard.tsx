import type { DimensionalStone } from '../types/character'

interface DimensionalStoneCardProps {
  stone: DimensionalStone
}

export function DimensionalStoneCard({ stone }: DimensionalStoneCardProps) {
  return (
    <div
      className="dimensional-stone-card relative flex cursor-default items-center gap-3 rounded-xl border border-stone-600/80 bg-stone-900/90 p-3"
      title={`Piedra dimensional en ${stone.dimension} (Rick Prime)`}
    >
      <div className="dimensional-stone-rock h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neon/20 bg-stone-800">
        <div className="flex h-full w-full items-center justify-center text-2xl" aria-hidden>
          🪨
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-medium text-stone-400">
          Piedra dimensional
        </p>
        <p className="text-xs text-neon/70">Reemplazo de Rick Prime</p>
      </div>
    </div>
  )
}

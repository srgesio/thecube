'use client'

import type { Move } from '../core/cube-moves'

interface MoveHistoryProps {
  history: Move[]
}

export function MoveHistory({ history }: MoveHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-500">
        Nenhum movimento ainda
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-zinc-700 bg-zinc-800/50 p-3">
      {history.map((move, i) => (
        <span
          key={i}
          className="rounded bg-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-200"
        >
          {move}
        </span>
      ))}
    </div>
  )
}

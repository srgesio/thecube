'use client'

import { useCube } from '../hooks/use-cube'
import { MoveButtons } from './MoveButtons'
import { NotationInput } from './NotationInput'
import { MoveHistory } from './MoveHistory'
import { isSolved } from '../core/cube-model'

export function ControlPanel() {
  const { cubeState, history, applyMove, reset, undo, applyNotation } = useCube()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Controles</h2>
        {isSolved(cubeState) && history.length === 0 && (
          <span className="rounded-full bg-green-600/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
            Resolvido
          </span>
        )}
      </div>

      <div className="relative">
        <NotationInput onApply={applyNotation} />
      </div>

      <MoveButtons onMove={applyMove} />

      <div className="flex gap-2">
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="flex-1 rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Undo
        </button>
        <button
          onClick={reset}
          disabled={history.length === 0}
          className="flex-1 rounded-md border border-red-800 bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-zinc-400">
          Historico ({history.length})
        </h3>
        <MoveHistory history={history} />
      </div>
    </div>
  )
}

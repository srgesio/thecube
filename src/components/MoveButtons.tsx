'use client'

import type { Move } from '../core/cube-moves'

const MOVE_GROUPS: { label: string; moves: { label: string; value: Move }[] }[] = [
  {
    label: 'R',
    moves: [
      { label: 'R', value: 'R' },
      { label: "R'", value: "R'" },
      { label: 'R2', value: 'R2' },
    ],
  },
  {
    label: 'L',
    moves: [
      { label: 'L', value: 'L' },
      { label: "L'", value: "L'" },
      { label: 'L2', value: 'L2' },
    ],
  },
  {
    label: 'U',
    moves: [
      { label: 'U', value: 'U' },
      { label: "U'", value: "U'" },
      { label: 'U2', value: 'U2' },
    ],
  },
  {
    label: 'D',
    moves: [
      { label: 'D', value: 'D' },
      { label: "D'", value: "D'" },
      { label: 'D2', value: 'D2' },
    ],
  },
  {
    label: 'F',
    moves: [
      { label: 'F', value: 'F' },
      { label: "F'", value: "F'" },
      { label: 'F2', value: 'F2' },
    ],
  },
  {
    label: 'B',
    moves: [
      { label: 'B', value: 'B' },
      { label: "B'", value: "B'" },
      { label: 'B2', value: 'B2' },
    ],
  },
]

interface MoveButtonsProps {
  onMove: (move: Move) => void
}

export function MoveButtons({ onMove }: MoveButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {MOVE_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {group.moves.map((m) => (
            <button
              key={m.value}
              onClick={() => onMove(m.value)}
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 active:scale-95"
              style={{ backgroundColor: getMoveColor(m.value) }}
            >
              {m.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

function getMoveColor(move: Move): string {
  const base = move[0]
  const colors: Record<string, string> = {
    R: '#b90000',
    L: '#ff5900',
    U: '#555555',
    D: '#c8a600',
    F: '#009b48',
    B: '#0046ad',
  }
  return colors[base] ?? '#666'
}

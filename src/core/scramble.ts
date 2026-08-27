import type { CubeState } from './cube-model'
import { createSolvedCube, cloneCube } from './cube-model'
import type { Move } from './cube-moves'
import { applyMoves } from './cube-moves'

export interface ScrambleOptions {
  length?: number
  seed?: number
}

export interface ScrambleResult {
  cube: CubeState
  moves: Move[]
  notation: string
}

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
]

const FACE_OF: Record<Move, keyof CubeState> = {
  R: 'R', "R'": 'R', R2: 'R',
  L: 'L', "L'": 'L', L2: 'L',
  U: 'U', "U'": 'U', U2: 'U',
  D: 'D', "D'": 'D', D2: 'D',
  F: 'F', "F'": 'F', F2: 'F',
  B: 'B', "B'": 'B', B2: 'B',
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FREE: unique symbol = Symbol('free')
type FreeState = Move | typeof FREE

export function randomMove(rng: () => number): Move {
  const idx = Math.floor(rng() * ALL_MOVES.length)
  return ALL_MOVES[idx]
}

export function generateScramble(options?: ScrambleOptions): Move[] {
  const length = options?.length ?? 20
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : Math.random

  const moves: Move[] = []
  let last: FreeState = FREE
  let last2: FreeState = FREE

  while (moves.length < length) {
    const candidate = randomMove(rng)
    const face = FACE_OF[candidate]

    if (last !== FREE && FACE_OF[last as Move] === face) continue
    if (last2 !== FREE && candidate === last2) continue

    moves.push(candidate)
    last2 = last
    last = candidate
  }

  return moves
}

export function movesToNotation(moves: Move[]): string {
  return moves.join(' ')
}

export function scrambleCube(cube?: CubeState, options?: ScrambleOptions): ScrambleResult {
  const base = cube ?? createSolvedCube()
  const moves = generateScramble(options)
  const scrambled = applyMoves(cloneCube(base), moves)
  return {
    cube: scrambled,
    moves,
    notation: movesToNotation(moves),
  }
}

export function validateScramble(moves: Move[]): boolean {
  for (let i = 1; i < moves.length; i++) {
    if (FACE_OF[moves[i]] === FACE_OF[moves[i - 1]]) return false
  }
  for (let i = 2; i < moves.length; i++) {
    if (moves[i] === moves[i - 2]) return false
  }
  return true
}

import type { Face, CubeState } from './cube-model'
import { cloneCube } from './cube-model'

export type Move =
  | 'R' | "R'" | 'R2'
  | 'L' | "L'" | 'L2'
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'

export function rotateFaceCW(face: Face): Face {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

export function rotateFaceCCW(face: Face): Face {
  return [
    [face[0][2], face[1][2], face[2][2]],
    [face[0][1], face[1][1], face[2][1]],
    [face[0][0], face[1][0], face[2][0]],
  ]
}

function applyCW(cube: CubeState, fn: (s: CubeState) => void): CubeState {
  const c = cloneCube(cube)
  fn(c)
  return c
}

export function moveR(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.R = rotateFaceCW(c.R)
    const t = [c.U[0][2], c.U[1][2], c.U[2][2]]
    c.U[0][2] = c.F[0][2]; c.U[1][2] = c.F[1][2]; c.U[2][2] = c.F[2][2]
    c.F[0][2] = c.D[0][2]; c.F[1][2] = c.D[1][2]; c.F[2][2] = c.D[2][2]
    c.D[0][2] = c.B[2][0]; c.D[1][2] = c.B[1][0]; c.D[2][2] = c.B[0][0]
    c.B[0][0] = t[2]; c.B[1][0] = t[1]; c.B[2][0] = t[0]
  })
}

export function moveL(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.L = rotateFaceCW(c.L)
    const t = [c.U[0][0], c.U[1][0], c.U[2][0]]
    c.U[0][0] = c.B[2][2]; c.U[1][0] = c.B[1][2]; c.U[2][0] = c.B[0][2]
    c.B[0][2] = c.D[2][0]; c.B[1][2] = c.D[1][0]; c.B[2][2] = c.D[0][0]
    c.D[0][0] = c.F[0][0]; c.D[1][0] = c.F[1][0]; c.D[2][0] = c.F[2][0]
    c.F[0][0] = t[0]; c.F[1][0] = t[1]; c.F[2][0] = t[2]
  })
}

export function moveU(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.U = rotateFaceCW(c.U)
    const t = [c.F[0][0], c.F[0][1], c.F[0][2]]
    c.F[0][0] = c.L[0][0]; c.F[0][1] = c.L[0][1]; c.F[0][2] = c.L[0][2]
    c.L[0][0] = c.B[0][0]; c.L[0][1] = c.B[0][1]; c.L[0][2] = c.B[0][2]
    c.B[0][0] = c.R[0][0]; c.B[0][1] = c.R[0][1]; c.B[0][2] = c.R[0][2]
    c.R[0][0] = t[0]; c.R[0][1] = t[1]; c.R[0][2] = t[2]
  })
}

export function moveD(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.D = rotateFaceCW(c.D)
    const t = [c.F[2][0], c.F[2][1], c.F[2][2]]
    c.F[2][0] = c.R[2][0]; c.F[2][1] = c.R[2][1]; c.F[2][2] = c.R[2][2]
    c.R[2][0] = c.B[0][0]; c.R[2][1] = c.B[0][1]; c.R[2][2] = c.B[0][2]
    c.B[0][0] = c.L[0][0]; c.B[0][1] = c.L[0][1]; c.B[0][2] = c.L[0][2]
    c.L[0][0] = t[0]; c.L[0][1] = t[1]; c.L[0][2] = t[2]
  })
}

export function moveF(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.F = rotateFaceCW(c.F)
    const t = [c.U[2][0], c.U[2][1], c.U[2][2]]
    c.U[2][0] = c.L[2][2]; c.U[2][1] = c.L[1][2]; c.U[2][2] = c.L[0][2]
    c.L[0][2] = c.D[0][0]; c.L[1][2] = c.D[0][1]; c.L[2][2] = c.D[0][2]
    c.D[0][0] = c.R[2][0]; c.D[0][1] = c.R[1][0]; c.D[0][2] = c.R[0][0]
    c.R[0][0] = t[0]; c.R[1][0] = t[1]; c.R[2][0] = t[2]
  })
}

export function moveB(cube: CubeState): CubeState {
  return applyCW(cube, (c) => {
    c.B = rotateFaceCW(c.B)
    const t = [c.U[0][0], c.U[0][1], c.U[0][2]]
    c.U[0][0] = c.R[0][2]; c.U[0][1] = c.R[1][2]; c.U[0][2] = c.R[2][2]
    c.R[0][2] = c.D[2][2]; c.R[1][2] = c.D[2][1]; c.R[2][2] = c.D[2][0]
    c.D[2][0] = c.L[0][0]; c.D[2][1] = c.L[1][0]; c.D[2][2] = c.L[2][0]
    c.L[0][0] = t[2]; c.L[1][0] = t[1]; c.L[2][0] = t[0]
  })
}

const CW_FNS: Record<string, (c: CubeState) => CubeState> = {
  R: moveR, L: moveL, U: moveU, D: moveD, F: moveF, B: moveB,
}

export function applyMove(cube: CubeState, move: Move): CubeState {
  const base = move.replace(/[']|2/g, '') as keyof typeof CW_FNS
  const fn = CW_FNS[base]
  if (move.endsWith('2')) return fn(fn(cube))
  if (move.endsWith("'")) return fn(fn(fn(cube)))
  return fn(cube)
}

export function applyMoves(cube: CubeState, moves: Move[]): CubeState {
  return moves.reduce((c, m) => applyMove(c, m), cube)
}

export type Face = string[][]

export interface CubeState {
  U: Face
  D: Face
  F: Face
  B: Face
  L: Face
  R: Face
}

const FACE_COLORS: Record<keyof CubeState, string> = {
  U: 'W',
  D: 'Y',
  F: 'G',
  B: 'B',
  L: 'O',
  R: 'R',
}

function createFace(color: string): Face {
  return [
    [color, color, color],
    [color, color, color],
    [color, color, color],
  ]
}

export function createSolvedCube(): CubeState {
  return {
    U: createFace(FACE_COLORS.U),
    D: createFace(FACE_COLORS.D),
    F: createFace(FACE_COLORS.F),
    B: createFace(FACE_COLORS.B),
    L: createFace(FACE_COLORS.L),
    R: createFace(FACE_COLORS.R),
  }
}

export function cloneCube(cube: CubeState): CubeState {
  return {
    U: cube.U.map((row) => [...row]),
    D: cube.D.map((row) => [...row]),
    F: cube.F.map((row) => [...row]),
    B: cube.B.map((row) => [...row]),
    L: cube.L.map((row) => [...row]),
    R: cube.R.map((row) => [...row]),
  }
}

export function isSolved(cube: CubeState): boolean {
  const faces: Array<keyof CubeState> = ['U', 'D', 'F', 'B', 'L', 'R']
  for (const face of faces) {
    const color = FACE_COLORS[face]
    for (const row of cube[face]) {
      for (const sticker of row) {
        if (sticker !== color) return false
      }
    }
  }
  return true
}

export function cubeToString(cube: CubeState): string {
  const faces: Array<keyof CubeState> = ['U', 'D', 'F', 'B', 'L', 'R']
  return faces
    .map((face) => {
      const rows = cube[face].map((row) => row.join(' ')).join('\n  ')
      return `${face}:\n  ${rows}`
    })
    .join('\n')
}

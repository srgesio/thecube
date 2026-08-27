import type { CubeState } from './cube-model'

export const STICKER_COLORS = ['W', 'Y', 'G', 'B', 'O', 'R'] as const

export type FaceName = 'U' | 'D' | 'F' | 'B' | 'L' | 'R'

export type FaceConfig = Record<FaceName, string[]>

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const VALID_COLOR_SET = new Set(STICKER_COLORS)

const EXPECTED_COLOR_COUNT = 9

export function buildCubeState(faces: FaceConfig): CubeState {
  return {
    U: toGrid(faces.U),
    D: toGrid(faces.D),
    F: toGrid(faces.F),
    B: toGrid(faces.B),
    L: toGrid(faces.L),
    R: toGrid(faces.R),
  }
}

export function validateFaceConfig(faces: FaceConfig): ValidationResult {
  const errors: string[] = []
  const faceNames: FaceName[] = ['U', 'D', 'F', 'B', 'L', 'R']

  for (const name of faceNames) {
    const stickers = faces[name]
    if (!stickers || !Array.isArray(stickers)) {
      errors.push(`Face ${name}: nao encontrada ou invalida`)
      continue
    }
    if (stickers.length !== 9) {
      errors.push(`Face ${name}: deve ter 9 stickers, encontrado ${stickers.length}`)
      continue
    }
    for (let i = 0; i < stickers.length; i++) {
      if (!VALID_COLOR_SET.has(stickers[i] as (typeof STICKER_COLORS)[number])) {
        errors.push(
          `Face ${name}: cor invalida "${stickers[i]}" na posicao ${i}. Cores validas: ${STICKER_COLORS.join(', ')}`,
        )
      }
    }
  }

  if (errors.length === 0) {
    const colorCounts = new Map<string, number>()
    for (const name of faceNames) {
      for (const color of faces[name]) {
        colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1)
      }
    }
    for (const [color, count] of colorCounts) {
      if (count !== EXPECTED_COLOR_COUNT) {
        errors.push(
          `Cor "${color}" aparece ${count} vezes, mas deve aparecer exatamente ${EXPECTED_COLOR_COUNT}`,
        )
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

export function faceConfigFromCubeState(cube: CubeState): FaceConfig {
  return {
    U: toFlat(cube.U),
    D: toFlat(cube.D),
    F: toFlat(cube.F),
    B: toFlat(cube.B),
    L: toFlat(cube.L),
    R: toFlat(cube.R),
  }
}

function toGrid(stickers: string[]): string[][] {
  return [
    [stickers[0], stickers[1], stickers[2]],
    [stickers[3], stickers[4], stickers[5]],
    [stickers[6], stickers[7], stickers[8]],
  ]
}

function toFlat(grid: string[][]): string[] {
  return grid.flat()
}

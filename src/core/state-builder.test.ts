import { describe, it, expect } from 'vitest'
import {
  buildCubeState,
  validateFaceConfig,
  faceConfigFromCubeState,
  STICKER_COLORS,
} from './state-builder'
import { createSolvedCube, isSolved } from './cube-model'
import type { FaceConfig } from './state-builder'

const VALID_FACES: FaceConfig = {
  U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  F: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
  L: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
}

const VALID_SCRAMBLED: FaceConfig = {
  U: ['Y', 'G', 'B', 'O', 'R', 'W', 'W', 'W', 'W'],
  D: ['W', 'G', 'B', 'O', 'R', 'Y', 'Y', 'Y', 'Y'],
  F: ['W', 'Y', 'B', 'O', 'R', 'G', 'G', 'G', 'G'],
  B: ['W', 'Y', 'G', 'O', 'R', 'B', 'B', 'B', 'B'],
  L: ['W', 'Y', 'G', 'B', 'R', 'O', 'O', 'O', 'O'],
  R: ['W', 'Y', 'G', 'B', 'O', 'R', 'R', 'R', 'R'],
}

describe('StateBuilder', () => {
  describe('STICKER_COLORS', () => {
    it('should contain 6 valid colors', () => {
      expect(STICKER_COLORS).toHaveLength(6)
      expect(STICKER_COLORS).toEqual(['W', 'Y', 'G', 'B', 'O', 'R'])
    })
  })

  describe('buildCubeState', () => {
    it('should return a valid CubeState from correct config', () => {
      const cube = buildCubeState(VALID_FACES)
      expect(cube).toHaveProperty('U')
      expect(cube).toHaveProperty('D')
      expect(cube).toHaveProperty('F')
      expect(cube).toHaveProperty('B')
      expect(cube).toHaveProperty('L')
      expect(cube).toHaveProperty('R')
    })

    it('each face should be a 3x3 grid', () => {
      const cube = buildCubeState(VALID_FACES)
      const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const
      for (const face of faces) {
        expect(cube[face]).toHaveLength(3)
        for (const row of cube[face]) {
          expect(row).toHaveLength(3)
        }
      }
    })

    it('should build the solved cube correctly', () => {
      const cube = buildCubeState(VALID_FACES)
      expect(isSolved(cube)).toBe(true)
    })

    it('should map row-major stickers to 3x3 grid', () => {
      const config: FaceConfig = {
        U: ['W', 'Y', 'G', 'B', 'O', 'R', 'W', 'Y', 'G'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const cube = buildCubeState(config)
      expect(cube.U[0]).toEqual(['W', 'Y', 'G'])
      expect(cube.U[1]).toEqual(['B', 'O', 'R'])
      expect(cube.U[2]).toEqual(['W', 'Y', 'G'])
    })

    it('should handle a scrambled configuration', () => {
      const cube = buildCubeState(VALID_SCRAMBLED)
      const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const
      for (const face of faces) {
        expect(cube[face][0][0]).toBe(VALID_SCRAMBLED[face][0])
        expect(cube[face][1][1]).toBe(VALID_SCRAMBLED[face][4])
        expect(cube[face][2][2]).toBe(VALID_SCRAMBLED[face][8])
      }
    })
  })

  describe('validateFaceConfig', () => {
    it('should return valid for a correct solved configuration', () => {
      const result = validateFaceConfig(VALID_FACES)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return valid for a correct scrambled configuration', () => {
      const result = validateFaceConfig(VALID_SCRAMBLED)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject face with wrong number of stickers (too few)', () => {
      const config: FaceConfig = {
        U: ['W', 'W', 'W', 'W', 'W'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject face with wrong number of stickers (too many)', () => {
      const config: FaceConfig = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject invalid color characters', () => {
      const config: FaceConfig = {
        U: ['X', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('X') || e.includes('cor'))).toBe(true)
    })

    it('should reject lowercase color characters', () => {
      const config: FaceConfig = {
        U: ['w', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject cube with wrong color count', () => {
      const config: FaceConfig = {
        U: ['Y', 'G', 'B', 'O', 'R', 'W', 'W', 'W', 'W'],
        D: VALID_FACES.D,
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: ['W', 'Y', 'G', 'B', 'O', 'R', 'R', 'R', 'W'],
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('vezes'))).toBe(true)
    })

    it('should reject cube with too many of one color', () => {
      const config: FaceConfig = {
        U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        D: ['W', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
        F: VALID_FACES.F,
        B: VALID_FACES.B,
        L: VALID_FACES.L,
        R: VALID_FACES.R,
      }
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('vezes'))).toBe(true)
    })

    it('should reject empty face config', () => {
      const config = {} as FaceConfig
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('faceConfigFromCubeState', () => {
    it('should convert CubeState to FaceConfig', () => {
      const cube = createSolvedCube()
      const config = faceConfigFromCubeState(cube)
      expect(config.U).toEqual(['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'])
      expect(config.D).toEqual(['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'])
      expect(config.F).toEqual(['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'])
      expect(config.B).toEqual(['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'])
      expect(config.L).toEqual(['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'])
      expect(config.R).toEqual(['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'])
    })

    it('each face config should have 9 elements', () => {
      const cube = createSolvedCube()
      const config = faceConfigFromCubeState(cube)
      const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const
      for (const face of faces) {
        expect(config[face]).toHaveLength(9)
      }
    })

    it('should flatten 3x3 grid to row-major array', () => {
      const cube = createSolvedCube()
      cube.U = [
        ['R', 'G', 'W'],
        ['O', 'W', 'Y'],
        ['B', 'R', 'G'],
      ]
      const config = faceConfigFromCubeState(cube)
      expect(config.U).toEqual(['R', 'G', 'W', 'O', 'W', 'Y', 'B', 'R', 'G'])
    })

    it('should be validated as correct by validateFaceConfig', () => {
      const cube = createSolvedCube()
      const config = faceConfigFromCubeState(cube)
      const result = validateFaceConfig(config)
      expect(result.valid).toBe(true)
    })
  })

  describe('roundtrip (buildCubeState <-> faceConfigFromCubeState)', () => {
    it('should be inverses for solved cube', () => {
      const original = createSolvedCube()
      const config = faceConfigFromCubeState(original)
      const rebuilt = buildCubeState(config)
      expect(rebuilt).toEqual(original)
    })

    it('should be inverses for scrambled cube', () => {
      const cube = buildCubeState(VALID_SCRAMBLED)
      const config = faceConfigFromCubeState(cube)
      const rebuilt = buildCubeState(config)
      expect(rebuilt).toEqual(cube)
    })

    it('roundtrip result should pass validateFaceConfig', () => {
      const cube = buildCubeState(VALID_SCRAMBLED)
      const config = faceConfigFromCubeState(cube)
      const rebuilt = buildCubeState(config)
      const rebuiltConfig = faceConfigFromCubeState(rebuilt)
      const result = validateFaceConfig(rebuiltConfig)
      expect(result.valid).toBe(true)
    })
  })
})

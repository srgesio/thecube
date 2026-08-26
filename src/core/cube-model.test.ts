import { describe, it, expect } from 'vitest'
import { createSolvedCube, cloneCube, isSolved, cubeToString } from './cube-model'
import type { CubeState } from './cube-model'

describe('CubeModel', () => {
  describe('createSolvedCube', () => {
    it('should return a cube with 6 faces', () => {
      const cube = createSolvedCube()
      expect(cube).toHaveProperty('U')
      expect(cube).toHaveProperty('D')
      expect(cube).toHaveProperty('F')
      expect(cube).toHaveProperty('B')
      expect(cube).toHaveProperty('L')
      expect(cube).toHaveProperty('R')
    })

    it('each face should be a 3x3 grid', () => {
      const cube = createSolvedCube()
      const faces: Array<keyof CubeState> = ['U', 'D', 'F', 'B', 'L', 'R']
      for (const face of faces) {
        expect(cube[face]).toHaveLength(3)
        for (const row of cube[face]) {
          expect(row).toHaveLength(3)
        }
      }
    })

    it('U face should be all White', () => {
      const cube = createSolvedCube()
      for (const row of cube.U) {
        expect(row).toEqual(['W', 'W', 'W'])
      }
    })

    it('D face should be all Yellow', () => {
      const cube = createSolvedCube()
      for (const row of cube.D) {
        expect(row).toEqual(['Y', 'Y', 'Y'])
      }
    })

    it('F face should be all Green', () => {
      const cube = createSolvedCube()
      for (const row of cube.F) {
        expect(row).toEqual(['G', 'G', 'G'])
      }
    })

    it('B face should be all Blue', () => {
      const cube = createSolvedCube()
      for (const row of cube.B) {
        expect(row).toEqual(['B', 'B', 'B'])
      }
    })

    it('L face should be all Orange', () => {
      const cube = createSolvedCube()
      for (const row of cube.L) {
        expect(row).toEqual(['O', 'O', 'O'])
      }
    })

    it('R face should be all Red', () => {
      const cube = createSolvedCube()
      for (const row of cube.R) {
        expect(row).toEqual(['R', 'R', 'R'])
      }
    })
  })

  describe('cloneCube', () => {
    it('should return a deep clone (not the same reference)', () => {
      const cube = createSolvedCube()
      const cloned = cloneCube(cube)
      expect(cloned).not.toBe(cube)
      expect(cloned.U).not.toBe(cube.U)
      expect(cloned.U[0]).not.toBe(cube.U[0])
    })

    it('should have the same values', () => {
      const cube = createSolvedCube()
      const cloned = cloneCube(cube)
      expect(cloned).toEqual(cube)
    })

    it('mutations on clone should not affect original', () => {
      const cube = createSolvedCube()
      const cloned = cloneCube(cube)
      cloned.U[0][0] = 'X'
      expect(cube.U[0][0]).toBe('W')
    })
  })

  describe('isSolved', () => {
    it('should return true for a solved cube', () => {
      const cube = createSolvedCube()
      expect(isSolved(cube)).toBe(true)
    })

    it('should return false when a sticker is changed', () => {
      const cube = createSolvedCube()
      cube.U[0][0] = 'R'
      expect(isSolved(cube)).toBe(false)
    })
  })

  describe('cubeToString', () => {
    it('should return a string representation', () => {
      const cube = createSolvedCube()
      const str = cubeToString(cube)
      expect(typeof str).toBe('string')
      expect(str.length).toBeGreaterThan(0)
    })

    it('should contain all face labels', () => {
      const cube = createSolvedCube()
      const str = cubeToString(cube)
      expect(str).toContain('U:')
      expect(str).toContain('D:')
      expect(str).toContain('F:')
      expect(str).toContain('B:')
      expect(str).toContain('L:')
      expect(str).toContain('R:')
    })
  })
})

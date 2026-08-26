import { describe, it, expect } from 'vitest'
import { createSolvedCube, cloneCube, isSolved } from './cube-model'
import {
  rotateFaceCW,
  rotateFaceCCW,
  moveR,
  moveL,
  moveU,
  moveD,
  moveF,
  moveB,
  applyMove,
  applyMoves,
} from './cube-moves'
import type { Move } from './cube-moves'
import type { CubeState } from './cube-model'

function faceEqual(face: CubeState[keyof CubeState], color: string): boolean {
  return face.every((row) => row.every((s) => s === color))
}

describe('CubeMoves', () => {
  describe('rotateFaceCW', () => {
    it('should rotate a 3x3 face clockwise', () => {
      const face = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ]
      const result = rotateFaceCW(face)
      expect(result).toEqual([
        ['7', '4', '1'],
        ['8', '5', '2'],
        ['9', '6', '3'],
      ])
    })
  })

  describe('rotateFaceCCW', () => {
    it('should rotate a 3x3 face counter-clockwise', () => {
      const face = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ]
      const result = rotateFaceCCW(face)
      expect(result).toEqual([
        ['3', '6', '9'],
        ['2', '5', '8'],
        ['1', '4', '7'],
      ])
    })
  })

  describe('individual moves on solved cube', () => {
    it('moveR should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveR(cube)
      expect(moved).not.toEqual(cube)
    })

    it('moveL should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveL(cube)
      expect(moved).not.toEqual(cube)
    })

    it('moveU should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveU(cube)
      expect(moved).not.toEqual(cube)
    })

    it('moveD should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveD(cube)
      expect(moved).not.toEqual(cube)
    })

    it('moveF should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveF(cube)
      expect(moved).not.toEqual(cube)
    })

    it('moveB should change the cube', () => {
      const cube = createSolvedCube()
      const moved = moveB(cube)
      expect(moved).not.toEqual(cube)
    })
  })

  describe('move immutability', () => {
    it('should not mutate the original cube', () => {
      const cube = createSolvedCube()
      const original = cloneCube(cube)
      moveR(cube)
      moveL(cube)
      moveU(cube)
      moveD(cube)
      moveF(cube)
      moveB(cube)
      expect(cube).toEqual(original)
    })
  })

  describe('inverse moves', () => {
    it('R then R\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'R')
      cube = applyMove(cube, "R'")
      expect(isSolved(cube)).toBe(true)
    })

    it('L then L\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'L')
      cube = applyMove(cube, "L'")
      expect(isSolved(cube)).toBe(true)
    })

    it('U then U\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'U')
      cube = applyMove(cube, "U'")
      expect(isSolved(cube)).toBe(true)
    })

    it('D then D\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'D')
      cube = applyMove(cube, "D'")
      expect(isSolved(cube)).toBe(true)
    })

    it('F then F\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'F')
      cube = applyMove(cube, "F'")
      expect(isSolved(cube)).toBe(true)
    })

    it('B then B\' should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'B')
      cube = applyMove(cube, "B'")
      expect(isSolved(cube)).toBe(true)
    })
  })

  describe('double moves (X2)', () => {
    it('R2 applied twice should return to solved', () => {
      let cube = createSolvedCube()
      cube = applyMove(cube, 'R2')
      cube = applyMove(cube, 'R2')
      expect(isSolved(cube)).toBe(true)
    })

    it('R then R should equal R2', () => {
      const cube = createSolvedCube()
      const rr = applyMove(applyMove(cube, 'R'), 'R')
      const r2 = applyMove(cube, 'R2')
      expect(rr).toEqual(r2)
    })
  })

  describe('sexy move (R U R\' U\') x6 = solved', () => {
    it('should return to solved after 6 repetitions', () => {
      let cube = createSolvedCube()
      for (let i = 0; i < 6; i++) {
        cube = applyMove(cube, 'R')
        cube = applyMove(cube, 'U')
        cube = applyMove(cube, "R'")
        cube = applyMove(cube, "U'")
      }
      expect(isSolved(cube)).toBe(true)
    })
  })

  describe('applyMove', () => {
    it('should accept all 18 move types', () => {
      const moves: Move[] = [
        'R', "R'", 'R2',
        'L', "L'", 'L2',
        'U', "U'", 'U2',
        'D', "D'", 'D2',
        'F', "F'", 'F2',
        'B', "B'", 'B2',
      ]
      const cube = createSolvedCube()
      for (const move of moves) {
        const result = applyMove(cube, move)
        expect(result).toBeDefined()
        expect(result).not.toBe(cube)
      }
    })
  })

  describe('applyMoves', () => {
    it('should apply a sequence of moves', () => {
      const cube = createSolvedCube()
      const result = applyMoves(cube, ['R', 'U', "R'", "U'"])
      expect(result).toBeDefined()
      expect(result).not.toEqual(cube)
    })

    it('empty sequence should return same state', () => {
      const cube = createSolvedCube()
      const result = applyMoves(cube, [])
      expect(result).toEqual(cube)
    })

    it('sexy move sequence via applyMoves', () => {
      let cube = createSolvedCube()
      for (let i = 0; i < 6; i++) {
        cube = applyMoves(cube, ['R', 'U', "R'", "U'"])
      }
      expect(isSolved(cube)).toBe(true)
    })
  })
})

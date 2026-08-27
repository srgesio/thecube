import { describe, it, expect } from 'vitest'
import {
  generateScramble,
  scrambleCube,
  movesToNotation,
  validateScramble,
  randomMove,
  mulberry32,
} from './scramble'
import { createSolvedCube, isSolved, cloneCube } from './cube-model'
import { applyMoves, type Move } from './cube-moves'
import { parseNotation } from './cube-notation'

const FACE_OF: Record<string, string> = {
  R: 'R',
  "R'": 'R',
  R2: 'R',
  L: 'L',
  "L'": 'L',
  L2: 'L',
  U: 'U',
  "U'": 'U',
  U2: 'U',
  D: 'D',
  "D'": 'D',
  D2: 'D',
  F: 'F',
  "F'": 'F',
  F2: 'F',
  B: 'B',
  "B'": 'B',
  B2: 'B',
}

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
]

describe('ScrambleGenerator', () => {
  describe('mulberry32', () => {
    it('is deterministic for the same seed', () => {
      const a = mulberry32(42)
      const b = mulberry32(42)
      const seqA = Array.from({ length: 10 }, () => a())
      const seqB = Array.from({ length: 10 }, () => b())
      expect(seqA).toEqual(seqB)
    })

    it('produces numbers in [0, 1)', () => {
      const rng = mulberry32(1)
      for (let i = 0; i < 100; i++) {
        const v = rng()
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThan(1)
      }
    })
  })

  describe('randomMove', () => {
    it('returns only valid moves from the allowed set', () => {
      const rng = mulberry32(7)
      for (let i = 0; i < 100; i++) {
        const m = randomMove(rng)
        expect(ALL_MOVES).toContain(m)
      }
    })
  })

  describe('generateScramble', () => {
    it('returns an array with 20 moves by default', () => {
      const moves = generateScramble()
      expect(moves).toHaveLength(20)
    })

    it('returns an array with 10 moves when length is 10', () => {
      const moves = generateScramble({ length: 10 })
      expect(moves).toHaveLength(10)
    })

    it('returns an array with the requested custom length', () => {
      const moves = generateScramble({ length: 3 })
      expect(moves).toHaveLength(3)
    })

    it('never has two consecutive moves on the same face', () => {
      const moves = generateScramble()
      for (let i = 1; i < moves.length; i++) {
        expect(FACE_OF[moves[i]]).not.toBe(FACE_OF[moves[i - 1]])
      }
    })

    it('never has three consecutive moves on the same face', () => {
      const moves = generateScramble()
      for (let i = 2; i < moves.length; i++) {
        const faces = [moves[i - 2], moves[i - 1], moves[i]].map((m) => FACE_OF[m])
        expect(faces[0] === faces[1] && faces[1] === faces[2]).toBe(false)
      }
    })

    it('generates only valid moves', () => {
      const moves = generateScramble()
      for (const m of moves) {
        expect(ALL_MOVES).toContain(m)
      }
    })

    it('with seed 42 always returns the same sequence', () => {
      const a = generateScramble({ seed: 42 })
      const b = generateScramble({ seed: 42 })
      const c = generateScramble({ seed: 42 })
      expect(a).toEqual(b)
      expect(b).toEqual(c)
    })

    it('different seeds produce different sequences', () => {
      const a = generateScramble({ seed: 1 })
      const b = generateScramble({ seed: 2 })
      expect(a).not.toEqual(b)
    })

    it('same seed with different length still consistent at prefix', () => {
      const short = generateScramble({ seed: 9, length: 5 })
      const long = generateScramble({ seed: 9, length: 10 })
      expect(long.slice(0, 5)).toEqual(short)
    })

    it('generated scramble is valid per validateScramble', () => {
      const moves = generateScramble()
      expect(validateScramble(moves)).toBe(true)
    })
  })

  describe('validateScramble', () => {
    it('returns true for a valid scramble', () => {
      expect(validateScramble(['R', 'U', "R'", 'U2', 'F', 'D'])).toBe(true)
    })

    it('rejects two consecutive moves on the same face', () => {
      expect(validateScramble(['R', "R'", 'U'])).toBe(false)
      expect(validateScramble(['R', 'R2', 'U'])).toBe(false)
    })

    it('rejects invalid three-consecutive-same-face patterns', () => {
      expect(validateScramble(['R', 'L', 'R'])).toBe(false)
      expect(validateScramble(['F', 'U', 'F', 'B'])).toBe(false)
      expect(validateScramble(['B2', 'D', 'B2', 'L'])).toBe(false)
    })

    it('accepts valid three-move-same-face patterns', () => {
      expect(validateScramble(['R', 'L', "R'"])).toBe(true)
      expect(validateScramble(['R', 'L', 'R2', 'U'])).toBe(true)
      expect(validateScramble(["R'", 'U', 'R', 'F'])).toBe(true)
    })

    it('returns true for an empty array', () => {
      expect(validateScramble([])).toBe(true)
    })
  })

  describe('movesToNotation', () => {
    it('converts moves array to Singmaster string', () => {
      const moves: Move[] = ['R', 'U', "R'", 'U2', 'F2', 'D', 'B', "L'"]
      expect(movesToNotation(moves)).toBe("R U R' U2 F2 D B L'")
    })

    it('returns empty string for empty array', () => {
      expect(movesToNotation([])).toBe('')
    })

    it('output round-trips through parseNotation', () => {
      const moves = generateScramble()
      const notation = movesToNotation(moves)
      expect(parseNotation(notation)).toEqual(moves)
    })
  })

  describe('scrambleCube', () => {
    it('returns a cube different from the solved cube', () => {
      const result = scrambleCube()
      expect(isSolved(result.cube)).toBe(false)
    })

    it('applies moves to a custom cube when provided', () => {
      const cube = createSolvedCube()
      const result = scrambleCube(cube, { length: 5, seed: 3 })
      expect(result.moves).toHaveLength(5)
    })

    it('result.cube matches applying the moves to the solved cube', () => {
      const result = scrambleCube(undefined, { seed: 11 })
      const expected = applyMoves(createSolvedCube(), result.moves)
      expect(result.cube).toEqual(expected)
    })

    it('result.notation matches movesToNotation', () => {
      const result = scrambleCube(undefined, { seed: 11 })
      expect(result.notation).toBe(movesToNotation(result.moves))
    })

    it('is reproducible given the same seed', () => {
      const a = scrambleCube(undefined, { seed: 5 })
      const b = scrambleCube(undefined, { seed: 5 })
      expect(a.cube).toEqual(b.cube)
      expect(a.moves).toEqual(b.moves)
    })

    it('does not mutate the input cube', () => {
      const cube = createSolvedCube()
      const snapshot = cloneCube(cube)
      scrambleCube(cube, { seed: 8 })
      expect(cube).toEqual(snapshot)
    })

    it('honors a custom length option', () => {
      const result = scrambleCube(undefined, { seed: 5, length: 4 })
      expect(result.moves).toHaveLength(4)
    })
  })
})

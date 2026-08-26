import { describe, it, expect } from 'vitest'
import { parseNotation, validateNotation } from './cube-notation'

describe('parseNotation', () => {
  it('parses single clockwise moves', () => {
    expect(parseNotation('R')).toEqual(['R'])
    expect(parseNotation('U')).toEqual(['U'])
    expect(parseNotation('F')).toEqual(['F'])
    expect(parseNotation('L')).toEqual(['L'])
    expect(parseNotation('D')).toEqual(['D'])
    expect(parseNotation('B')).toEqual(['B'])
  })

  it('parses single counter-clockwise moves', () => {
    expect(parseNotation("R'")).toEqual(["R'"])
    expect(parseNotation("U'")).toEqual(["U'"])
    expect(parseNotation("F'")).toEqual(["F'"])
    expect(parseNotation("L'")).toEqual(["L'"])
    expect(parseNotation("D'")).toEqual(["D'"])
    expect(parseNotation("B'")).toEqual(["B'"])
  })

  it('parses double moves', () => {
    expect(parseNotation('R2')).toEqual(['R2'])
    expect(parseNotation('U2')).toEqual(['U2'])
    expect(parseNotation('F2')).toEqual(['F2'])
    expect(parseNotation('L2')).toEqual(['L2'])
    expect(parseNotation('D2')).toEqual(['D2'])
    expect(parseNotation('B2')).toEqual(['B2'])
  })

  it('parses multiple moves separated by spaces', () => {
    expect(parseNotation('R U F')).toEqual(['R', 'U', 'F'])
    expect(parseNotation("R' U' F'")).toEqual(["R'", "U'", "F'"])
    expect(parseNotation('R2 U2 F2')).toEqual(['R2', 'U2', 'F2'])
  })

  it('parses multiple moves without spaces', () => {
    expect(parseNotation('RUL')).toEqual(['R', 'U', 'L'])
    expect(parseNotation("R'U'F'")).toEqual(["R'", "U'", "F'"])
    expect(parseNotation('RUFLDB')).toEqual(['R', 'U', 'F', 'L', 'D', 'B'])
  })

  it('parses moves with various separators', () => {
    expect(parseNotation('R,U,F')).toEqual(['R', 'U', 'F'])
    expect(parseNotation('R;U;F')).toEqual(['R', 'U', 'F'])
    expect(parseNotation('R\tU\tF')).toEqual(['R', 'U', 'F'])
    expect(parseNotation('R\nU\nF')).toEqual(['R', 'U', 'F'])
  })

  it('handles mixed separators and whitespace', () => {
    expect(parseNotation('  R   U  F  ')).toEqual(['R', 'U', 'F'])
    expect(parseNotation('R, U; F')).toEqual(['R', 'U', 'F'])
  })

  it('handles lowercase input by converting to uppercase', () => {
    expect(parseNotation('r')).toEqual(['R'])
    expect(parseNotation("r'")).toEqual(["R'"])
    expect(parseNotation('r2')).toEqual(['R2'])
    expect(parseNotation('r u f')).toEqual(['R', 'U', 'F'])
  })

  it('handles mixed case input', () => {
    expect(parseNotation('rU f')).toEqual(['R', 'U', 'F'])
    expect(parseNotation("R' u2")).toEqual(["R'", 'U2'])
  })

  it('returns empty array for empty string', () => {
    expect(parseNotation('')).toEqual([])
  })

  it('returns empty array for whitespace-only string', () => {
    expect(parseNotation('   ')).toEqual([])
  })

  it('throws error for invalid notation', () => {
    expect(() => parseNotation('X')).toThrow()
    expect(() => parseNotation('Z')).toThrow()
    expect(() => parseNotation('RUX')).toThrow()
    expect(() => parseNotation('123')).toThrow()
  })

  it('throws error for malformed moves', () => {
    expect(() => parseNotation("R''")).toThrow()
    expect(() => parseNotation('R3')).toThrow()
    expect(() => parseNotation("R'2")).toThrow()
    expect(() => parseNotation("R2'")).toThrow()
  })

  it('parses a complex scramble sequence', () => {
    const scramble = "R U R' U' R' F R2 U' R' U' R U R' F'"
    const result = parseNotation(scramble)
    expect(result).toEqual([
      'R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'",
    ])
  })

  it('handles trailing/leading whitespace', () => {
    expect(parseNotation('  R  ')).toEqual(['R'])
    expect(parseNotation("  R' U  ")).toEqual(["R'", 'U'])
  })
})

describe('validateNotation', () => {
  it('returns true for valid single moves', () => {
    expect(validateNotation('R')).toBe(true)
    expect(validateNotation("R'")).toBe(true)
    expect(validateNotation('R2')).toBe(true)
    expect(validateNotation('U')).toBe(true)
    expect(validateNotation('F')).toBe(true)
    expect(validateNotation('L')).toBe(true)
    expect(validateNotation('D')).toBe(true)
    expect(validateNotation('B')).toBe(true)
  })

  it('returns true for valid sequences', () => {
    expect(validateNotation('R U F')).toBe(true)
    expect(validateNotation("R' U' F'")).toBe(true)
    expect(validateNotation('R2 U2 F2')).toBe(true)
    expect(validateNotation('RUFLDB')).toBe(true)
  })

  it('returns true for lowercase input', () => {
    expect(validateNotation('r')).toBe(true)
    expect(validateNotation("r'")).toBe(true)
    expect(validateNotation('r2')).toBe(true)
    expect(validateNotation('r u f')).toBe(true)
  })

  it('returns true for mixed case', () => {
    expect(validateNotation('rU f')).toBe(true)
    expect(validateNotation("R' u2")).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(validateNotation('')).toBe(true)
  })

  it('returns true for whitespace-only string', () => {
    expect(validateNotation('   ')).toBe(true)
  })

  it('returns false for invalid characters', () => {
    expect(validateNotation('X')).toBe(false)
    expect(validateNotation('Z')).toBe(false)
    expect(validateNotation('123')).toBe(false)
    expect(validateNotation('hello')).toBe(false)
  })

  it('returns false for mixed valid and invalid', () => {
    expect(validateNotation('RUX')).toBe(false)
    expect(validateNotation('R U X')).toBe(false)
  })

  it('returns false for malformed moves', () => {
    expect(validateNotation("R''")).toBe(false)
    expect(validateNotation('R3')).toBe(false)
    expect(validateNotation("R'2")).toBe(false)
    expect(validateNotation("R2'")).toBe(false)
  })

  it('returns true for complex valid scramble', () => {
    expect(validateNotation("R U R' U' R' F R2 U' R' U' R U R' F'")).toBe(true)
  })
})

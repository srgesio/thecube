import type { Move } from './cube-moves'

const VALID_FACES = 'RUDFLB'
const SEPARATORS = /[\s,;]/

const MOVE_RE = /^[RUDFLB]('2|'|2)?$/i

export function tokenize(input: string): string[] {
  const upper = input.toUpperCase()
  const tokens: string[] = []
  let i = 0

  while (i < upper.length) {
    const ch = upper[i]
    if (SEPARATORS.test(ch)) {
      i++
      continue
    }
    if (!VALID_FACES.includes(ch)) {
      throw new Error(`Invalid character: "${ch}"`)
    }
    const next = upper[i + 1]
    if (next === "'" || next === '2') {
      tokens.push(ch + next)
      i += 2
    } else {
      tokens.push(ch)
      i++
    }
  }

  return tokens
}

function validateToken(token: string): boolean {
  return MOVE_RE.test(token)
}

export function parseNotation(input: string): Move[] {
  const tokens = tokenize(input)
  const moves: Move[] = []

  for (const token of tokens) {
    if (!validateToken(token)) {
      throw new Error(`Invalid notation: "${token}"`)
    }
    moves.push(token as Move)
  }

  return moves
}

export function validateNotation(input: string): boolean {
  try {
    const tokens = tokenize(input)
    return tokens.every(validateToken)
  } catch {
    return false
  }
}

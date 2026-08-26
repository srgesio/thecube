import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type ReactNode } from 'react'
import { CubeProvider, useCube } from './use-cube'
import { isSolved } from '../core/cube-model'

function wrapper({ children }: { children: ReactNode }) {
  return <CubeProvider>{children}</CubeProvider>
}

describe('useCube', () => {
  it('starts with a solved cube', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    expect(isSolved(result.current.cubeState)).toBe(true)
    expect(result.current.history).toEqual([])
    expect(result.current.appliedMoves).toBe('')
  })

  it('applies a single move', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyMove('R'))
    expect(result.current.history).toEqual(['R'])
    expect(result.current.appliedMoves).toBe('R')
    expect(isSolved(result.current.cubeState)).toBe(false)
  })

  it('applies multiple moves', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => {
      result.current.applyMove('R')
      result.current.applyMove('U')
      result.current.applyMove('F')
    })
    expect(result.current.history).toEqual(['R', 'U', 'F'])
    expect(result.current.appliedMoves).toBe('R U F')
  })

  it('undo reverts the last move', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyMove('R'))
    const afterR = JSON.parse(JSON.stringify(result.current.cubeState))
    act(() => result.current.applyMove('U'))
    act(() => result.current.undo())
    expect(result.current.cubeState).toEqual(afterR)
    expect(result.current.history).toEqual(['R'])
    expect(result.current.appliedMoves).toBe('R')
  })

  it('undo on empty history is a no-op', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    const initial = JSON.parse(JSON.stringify(result.current.cubeState))
    act(() => result.current.undo())
    expect(result.current.cubeState).toEqual(initial)
    expect(result.current.history).toEqual([])
  })

  it('undo multiple times', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => {
      result.current.applyMove('R')
      result.current.applyMove('U')
      result.current.applyMove('F')
    })
    act(() => result.current.undo())
    act(() => result.current.undo())
    expect(result.current.history).toEqual(['R'])
    act(() => result.current.undo())
    expect(isSolved(result.current.cubeState)).toBe(true)
    expect(result.current.history).toEqual([])
  })

  it('reset returns to solved state', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => {
      result.current.applyMove('R')
      result.current.applyMove('U')
    })
    act(() => result.current.reset())
    expect(isSolved(result.current.cubeState)).toBe(true)
    expect(result.current.history).toEqual([])
    expect(result.current.appliedMoves).toBe('')
  })

  it('applyNotation parses and applies a sequence', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyNotation('R U F'))
    expect(result.current.history).toEqual(['R', 'U', 'F'])
    expect(result.current.appliedMoves).toBe('R U F')
  })

  it('applyNotation appends to existing history', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyMove('R'))
    act(() => result.current.applyNotation('U F'))
    expect(result.current.history).toEqual(['R', 'U', 'F'])
  })

  it('applyNotation on scrambled notation restores after inverse', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyNotation("R U R' U'"))
    expect(result.current.history).toEqual(['R', 'U', "R'", "U'"])
    act(() => result.current.applyNotation("U R U' R'"))
    expect(isSolved(result.current.cubeState)).toBe(true)
  })

  it('applyMove then undo restores solved state', () => {
    const { result } = renderHook(() => useCube(), { wrapper })
    act(() => result.current.applyMove('F2'))
    expect(isSolved(result.current.cubeState)).toBe(false)
    act(() => result.current.undo())
    expect(isSolved(result.current.cubeState)).toBe(true)
  })
})

describe('useCube - errors', () => {
  it('throws when used outside CubeProvider', () => {
    expect(() => {
      renderHook(() => useCube())
    }).toThrow('useCube must be used within a CubeProvider')
  })
})

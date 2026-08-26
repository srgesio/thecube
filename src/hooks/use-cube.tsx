'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { createSolvedCube, type CubeState } from '../core/cube-model'
import { applyMove as applyCubeMove, type Move } from '../core/cube-moves'
import { parseNotation } from '../core/cube-notation'

interface CubeContextValue {
  cubeState: CubeState
  history: Move[]
  appliedMoves: string
  applyMove: (move: Move) => void
  reset: () => void
  undo: () => void
  applyNotation: (text: string) => void
}

interface CubeStateInternal {
  cubeState: CubeState
  history: Move[]
  appliedMoves: string
}

type CubeAction =
  | { type: 'APPLY_MOVE'; move: Move }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'APPLY_NOTATION'; moves: Move[] }

function cubeReducer(state: CubeStateInternal, action: CubeAction): CubeStateInternal {
  switch (action.type) {
    case 'APPLY_MOVE': {
      const newCube = applyCubeMove(state.cubeState, action.move)
      return {
        cubeState: newCube,
        history: [...state.history, action.move],
        appliedMoves: state.appliedMoves
          ? `${state.appliedMoves} ${action.move}`
          : action.move,
      }
    }
    case 'UNDO': {
      if (state.history.length === 0) return state
      const newHistory = state.history.slice(0, -1)
      let cube = createSolvedCube()
      for (const move of newHistory) {
        cube = applyCubeMove(cube, move)
      }
      return {
        cubeState: cube,
        history: newHistory,
        appliedMoves: newHistory.join(' '),
      }
    }
    case 'RESET':
      return {
        cubeState: createSolvedCube(),
        history: [],
        appliedMoves: '',
      }
    case 'APPLY_NOTATION': {
      let cube = state.cubeState
      const newHistory = [...state.history]
      for (const move of action.moves) {
        cube = applyCubeMove(cube, move)
        newHistory.push(move)
      }
      return {
        cubeState: cube,
        history: newHistory,
        appliedMoves: newHistory.join(' '),
      }
    }
  }
}

const CubeContext = createContext<CubeContextValue | null>(null)

export function CubeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cubeReducer, {
    cubeState: createSolvedCube(),
    history: [],
    appliedMoves: '',
  })

  const applyMove = (move: Move) => dispatch({ type: 'APPLY_MOVE', move })
  const undo = () => dispatch({ type: 'UNDO' })
  const reset = () => dispatch({ type: 'RESET' })
  const applyNotation = (text: string) => {
    const moves = parseNotation(text)
    dispatch({ type: 'APPLY_NOTATION', moves })
  }

  return (
    <CubeContext.Provider
      value={{
        cubeState: state.cubeState,
        history: state.history,
        appliedMoves: state.appliedMoves,
        applyMove,
        undo,
        reset,
        applyNotation,
      }}
    >
      {children}
    </CubeContext.Provider>
  )
}

export function useCube(): CubeContextValue {
  const ctx = useContext(CubeContext)
  if (!ctx) throw new Error('useCube must be used within a CubeProvider')
  return ctx
}

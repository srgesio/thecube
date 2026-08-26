import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CubeVisualizer } from './CubeVisualizer'
import { createSolvedCube } from '../core/cube-model'
import { applyMove } from '../core/cube-moves'
import type { CubeState } from '../core/cube-model'

function getStickerColor(el: HTMLElement): string {
  return el.style.backgroundColor
}

function getFaceStickers(testId: string): HTMLElement[] {
  const face = screen.getByTestId(testId)
  return Array.from(face.children) as HTMLElement[]
}

describe('CubeVisualizer', () => {
  it('renders all 6 faces', () => {
    render(<CubeVisualizer cubeState={createSolvedCube()} />)
    expect(screen.getByTestId('face-U')).toBeInTheDocument()
    expect(screen.getByTestId('face-D')).toBeInTheDocument()
    expect(screen.getByTestId('face-F')).toBeInTheDocument()
    expect(screen.getByTestId('face-B')).toBeInTheDocument()
    expect(screen.getByTestId('face-L')).toBeInTheDocument()
    expect(screen.getByTestId('face-R')).toBeInTheDocument()
  })

  it('renders 9 stickers per face', () => {
    render(<CubeVisualizer cubeState={createSolvedCube()} />)
    const faces = ['face-U', 'face-D', 'face-F', 'face-B', 'face-L', 'face-R']
    for (const faceId of faces) {
      expect(getFaceStickers(faceId)).toHaveLength(9)
    }
  })

  it('renders solved cube with correct colors', () => {
    render(<CubeVisualizer cubeState={createSolvedCube()} />)
    const uStickers = getFaceStickers('face-U')
    for (const sticker of uStickers) {
      expect(getStickerColor(sticker)).toBe('rgb(255, 255, 255)')
    }
    const fStickers = getFaceStickers('face-F')
    for (const sticker of fStickers) {
      expect(getStickerColor(sticker)).toBe('rgb(0, 155, 72)')
    }
    const rStickers = getFaceStickers('face-R')
    for (const sticker of rStickers) {
      expect(getStickerColor(sticker)).toBe('rgb(185, 0, 0)')
    }
  })

  it('updates after applying a move', () => {
    const cube = applyMove(createSolvedCube(), 'R')
    render(<CubeVisualizer cubeState={cube} />)
    const uStickers = getFaceStickers('face-U')
    expect(getStickerColor(uStickers[2])).toBe('rgb(0, 155, 72)')
    expect(getStickerColor(uStickers[5])).toBe('rgb(0, 155, 72)')
    expect(getStickerColor(uStickers[8])).toBe('rgb(0, 155, 72)')
    expect(getStickerColor(uStickers[0])).toBe('rgb(255, 255, 255)')
  })

  it('renders custom cube state', () => {
    const custom: CubeState = {
      U: [
        ['R', 'G', 'W'],
        ['O', 'W', 'Y'],
        ['B', 'R', 'G'],
      ],
      D: createSolvedCube().D,
      F: createSolvedCube().F,
      B: createSolvedCube().B,
      L: createSolvedCube().L,
      R: createSolvedCube().R,
    }
    render(<CubeVisualizer cubeState={custom} />)
    const uStickers = getFaceStickers('face-U')
    expect(getStickerColor(uStickers[0])).toBe('rgb(185, 0, 0)')
    expect(getStickerColor(uStickers[1])).toBe('rgb(0, 155, 72)')
    expect(getStickerColor(uStickers[2])).toBe('rgb(255, 255, 255)')
  })
})

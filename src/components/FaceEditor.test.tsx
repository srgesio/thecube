import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FaceEditor } from './FaceEditor'
import { faceConfigFromCubeState } from '../core/state-builder'
import { createSolvedCube } from '../core/cube-model'
import type { FaceConfig } from '../core/state-builder'

const SOLVED_CONFIG = faceConfigFromCubeState(createSolvedCube())

const SCRAMBLED_CONFIG: FaceConfig = {
  U: ['Y', 'G', 'B', 'O', 'R', 'W', 'W', 'W', 'W'],
  D: ['W', 'G', 'B', 'O', 'R', 'Y', 'Y', 'Y', 'Y'],
  F: ['W', 'Y', 'B', 'O', 'R', 'G', 'G', 'G', 'G'],
  B: ['W', 'Y', 'G', 'O', 'R', 'B', 'B', 'B', 'B'],
  L: ['W', 'Y', 'G', 'B', 'R', 'O', 'O', 'O', 'O'],
  R: ['W', 'Y', 'G', 'B', 'O', 'R', 'R', 'R', 'R'],
}

function getAllStickers(): HTMLElement[] {
  return Array.from(screen.getAllByRole('button', { name: /sticker/i }))
}

describe('FaceEditor', () => {
  describe('rendering', () => {
    it('renders all 6 faces', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      expect(screen.getByTestId('editor-face-U')).toBeInTheDocument()
      expect(screen.getByTestId('editor-face-D')).toBeInTheDocument()
      expect(screen.getByTestId('editor-face-F')).toBeInTheDocument()
      expect(screen.getByTestId('editor-face-B')).toBeInTheDocument()
      expect(screen.getByTestId('editor-face-L')).toBeInTheDocument()
      expect(screen.getByTestId('editor-face-R')).toBeInTheDocument()
    })

    it('renders 9 stickers per face (54 total)', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      const stickers = getAllStickers()
      expect(stickers).toHaveLength(54)
    })

    it('renders Apply and Clear buttons', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: /aplicar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument()
    })

    it('renders stickers with correct background colors', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      const uStickers = screen.getByTestId('editor-face-U').querySelectorAll('button')
      for (const sticker of uStickers) {
        expect(sticker.style.backgroundColor).toBe('rgb(255, 255, 255)')
      }
      const rStickers = screen.getByTestId('editor-face-R').querySelectorAll('button')
      for (const sticker of rStickers) {
        expect(sticker.style.backgroundColor).toBe('rgb(185, 0, 0)')
      }
    })
  })

  describe('interaction', () => {
    it('clicking a sticker cycles to the next color', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      const firstSticker = screen.getByTestId('editor-face-U').querySelectorAll('button')[0]
      expect(firstSticker.style.backgroundColor).toBe('rgb(255, 255, 255)')

      fireEvent.click(firstSticker)
      expect(firstSticker.style.backgroundColor).not.toBe('rgb(255, 255, 255)')
    })

    it('clicking sticker 6 times returns to original color', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      const firstSticker = screen.getByTestId('editor-face-U').querySelectorAll('button')[0]
      const originalColor = firstSticker.style.backgroundColor

      for (let i = 0; i < 6; i++) {
        fireEvent.click(firstSticker)
      }
      expect(firstSticker.style.backgroundColor).toBe(originalColor)
    })

    it('does not call onChange when sticker is clicked (only on Apply)', () => {
      const onChange = vi.fn()
      render(<FaceEditor value={SOLVED_CONFIG} onChange={onChange} />)
      const firstSticker = screen.getByTestId('editor-face-U').querySelectorAll('button')[0]

      fireEvent.click(firstSticker)
      fireEvent.click(firstSticker)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('apply button', () => {
    it('calls onChange with the current config when Apply is clicked', () => {
      const onChange = vi.fn()
      render(<FaceEditor value={SOLVED_CONFIG} onChange={onChange} />)

      fireEvent.click(screen.getByRole('button', { name: /aplicar/i }))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(SOLVED_CONFIG)
    })

    it('calls onChange with scrambled config when Apply is clicked', () => {
      const onChange = vi.fn()
      render(<FaceEditor value={SCRAMBLED_CONFIG} onChange={onChange} />)

      const uStickers = screen.getByTestId('editor-face-U').querySelectorAll('button')
      expect(uStickers[0].style.backgroundColor).not.toBe('rgb(255, 255, 255)')

      fireEvent.click(screen.getByRole('button', { name: /aplicar/i }))
      expect(onChange).toHaveBeenCalledTimes(1)
      const passedConfig = onChange.mock.calls[0][0] as FaceConfig
      expect(passedConfig).toEqual(SCRAMBLED_CONFIG)
    })
  })

  describe('clear button', () => {
    it('resets all stickers to solved state when Clear is clicked', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)

      const firstSticker = screen.getByTestId('editor-face-U').querySelectorAll('button')[0]
      fireEvent.click(firstSticker)
      expect(firstSticker.style.backgroundColor).not.toBe('rgb(255, 255, 255)')

      fireEvent.click(screen.getByRole('button', { name: /limpar/i }))
      expect(firstSticker.style.backgroundColor).toBe('rgb(255, 255, 255)')
    })

    it('resets all faces, not just the one that was edited', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)

      const uSticker = screen.getByTestId('editor-face-U').querySelectorAll('button')[0]
      const rSticker = screen.getByTestId('editor-face-R').querySelectorAll('button')[0]

      fireEvent.click(uSticker)
      fireEvent.click(rSticker)

      fireEvent.click(screen.getByRole('button', { name: /limpar/i }))

      expect(uSticker.style.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(rSticker.style.backgroundColor).toBe('rgb(185, 0, 0)')
    })
  })

  describe('invalid state indicator', () => {
    it('shows error indicator when color count is invalid', () => {
      const invalidConfig: FaceConfig = {
        U: ['Y', 'G', 'B', 'O', 'R', 'W', 'W', 'W', 'W'],
        D: SOLVED_CONFIG.D,
        F: SOLVED_CONFIG.F,
        B: SOLVED_CONFIG.B,
        L: SOLVED_CONFIG.L,
        R: ['W', 'Y', 'G', 'B', 'O', 'R', 'R', 'R', 'W'],
      }
      render(<FaceEditor value={invalidConfig} onChange={vi.fn()} />)
      const errorIndicator = screen.getByTestId('validation-error')
      expect(errorIndicator).toBeInTheDocument()
      expect(errorIndicator.textContent).toContain('vezes')
    })

    it('does not show error indicator for valid config', () => {
      render(<FaceEditor value={SOLVED_CONFIG} onChange={vi.fn()} />)
      expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument()
    })
  })

  describe('initial state from value prop', () => {
    it('renders stickers matching the provided value prop', () => {
      const custom: FaceConfig = {
        U: ['R', 'G', 'W', 'O', 'W', 'Y', 'B', 'R', 'G'],
        D: SOLVED_CONFIG.D,
        F: SOLVED_CONFIG.F,
        B: SOLVED_CONFIG.B,
        L: SOLVED_CONFIG.L,
        R: SOLVED_CONFIG.R,
      }
      render(<FaceEditor value={custom} onChange={vi.fn()} />)
      const uStickers = screen.getByTestId('editor-face-U').querySelectorAll('button')
      expect(uStickers[0].style.backgroundColor).toBe('rgb(185, 0, 0)')
      expect(uStickers[1].style.backgroundColor).toBe('rgb(0, 155, 72)')
      expect(uStickers[2].style.backgroundColor).toBe('rgb(255, 255, 255)')
    })
  })
})

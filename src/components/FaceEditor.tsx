'use client'

import { useState, useCallback } from 'react'
import type { FaceConfig, FaceName } from '../core/state-builder'
import { validateFaceConfig, STICKER_COLORS } from '../core/state-builder'

const STICKER_COLORS_HEX: Record<string, string> = {
  W: '#ffffff',
  Y: '#ffd500',
  G: '#009b48',
  B: '#0046ad',
  O: '#ff5900',
  R: '#b90000',
}

const FACE_SIZE = 120
const STICKER_SIZE = FACE_SIZE / 3 - 2

function solvedFromColor(face: FaceName): string[] {
  const colorMap: Record<FaceName, string> = {
    U: 'W',
    D: 'Y',
    F: 'G',
    B: 'B',
    L: 'O',
    R: 'R',
  }
  return Array(9).fill(colorMap[face])
}

interface StickerButtonProps {
  color: string
  onClick: () => void
  invalid: boolean
}

function StickerButton({ color, onClick, invalid }: StickerButtonProps) {
  return (
    <button
      type="button"
      aria-label={`sticker ${color}`}
      onClick={onClick}
      className="rounded-sm transition-all duration-150 hover:brightness-110 active:scale-95"
      style={{
        backgroundColor: STICKER_COLORS_HEX[color] ?? '#ccc',
        width: STICKER_SIZE,
        height: STICKER_SIZE,
        border: invalid ? '2px solid #ef4444' : '2px solid transparent',
      }}
    />
  )
}

interface EditorFaceProps {
  faceName: FaceName
  stickers: string[]
  onStickerClick: (face: FaceName, index: number) => void
  validationErrors: string[]
}

function EditorFace({ faceName, stickers, onStickerClick, validationErrors }: EditorFaceProps) {
  const faceHasError = validationErrors.some((e) => e.startsWith(`Face ${faceName}`))
  return (
    <div
      data-testid={`editor-face-${faceName}`}
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(3, ${STICKER_SIZE}px)` }}
    >
      {stickers.map((color, index) => (
        <StickerButton
          key={index}
          color={color}
          onClick={() => onStickerClick(faceName, index)}
          invalid={faceHasError}
        />
      ))}
    </div>
  )
}

interface FaceEditorProps {
  value: FaceConfig
  onChange: (config: FaceConfig) => void
}

export function FaceEditor({ value, onChange }: FaceEditorProps) {
  const [config, setConfig] = useState<FaceConfig>(() => ({ ...value }))
  const [validation, setValidation] = useState<ValidationResult>(() =>
    validateFaceConfig(value),
  )

  const handleStickerClick = useCallback((face: FaceName, index: number) => {
    setConfig((prev) => {
      const currentColor = prev[face][index]
      const currentIndex = STICKER_COLORS.indexOf(currentColor as (typeof STICKER_COLORS)[number])
      const nextIndex = (currentIndex + 1) % STICKER_COLORS.length
      const nextColor = STICKER_COLORS[nextIndex]
      const newFace = [...prev[face]]
      newFace[index] = nextColor
      const newConfig = { ...prev, [face]: newFace }
      setValidation(validateFaceConfig(newConfig))
      return newConfig
    })
  }, [])

  const handleApply = useCallback(() => {
    const result = validateFaceConfig(config)
    setValidation(result)
    if (result.valid) {
      onChange(config)
    }
  }, [config, onChange])

  const handleClear = useCallback(() => {
    const cleared: FaceConfig = {
      U: solvedFromColor('U'),
      D: solvedFromColor('D'),
      F: solvedFromColor('F'),
      B: solvedFromColor('B'),
      L: solvedFromColor('L'),
      R: solvedFromColor('R'),
    }
    setConfig(cleared)
    setValidation(validateFaceConfig(cleared))
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {validation.valid === false && (
        <div
          data-testid="validation-error"
          className="rounded bg-red-100 p-2 text-sm text-red-700"
        >
          {validation.errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-[2px]">
        <div style={{ marginLeft: FACE_SIZE + 2 }}>
          <EditorFace
            faceName="U"
            stickers={config.U}
            onStickerClick={handleStickerClick}
            validationErrors={validation.errors}
          />
        </div>
        <div className="flex gap-[2px]">
          {(['L', 'F', 'R', 'B'] as FaceName[]).map((name) => (
            <EditorFace
              key={name}
              faceName={name}
              stickers={config[name]}
              onStickerClick={handleStickerClick}
              validationErrors={validation.errors}
            />
          ))}
        </div>
        <div style={{ marginLeft: FACE_SIZE + 2 }}>
          <EditorFace
            faceName="D"
            stickers={config.D}
            onStickerClick={handleStickerClick}
            validationErrors={validation.errors}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          disabled={!validation.valid}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Aplicar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
        >
          Limpar
        </button>
      </div>
    </div>
  )
}

type ValidationResult = import('../core/state-builder').ValidationResult

'use client'

import { useState } from 'react'
import { validateNotation } from '../core/cube-notation'

interface NotationInputProps {
  onApply: (notation: string) => void
}

export function NotationInput({ onApply }: NotationInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    if (!validateNotation(value)) {
      setError(true)
      return
    }
    setError(false)
    onApply(value)
    setValue('')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    if (error) setError(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="R U R' U'"
        className="flex-1 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-blue-500"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:scale-95"
      >
        Aplicar
      </button>
      {error && (
        <span className="absolute -bottom-5 left-0 text-xs text-red-400">
          Notacao invalida
        </span>
      )}
    </form>
  )
}

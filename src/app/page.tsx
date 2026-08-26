'use client'

import { CubeProvider, useCube } from '../hooks/use-cube'
import { CubeVisualizer } from '../components/CubeVisualizer'
import { ControlPanel } from '../components/ControlPanel'

function CubeApp() {
  const { cubeState } = useCube()

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-900 p-4 sm:p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        The Cube
      </h1>

      <div className="flex w-full max-w-4xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 p-6">
          <CubeVisualizer cubeState={cubeState} />
        </div>

        <div className="w-full max-w-sm">
          <ControlPanel />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <CubeProvider>
      <CubeApp />
    </CubeProvider>
  )
}

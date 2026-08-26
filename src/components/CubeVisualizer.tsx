import type { CubeState } from '../core/cube-model'

const STICKER_COLORS: Record<string, string> = {
  W: '#ffffff',
  Y: '#ffd500',
  G: '#009b48',
  B: '#0046ad',
  O: '#ff5900',
  R: '#b90000',
}

const FACE_SIZE = 120

function Sticker({ color }: { color: string }) {
  return (
    <div
      className="rounded-sm"
      style={{
        backgroundColor: STICKER_COLORS[color] ?? '#ccc',
        width: FACE_SIZE / 3 - 2,
        height: FACE_SIZE / 3 - 2,
      }}
    />
  )
}

function Face({
  face,
  testId,
}: {
  face: string[][]
  testId: string
}) {
  return (
    <div
      data-testid={testId}
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(3, ${FACE_SIZE / 3 - 2}px)` }}
    >
      {face.map((row, ri) =>
        row.map((sticker, ci) => (
          <Sticker key={`${ri}-${ci}`} color={sticker} />
        )),
      )}
    </div>
  )
}

export function CubeVisualizer({ cubeState }: { cubeState: CubeState }) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <div style={{ marginLeft: FACE_SIZE + 2 }}>
        <Face face={cubeState.U} testId="face-U" />
      </div>
      <div className="flex gap-[2px]">
        <Face face={cubeState.L} testId="face-L" />
        <Face face={cubeState.F} testId="face-F" />
        <Face face={cubeState.R} testId="face-R" />
        <Face face={cubeState.B} testId="face-B" />
      </div>
      <div style={{ marginLeft: FACE_SIZE + 2 }}>
        <Face face={cubeState.D} testId="face-D" />
      </div>
    </div>
  )
}

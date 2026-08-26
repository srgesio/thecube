import { describe, it, expect } from 'vitest'
import { createSolvedCube, cloneCube, isSolved, cubeToString } from './cube-model'
import { moveU } from './cube-moves'

describe('debug U', () => {
  it('U4 should return to solved', () => {
    let cube = createSolvedCube()
    cube = moveU(cube)
    console.log('After U:\n' + cubeToString(cube))
    cube = moveU(cube)
    console.log('After U2:\n' + cubeToString(cube))
    cube = moveU(cube)
    console.log('After U3:\n' + cubeToString(cube))
    cube = moveU(cube)
    console.log('After U4:\n' + cubeToString(cube))
    expect(isSolved(cube)).toBe(true)
  })
})

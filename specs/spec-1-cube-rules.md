# Spec 1 — Modelo de Dados do Cubo

## Descrição
A estrutura de dados que representa o estado de um cubo mágico 3x3

## Requisitos:
- Definir tipo Face = string[][] (3x3 grid de cores, ex: 'W', 'Y', 'R', 'O', 'G', 'B')
- Definir tipo CubeState = registro com 6 faces: { U, D, F, B, L, R }
- Função createSolvedCube(): CubeState — retorna cubo resolvido
- Função cloneCube(cube: CubeState): CubeState — deep clone imutável
- Função isSolved(cube: CubeState): boolean
- Função cubeToString(cube: CubeState): string — representação legível (debug/testes)

## Faces do cubo resolvido:
- U (Up)
- D (Down)
- F (Front)
- B (Back)
- L (Left)
- R (Right)

## Critério de aceite:
Todos os testes unitários de core/cube-model.test.ts passam.
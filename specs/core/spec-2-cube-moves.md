# Spec 2 — Movimentos do Cubo (Core Logic)

## Descrição
Implementação das 12+6 movimentos básicos do cubo mágico.

## Requisitos:
- Funções de rotação de face (sentido horário e anti-horário):
- rotateFaceCW(face): Face / rotateFaceCCW(face): Face
- Funções de movimento base (6 movimentos): moveR, moveL, moveU, moveD, moveF, moveB
- Cada movimento: rota da face + rotação das 4 arestas adjacentes
- Funções inversas: moveR', moveL', etc. (ou moveRInv, etc.)
- Função applyMove(state: CubeState, move: Move): CubeState — aplica qualquer movimento (imutável)
- Tipo Move = 'R' | "R'" | 'R2' | 'L' | "L'" | 'L2' | ... (18 movimentos no total)
- Função applyMoves(state: CubeState, moves: Move[]): CubeState — aplica sequência

## Critério de aceite:
Testes unitários verificam:
1. Cada movimento isolado no cubo resolvido
2. Sequência R U R' U' (sexy move) aplicada 6 vezes retorna ao estado resolvido
3. Movimentos inversos: applyMove(applyMove(state, 'R'), "R'") === estado original
Spec 4 — Gerenciamento de Estado (React)
Hooks e contexto React para gerenciar o estado do cubo
Requisitos:
- useCube() hook:
- Estado: cubeState: CubeState, history: Move[], appliedMoves: string
- Ações: applyMove(move), reset(), undo(), applyNotation(text)
- Contexto CubeProvider para disponibilizar o estado globalmente
- Histórico de movimentos (para undo)
Critério de aceite: Testes com @testing-library/react验证 o hook.
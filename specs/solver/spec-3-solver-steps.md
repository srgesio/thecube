# Spec 3 -- Solver Steps (Execucao Passo a Passo)

## Descricao
Implementacao de hook React e logica de controle para executar a solucao do cubo passo a
passo. O usuario pode avancar e retroceder entre movimentos, fazer pausa, reproduzir
automaticamente e acompanhar o progresso da resolucao. Esta spec conecta o algoritmo puro
(Spec 2) ao React e ao gerenciamento de estado existente.

## Requisitos

### Hook useSolver
- `useSolver()` retorna `SolverContextValue`:
  ```ts
  {
    // Estado
    status: 'idle' | 'solving' | 'paused' | 'completed'
    result: SolverResult | null
    currentStepIndex: number
    currentMoveIndex: number
    currentCubeState: CubeState
    progress: number // 0-100

    // Acoes
    startSolve: (cube: CubeState) => void
    nextMove: () => void
    prevMove: () => void
    nextStep: () => void
    prevStep: () => void
    play: () => void
    pause: () => void
    reset: () => void

    // Derivados
    currentStep: SolverStep | null
    totalSteps: number
    totalMoves: number
    appliedMovesCount: number
    isPlaying: boolean
    canNext: boolean
    canPrev: boolean
  }
  ```

### Comportamento do player
- `startSolve(cube)`: executa `solve(cube)` e prepara o player (status: 'paused',
  posiciona no primeiro movimento)
- `play()`: inicia reproducao automatica dos movimentos com intervalo configuravel
  (padrao: 300ms entre movimentos)
- `pause()`: pausa a reproducao automatica
- `nextMove()`: avanca um movimento, atualiza `currentCubeState` aplicando o proximo move
- `prevMove()`: retrocede um movimento, reconstrói o estado (replay do inicio ate o ponto anterior)
- `nextStep()`: avanca para o primeiro movimento da proxima fase
- `prevStep()`: retrocede para o primeiro movimento da fase anterior
- `reset()`: volta ao estado inicial (antes da solucao), status: 'idle'

### Velocidade
- `setSpeed(ms: number)`: configura intervalo entre movimentos em reproducao automatica
- Velocidade minima: 50ms (rapido)
- Velocidade maxima: 2000ms (lento)
- Velocidade padrao: 300ms

### Integracao com useCube
- `useSolver` pode operar independente do `useCube` (estado isolado) OU
- `useSolver` pode ser conectado ao `useCube` para sincronizar o estado visual do cubo
- Quando conectado, cada movimento do solver e aplicado ao `useCube` via `applyMove`
- A conectacao e opcional (o solver funciona standalone para testes)

### Acessibilidade e Mobile
- Controles devem ser touch-friendly (min 44px)
- Reproducao automatica deve respeitar `prefers-reduced-motion` (velocidade padrao mais lenta)
- Indicadores de status devem ser acessiveis via screen reader (aria-label)

## Criterio de aceite
1. Testes em `src/hooks/use-solver.test.tsx` verificam:
   - `startSolve` muda status para 'paused' e configura result
   - `nextMove` avanca um movimento e atualiza currentCubeState
   - `prevMove` retrocede um movimento
   - `nextStep` pula para o inicio da proxima fase
   - `prevStep` volta para o inicio da fase anterior
   - `play` inicia reproducao automatica (verificar via fake timers)
   - `pause` para reproducao automatica
   - `reset` volta ao estado idle com result null
   - `progress` e calculado corretamente (appliedMoves / totalMoves * 100)
   - `status` transita corretamente: idle -> paused -> solving -> completed
   - Reproducao automatica para ao chegar no ultimo movimento
   - `setSpeed` altera o intervalo de reproducao
2. Todos os testes passam com `npm test`
3. `npm run lint` retorna sem erros

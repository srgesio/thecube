# Spec 2 -- Solver Algorithm (Algoritmo de Resolucao)

## Descricao
Implementacao do algoritmo completo de resolucao do cubo magico 3x3 pelo metodo iniciante
(layer-by-layer). O algoritmo recebe qualquer estado valido do cubo e retorna uma sequencia
de movimentos que o resolve, organizada em 6 fases visuais e claramente identificaveis.
Esta e a spec mais complexa do modulo solver -- toda a logica e core puro (sem React).

## Requisitos

### Tipos
- `SolverStep = { name: string, description: string, moves: Move[], stateBefore: CubeState, stateAfter: CubeState }`
  - `name`: nome curto da fase (ex: "Cruz Branca")
  - `description`: descricao do que esta fase realiza
  - `moves`: sequencia de movimentos que resolve esta fase
  - `stateBefore`: estado do cubo antes desta fase
  - `stateAfter`: estado do cubo apos esta fase
- `SolverResult = { steps: SolverStep[], totalMoves: number, solved: boolean }`
  - `steps`: array ordenado das fases resolvidas
  - `totalMoves`: numero total de movimentos
  - `solved`: true se o cubo foi resolvido com sucesso

### Funcoes principais
- `solve(cube: CubeState): SolverResult` -- resolve o cubo e retorna resultado organizado por fases
- `solveToString(result: SolverResult): string` -- converte resultado para representacao legivel
  com cada fase e seus movimentos

### Fases do metodo iniciante (6 fases)

#### Fase 1 -- Cruz Branca (`solveWhiteCross`)
- Objetivo: posicionar as 4 arestas brancas na face U, alinhadas com os centros das faces laterais
- Algoritmo: para cada aresta branca, encontrar sua posicao e move-la para a face U
- Resultado: face U com cruz branca + centros laterais alinhados

#### Fase 2 -- Cantos da Primeira Camada (`solveFirstLayerCorners`)
- Objetivo: posicionar os 4 cantos brancos nas posicoes corretas da primeira camada
- Algoritmo: para cada canto branco, encontrar sua posicao e inseri-lo com algoritmo R U R' U'
  (repetido ate posicionar)
- Resultado: primeira camada completa (face U + primeira camada das faces laterais)

#### Fase 3 -- Arestas da Segunda Camada (`solveSecondLayerEdges`)
- Objetivo: posicionar as 4 arestas do meio nas posicoes corretas
- Algoritmo: U R U' R' U' F' U F (inserir da direita) ou equivalente para da esquerda
- Resultado: duas primeiras camadas completas (F2L)

#### Fase 4 -- Cruz Amarela (`solveYellowCross`)
- Objetivo: criar cruz amarela na face D (baixo)
- Algoritmo: F R U R' U' F' (repetido 1-3 vezes dependendo do padrao)
- Padrao: ponto -> linha -> cruz -> resolvido
- Resultado: face D com cruz amarela (independente dos cantos)

#### Fase 5 -- Orientacao da Face Amarela (`solveYellowFace`)
- Objetivo: orientar todos os stickers amarelos para baixo (face D completamente amarela)
- Algoritmo: R U R' U R U2 R' (Sune) repetido ate orientar todos os cantos amarelos
- Resultado: face D inteiramente amarela

#### Fase 6 -- Permutacao da Ultima Camada (`solveLastLayerPermutation`)
- Objetivo: permutar cantos e arestas da ultima camada nas posicoes corretas
- Algoritmo: X R' U R' D2 R U' R' D2 R2 X' (permutacao de cantos) +
  R U' R U R U R U' R' U' R2 (permutacao de arestas)
- Resultado: cubo totalmente resolvido

### Funcoes auxiliares por fase
Cada fase deve ter funcoes auxiliares internas que:
- Analisam o estado atual do cubo
- Determinam quais pecas estao fora do lugar
- Geram a sequencia de movimentos para corrigir cada peca
- Retornam o estado apos a correcao

### Validacao
- Apos cada fase, o estado resultante deve ser validado (a fase anterior nao deve ser desfeita)
- Apos todas as 6 fases, `isSolved(result.stateAfter)` deve ser `true`
- Para qualquer cubo valido de entrada, o solver deve terminar (nao pode entrar em loop infinito)
- Limite maximo de movimentos por fase: 100 (safety break)

## Criterio de aceite
1. Testes unitarios em `src/core/solver.test.ts` verificam:
   - `solve(createSolvedCube())` retorna resultado com 0 movimentos (ja resolvido)
   - `solve(scrambledCube)` retorna `solved: true` para cubos embaralhados
   - Cada fase individual produz resultado esperado:
     - Apos Fase 1: cruz branca presente e centros alinhados
     - Apos Fase 2: primeira camada completa
     - Apos Fase 3: duas primeiras camadas completas
     - Apos Fase 4: cruz amarela presente
     - Apos Fase 5: face D completamente amarela
     - Apos Fase 6: cubo resolvido
   - `isSolved(applyMoves(initialState, allMovesFromResult))` e true
   - Solver nao entra em loop (termina em tempo razoavel)
   - Solver funciona para cubos gerados por scramble
   - `solveToString` produce saida legivel com cada fase identificada
2. Todos os testes passam com `npm test`
3. `npm run lint` retorna sem erros

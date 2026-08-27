# Spec 1 -- Scramble Generator (Gerador de Scramble)

## Descricao
Implementacao de funcoes puras para gerar sequencias aleatorias de movimentos que embaralham
o cubo magico. O scramble deve produzir estados aleatorios uniformes, evitar movimentos
redundantes (como R seguido de R') e ser reproduzivel opcionalmente via seed.

## Requisitos

### Funcoes puras (core)
- `generateScramble(options?: ScrambleOptions): Move[]` -- gera sequencia aleatoria de movimentos
- `ScrambleOptions = { length?: number, seed?: number }` -- opcional:
  - `length`: quantidade de movimentos (padrao: 20)
  - `seed`: seed para RNG reproduzivel (opcional, para testes e compartilhamento)
- `scrambleCube(cube?: CubeState, options?: ScrambleOptions): ScrambleResult` -- aplica scramble
  ao cubo (ou cubo resolvido se nao informado) e retorna estado embaralhado
- `ScrambleResult = { cube: CubeState, moves: Move[], notation: string }` -- estado resultante,
  movimentos aplicados e representacao em notacao Singmaster
- `movesToNotation(moves: Move[]): string` -- converte array de Move para string legivel
  (ex: "R U R' U' F2 D B L'")

### Regras de geracao
- Movimentos sao gerados aleatoriamente do conjunto `{ R, R', R2, L, L', L2, U, U', U2, D, D', D2, F, F', F2, B, B', B2 }`
- Nao pode haver 2 movimentos consecutivos na mesma face (ex: R R' e invalido, R L e valido)
- Nao pode haver 3 movimentos consecutivos na mesma faces em qualquer direcao (ex: R L R e invalido,
  R L R' e valido)
- A seed, quando fornecida, deve produzir sempre a mesma sequencia de movimentos
- O RNG deve ser um PRNG simples e deterministico (ex: mulberry32 ou similar)

### Funcoes auxiliares
- `validateScramble(moves: Move[]): boolean` -- verifica se sequencia obedece regras de scrambling
- `randomMove(rng: () => number): Move` -- gera um movimento aleatorio usando o RNG fornecido

## Criterio de aceite
1. Testes unitarios em `src/core/scramble.test.ts` verificam:
   - `generateScramble()` retorna array com 20 movimentos por padrao
   - `generateScramble({ length: 10 })` retorna array com 10 movimentos
   - Nenhum par consecutivo de movimentos na mesma face
   - Nenhum padrao de 3 movimentos na mesma faces invalido
   - `generateScramble({ seed: 42 )` sempre retorna a mesma sequencia
   - Seeds diferentes produzem sequencias diferentes
   - `scrambleCube()` retorna cube diferente do resolvido
   - `movesToNotation()` produce string na notacao Singmaster correta
   - `validateScramble()` rejeita sequencias com movimentos redundantes
2. Todos os testes passam com `npm test`
3. `npm run lint` retorna sem erros

# Spec 0 -- State Builder (Edicao de Faces)

## Descricao
Implementacao de funcoes puras para construir o estado do cubo a partir de configuracao
manual de cada face, mais componente React que permite ao usuario configurar visualmente
as cores de cada sticker do cubo. Esta funcionalidade e a base para permitir que o usuario
defina qualquer estado do cubo antes de usar o solver.

## Requisitos

### Funcoes puras (core)
- `buildCubeState(faces: FaceConfig): CubeState` -- recebe configuracao das 6 faces e
  retorna um CubeState valido
- `FaceConfig = Record<FaceName, string[]>` -- onde `FaceName = 'U' | 'D' | 'F' | 'B' | 'L' | 'R'`
  e cada `string[]` e um array de 9 elementos representando os stickers da face (ordem row-major)
- `validateFaceConfig(faces: FaceConfig): ValidationResult` -- valida se a configuracao e
  um estado cubo valido (exatamente 9 stickers por face, cores sao validas, cada cor aparece
  exatamente 9 vezes no cubo inteiro)
- `STICKER_COLORS = ['W', 'Y', 'G', 'B', 'O', 'R']` -- constantes das cores validas
- `faceConfigFromCubeState(cube: CubeState): FaceConfig` -- converte CubeState para FaceConfig
  (util para edicao de estado existente)

### Componente React (FaceEditor)
- `FaceEditor` componente que recebe `value: FaceConfig` e `onChange: (config: FaceConfig) => void`
- Renderiza as 6 faces do cubo no layout classico (cross/net)
- Cada sticker e clicavel -- ao clicar, cicla entre as cores validas (ou abre seletor de cores)
- Indicador visual da cor selecionada (hover/active state)
- Sticker invalido exibe borda vermelha (validacao em tempo real)
- Layout responsivo: faces empilhadas em mobile, layout net em desktop
- Touch-friendly: targets de pelo menos 44px para cada sticker
- Botao "Aplicar" que chama `onChange` com a configuracao validada
- Botao "Limpar" que reseta todas as faces para o cubo resolvido

### Integracao
- `FaceEditor` pode ser usado独立emente (para editar estado) ou integrado ao solver UI
- Ao editar e aplicar, o estado e disponibilizado para o solver

## Criterio de aceite
1. Testes unitarios em `src/core/state-builder.test.ts` verificam:
   - `buildCubeState` retorna CubeState valido para configuracao correta
   - `validateFaceConfig` rejeita configuracao com numero invalido de stickers
   - `validateFaceConfig` rejeita cores invalidas
   - `validateFaceConfig` rejeita cubo com contagem incorreta de cores (ex: 8 brancas)
   - `faceConfigFromCubeState` e `buildCubeState` sao inversas (roundtrip)
2. Testes de componente em `src/components/FaceEditor.test.tsx` verificam:
   - Renderiza 6 faces com 9 stickers cada
   - Clicar em sticker cicla a cor
   - `onChange` e chamado com configuracao validada ao clicar "Aplicar"
   - Stickers invalidos mostram indicador visual de erro
   - Layout responsivo (verificavel via testes de viewport)
3. Todos os testes passam com `npm test`
4. `npm run lint` retorna sem erros

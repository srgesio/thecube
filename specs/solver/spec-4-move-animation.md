# Spec 4 -- Move Animation (Animacoes de Movimento)

## Descricao
Adicao de transicoes CSS suaves ao CubeVisualizer para que movimentos do cubo sejam
animados visualmente. Quando um movimento e aplicado, a face afetada exibe uma transicao
de transform/opacidade que indica a direcao do movimento. A animacao e leve, responsiva
e respeita preferencias de acessibilidade do sistema.

## Requisitos

### Estilos de animacao
- Cada sticker deve ter `transition` CSS aplicado (propriedade: `transform, opacity, background-color`)
- Duracao padrao: 200ms (configuravel via prop)
- Easing: `ease-in-out` para movimentos naturais
- Quando um move e aplicado:
  - A face rotacionada deve ter uma leve animacao de `rotate` (visual feedback)
  - Stickers que mudam de posicao devem ter `opacity` transitando de 0.7 para 1.0
  - Background-color do sticker deve transitar suavemente se a cor mudar

### Classes CSS / Tailwind
- `animate-move-cw`: animacao de rotacao horaria (face inteira)
- `animate-move-ccw`: animacao de rotacao anti-horaria (face inteira)
- `animate-sticker-change`: transicao de cor no sticker
- `transition-sticker`: classe base com as propriedades de transicao
- Usar `@keyframes` leves para as animacoes de rotacao

### Deteccao de movimento
- O `CubeVisualizer` deve aceitar prop `lastMove?: Move | null`
- Quando `lastMove` muda, a face correspondente recebe a classe de animacao
- A animacao e removida apos a duracao (via `onAnimationEnd` ou timeout)
- Se `lastMove` e null, nenhuma animacao e aplicada

### Configuracao
- `animationDuration?: number` prop no CubeVisualizer (padrao: 200ms)
- `enableAnimations?: boolean` prop (padrao: true)
- Quando `enableAnimations` e false, nenhuma animacao e aplicada

### Acessibilidade
- Respeitar `prefers-reduced-motion: reduce` do CSS do sistema
- Quando reduzido, desabilitar todas as animacoes (duration = 0)
- Usar `window.matchMedia` ou CSS `@media (prefers-reduced-motion: reduce)`

### Performance
- Animacoes devem usar `transform` e `opacity` (propriedades GPU-acelerated)
- Nao animar `width`, `height`, `top`, `left` (causa layout thrashing)
- Usar `will-change: transform` nos elementos animados
- Em mobile, animacoes nao devem causar frame drops (manter 60fps)

### Mobile
- Animacoes leves em dispositivos moveis (duracao pode ser reduzida automaticamente)
- Touch devices: adicionar `:active` state nos stickers para feedback tátil visual
- Nao usar animacoes que atrapalhem o scroll ou interacao

## Criterio de aceite
1. Testes em `src/components/CubeVisualizer.test.tsx` verificam:
   - Quando `lastMove` e fornecido, a face afetada recebe classe de animacao
   - A animacao e removida apos a duracao
   - Quando `enableAnimations` e false, nenhuma classe de animacao e aplicada
   - `animationDuration` e respeitado (via CSS ou test de estilo)
   - `prefers-reduced-motion` e respeitado (mock de matchMedia no teste)
2. Todos os testes passam com `npm test`
3. `npm run lint` retorna sem erros

# Spec 5 -- Solver UI (Interface Completa do Solver)

## Descricao
Interface completa que integra todas as funcionalidades do modulo solver: visualizacao do cubo
com animacoes, edicao de faces, geracao de scrambles, resolucao passo a passo e controles de
reproducao. A interface e responsiva, funcionando bem em desktop e mobile, com layout adaptavel
e controles touch-friendly.

## Requisitos

### Modos da interface
A interface deve ter 3 modos de operacao, acessiveis via tabs ou toggle:

#### Modo Scramble
- Botao "Embaralhar" que gera scramble aleatorio e aplica ao cubo
- Exibe notacao do scramble gerado (string Singmaster)
- Botao "Novo Scramble" para gerar outro
- Botao "Resolver" que muda para o modo Solve e inicia resolucao
- Opcao de configurar tamanho do scramble (10/15/20/25 movimentos)

#### Modo Edit
- Renderiza o `FaceEditor` (Spec 0) para edicao manual de cada face
- Botao "Aplicar" que atualiza o estado do cubo
- Botao "Resolver" que muda para o modo Solve
- Botao "Restaurar" que volta ao cubo resolvido
- Feedback visual de validacao (bordas vermelhas em faces invalidas)

#### Modo Solve
- Exibe `CubeVisualizer` com animacoes (Spec 4)
- Controles de player (Spec 3):
  - Botoes: |< (inicio), < (passo anterior), > (proximo passo), >| (fim)
  - Play/Pause toggle
  - Barra de progresso (clickavel para pular para posicao)
  - Velocidade: slider ou botoes (- / +)
- Lista de fases com indicador de fase atual:
  - "1. Cruz Branca" (icone de check quando completa)
  - "2. Cantos Primeira Camada"
  - "3. Arestas Segunda Camada"
  - "4. Cruz Amarela"
  - "5. OLL Simplificado"
  - "6. PLL Simplificado"
- Indicador textual: "Movimento 12/87 | Fase 2/6"
- Historico de movimentos aplicados (scrollavel)

### Layout responsivo

#### Desktop (>768px)
- Layout horizontal: cubo a esquerda, controles a direita
- CubeVisualizer centralizado na area esquerda
- Painel de controles a direita com tabs (Scramble/Edit/Solve)
- Minimo 2 colunas: cubo + controles

#### Mobile (<=768px)
- Layout vertical empilhado
- CubeVisualizer no topo (tamanho ajustado)
- Controles abaixo do cubo
- Tabs como scroll horizontal ou bottom navigation
- Botoes de player com minimo 48px de tap target
- Historico de movimentos como drawer/sheet expansivel

### Integracao
- `SolverUI` e o componente raiz do modulo solver
- Consome `useSolver` (Spec 3) para logica de resolucao
- Consome `useCube` (core) para estado do cubo quando nao em modo solve
- Consome `FaceEditor` (Spec 0) para modo Edit
- Consome `CubeVisualizer` (core + Spec 4) para visualizacao com animacoes
- Consome `generateScramble` / `scrambleCube` (Spec 1) para modo Scramble
- Consome `solve` (Spec 2) para iniciar resolucao

### Acessibilidade
- Todos os botoes devem ter `aria-label` descritivo
- Indicador de fase deve usar `aria-current="step"` na fase ativa
- Barra de progresso deve ter `role="progressbar"` com `aria-valuenow`
- Contraste de cores WCAG AA (4.5:1 para texto, 3:1 para componentes)
- Navegacao por teclado: tab entre controles, enter para ativar

### Performance
- Re-renders minimos: usar `React.memo` nos componentes pesados
- `useCallback` nas funcoes de handler passadas como props
- Animacoes nao devem causar re-render do cubo inteiro
- Lazy loading do FaceEditor (so carrega quando modo Edit e selecionado)

## Criterio de aceite
1. Testes em `src/components/SolverUI.test.tsx` verificam:
   - Renderiza 3 modos (Scramble/Edit/Solve) acessiveis via tabs
   - Modo Scramble: botao "Embaralhar" gera scramble e atualiza cubo
   - Modo Edit: FaceEditor e renderizado e funcional
   - Modo Solve: controles de player sao renderizados
   - Controles de player: play/pause/next/prev funcionam
   - Barra de progresso reflete o progresso correto
   - Lista de fases mostra todas as 6 fases
   - Layout muda entre desktop e mobile (testes com diferentes viewports)
   - Botoes tem minimo 44px de tap target
   - Aria labels estao presentes em todos os botoes interativos
2. Todos os testes passam com `npm test`
3. `npm run lint` retorna sem erros

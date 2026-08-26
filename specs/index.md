# Plano de Spec-Driven Development — TheCube

## Estrutura Geral
O projeto será dividido em 7 specs, cada uma com seus próprios requisitos, modelo de dados e testes. Cada spec deve ser implementada e validada antes de avançar para a próxima.

---

## Specs

### Spec 0 — Projeto Base (Scaffolding)

#### Descrição
Esta spec define a configuração inicial do projeto, incluindo a criação do projeto Next.js com TypeScript, configuração de ferramentas de desenvolvimento e estrutura de pastas. Detalhes presentes no arquivo `spec-0-project-base.md`.

---

### Spec 1 — Modelo de Dados do Cubo

#### Descrição
A estrutura de dados que representa o estado de um cubo mágico 3x3. Detalhes presentes no arquivo `spec-1-cube-rules.md`.

---

### Spec 2 — Movimentos do Cubo (Core Logic)

#### Descrição
Implementação das 12+6 movimentos básicos do cubo mágico. Detalhes presentes no arquivo `spec-2-cube-moves.md`.


---

### Spec 3 — Parser de Notação (Singmaster)

#### Descrição
Parse de strings de movimentos no formato padrão. Detalhes presentes no arquivo `spec-3-cube-notation.md`.

---

### Spec 4 — Gerenciamento de Estado (React)

#### Descrição
Hooks e contexto React para gerenciar o estado do cubo. Detalhes presentes no arquivo `spec-4-state-management.md`.

---

### Spec 5 — Visualização 2D do Cubo

#### Descrição
Componente que renderiza o cubo "desdobrado" (net/cross layout). Detalhes presentes no arquivo `spec-5-cube-display.md`.

---

### Spec 6 — Interface do Usuário (Input + Integração)

#### Descrição
Interface completa para interação com o cubo. Detalhes presentes no arquivo `spec-6-interface-controls.md`.


---

## Ordem de Execução

Spec 0  →  Spec 1  →  Spec 2  →  Spec 3  →  Spec 4  →  Spec 5  →  Spec 6
(project base) (rules)  (moves)  (notation)  (state)  (2D visual)  (UI completa)


Cada spec será entregue como:
1. Documento em specs/spec-N-name.md com requisitos detalhados
2. Arquivos de teste primeiro (TDD)
3. Implementação
4. Verificação: todos os testes passam + lint limpo
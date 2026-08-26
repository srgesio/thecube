# Spec 0 — Projeto Base (Scaffolding)

## Descrição
Esta spec define a configuração inicial do projeto, incluindo a criação do projeto Next.js com TypeScript, configuração de ferramentas de desenvolvimento e estrutura de pastas.

## Requisitos
- Criar projeto Next.js (App Router) com TypeScript
- Configurar Tailwind CSS
- Configurar Vitest para testes unitários (com @testing-library/react e jsdom)
- Configurar ESLint + Prettier
- Criar estrutura de pastas:
  src/
    core/          ← lógica pura do cubo (sem React)
    components/    ← componentes React
    hooks/         ← hooks de estado
    app/           ← pages/rotas Next.js
  specs/           ← documentos de spec
  tests/           ← testes de integração (se necessário)
- Criar script npm test e npm run test:watch

## Critério de aceite
- npm test roda sem erro
- npm run dev inicia o app.
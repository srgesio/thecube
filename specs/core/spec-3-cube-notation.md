Spec 3 — Parser de Notação (Singmaster)
Parse de strings de movimentos no formato padrão
Requisitos:
- Função parseNotation(input: string): Move[]
- Suporta: R U F L D B e variações R' R2 U' U2 F2 etc.
- Suporta espaços, separadores variados
- Lança erro para notação inválida
- Função validateNotation(input: string): boolean
- Validação robusta (uppercase/lowercase handling)
Critério de aceite: Testes cobrem strings válidas, inválidas, edge cases.
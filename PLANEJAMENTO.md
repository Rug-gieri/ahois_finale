# Planejamento Futuro — Otimizações (Auditoria React Best Practices)

## CRÍTICO (Bundle + Waterfall)

- [ ] **Mover Supabase para API route** — `CartDrawer.svelte` importa `getSupabase`, puxando `@supabase/supabase-js` (~55 KB gzip) para o bundle do cliente. Criar `src/pages/api/pedido.ts` e trocar `getSupabase()` por `fetch('/api/pedido')`.
- [ ] **Paralelizar inserts** — API route deve usar `Promise.all()` para inserts de cliente + pedido.
- [ ] **Deduplicar `finalizar()`** — impedir que double-click ou chamada repetida cause pedido duplicado.

## ALTO (Dashboard Admin)

- [ ] **`carregar()` por aba** — buscar apenas a tabela da aba ativa no admin, não as 3 (produtos, endereços, pedidos) sempre.
- [ ] **Patch local no update** — ao alterar status/rastreio de um pedido, atualizar array `pedidos` em memória em vez de recarregar todas as 3 tabelas com `await carregar()`.
- [ ] **Deduplicar `carregar()`** — evitar race condition em chamadas consecutivas que disparam múltiplos fetches sobrepostos.

## MÉDIO (Rendering + Hidratação)

- [ ] **`CartDrawer` `client:idle`** — trocar de `client:load` para `client:idle` no `index.astro` para não competir com a hidratação do catálogo.
- [ ] **`CartDrawer` DOM condicional** — trocar CSS hide (`translate-x-full`) por `{#if aberto}` com `transition:slide` para não manter nós do DOM sempre montados.
- [ ] **`content-visibility` no catálogo** — adicionar `content-visibility: auto` na grid de produtos (`Catalogo.svelte`) e nos cards (`ProductCard.svelte`) para catálogos maiores.

## BAIXO (Micro-otimizações)

- [ ] **`cart.svelte.ts`** — adicionar `Map<number, CartItem>` para lookup O(1) em `add()`, `remove()`, `updateQuantity()` (atualmente usa `.find()` O(n)).
- [ ] **`frete.ts`** — pré-construir `Map<string, RegiaoFrete>` (UF → região) para lookup O(1) em `getRegiao()`.
- [ ] **`Dashboard statusCor()`** — extrair objeto de cores para constante de módulo, evitando recriação a cada chamada.
- [ ] **Cache com TTL** no `produtos.ts` — expirar cache após 60s para não servir dados stale indefinidamente no SSR.
- [ ] **Google Fonts self-host** — baixar Inter (latim, woff2, pesos 400/500/600/700) e servir localmente para eliminar FOUT e requisição externa bloqueante.

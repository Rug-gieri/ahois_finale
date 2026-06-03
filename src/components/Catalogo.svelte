<script>
  import ProductCard from './ProductCard.svelte'
  import { cart } from '../lib/cart.svelte'

  let { produtos, categorias } = $props()

  let filtro = $state('Todos')
  let filtered = $derived(filtro === 'Todos' ? produtos : produtos.filter(p => p.category === filtro))
</script>

<section id="catalogo" class="max-w-7xl mx-auto px-4 py-16 md:py-24">
  <h2 class="text-3xl md:text-4xl font-bold text-marrom-escuro text-center mb-8">
    Catálogo
  </h2>

  <div class="flex flex-wrap justify-center gap-2 mb-10">
    <button
      onclick={() => filtro = 'Todos'}
      class="px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200
             {filtro === 'Todos'
               ? 'bg-marrom-escuro text-bege'
               : 'bg-bege text-marrom-escuro hover:bg-marrom-claro hover:text-bege'}"
    >
      Todos
    </button>
    {#each categorias as categoria}
      <button
        onclick={() => filtro = categoria}
        class="px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200
               {filtro === categoria
                 ? 'bg-marrom-escuro text-bege'
                 : 'bg-bege text-marrom-escuro hover:bg-marrom-claro hover:text-bege'}"
      >
        {categoria}
      </button>
    {/each}
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each filtered as product}
      <ProductCard {product} />
    {/each}
  </div>

  {#if cart.count > 0}
    <div class="mt-8 text-center text-sm text-marrom-claro/60">
      {cart.count} {cart.count === 1 ? 'item' : 'itens'} no carrinho
    </div>
  {/if}
</section>

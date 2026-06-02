<script>
  import { onMount } from 'svelte'
  import { getSupabase } from '../lib/supabase'
  import { categorias, exemplares } from '../data/produtos'
  import ProductCard from './ProductCard.svelte'
  import { cart } from '../lib/cart.svelte'

  let filtro = $state('Todos')
  let produtos = $state([])
  let carregando = $state(true)

  onMount(async () => {
    const sb = getSupabase()
    if (!sb) {
      produtos = exemplares
      carregando = false
      return
    }
    try {
      const { data, error: dbError } = await sb.from('produtos').select('*').eq('active', true).order('id')
      if (dbError) throw dbError
      produtos = data && data.length > 0 ? data : exemplares
    } catch (err) {
      produtos = exemplares
    }
    carregando = false
  })
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

  {#if carregando}
    <p class="text-center text-marrom-claro/50 py-12">Carregando...</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each produtos.filter((p) => filtro === 'Todos' || p.category === filtro) as product}
        <ProductCard {product} />
      {/each}
    </div>
  {/if}

  {#if cart.count > 0}
    <div class="mt-8 text-center text-sm text-marrom-claro/60">
      {cart.count} {cart.count === 1 ? 'item' : 'itens'} no carrinho
    </div>
  {/if}
</section>

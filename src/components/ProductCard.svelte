<script>
  import { cart } from '../lib/cart.svelte'

  let { product } = $props()
</script>

<div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
  <div class="w-full aspect-square bg-bege flex items-center justify-center text-6xl select-none relative overflow-hidden">
    {#if product.image_url}
      <img src={product.image_url} alt={product.name} class="absolute inset-0 w-full h-full object-cover" width="400" height="400" />
    {:else}
      {product.emoji}
    {/if}
  </div>
  <div class="p-4 flex flex-col gap-2 flex-1">
    <h3 class="font-semibold text-marrom-escuro text-lg leading-tight">
      {product.name}
    </h3>
    <p class="text-sm text-marrom-claro/70 leading-relaxed line-clamp-2 flex-1">
      {product.description}
    </p>
    <p class="text-xl font-bold text-marrom-escuro mt-1">
      R$ {Number(product.price).toFixed(2)}
    </p>
    <button
      onclick={() => cart.add(product)}
      class="w-full bg-marrom-escuro text-bege rounded-full py-2.5 font-semibold text-sm cursor-pointer
             hover:bg-marrom-claro transition-colors duration-200"
    >
      Adicionar ao carrinho
    </button>
  </div>
</div>

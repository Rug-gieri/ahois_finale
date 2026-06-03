<script>
  import { fade } from 'svelte/transition'
  import { cart } from '../lib/cart.svelte'
  import { getSupabase } from '../lib/supabase'

  let aberto = $state(false)
  let nome = $state('')
  let salvando = $state(false)
  let aviso = $state('')
  let timeoutAviso = $state(null)

  const PHONE = '556992366937'

  function mostrarAviso(msg) {
    aviso = msg
    if (timeoutAviso) clearTimeout(timeoutAviso)
    timeoutAviso = setTimeout(() => { aviso = '' }, 2500)
  }

  function abrirCarrinho() {
    if (cart.items.length === 0) {
      mostrarAviso('Seu carrinho está vazio! Adicione itens do catálogo.')
      return
    }
    aberto = true
  }

  async function finalizar() {
    salvando = true
    const sb = getSupabase()
    const pedidoItems = cart.items.map((i) => ({
      product_id: i.product.id,
      product_name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
    }))

    if (sb) {
      ;(async () => {
        try {
          const { data: cliente } = await sb
            .from('clientes')
            .insert({ name: nome || 'Cliente WhatsApp', phone: PHONE })
            .select()
            .single()

          await sb.from('pedidos').insert({
            cliente_id: cliente?.id ?? null,
            cliente_nome: nome || 'Cliente WhatsApp',
            cliente_phone: PHONE,
            items: pedidoItems,
            total: cart.total,
            status: 'pending',
          })
        } catch {
          /* fallback: apenas WhatsApp */
        }
      })()
    }

    window.open(cart.whatsappUrl(PHONE), '_blank', 'noopener')
    salvando = false
  }
</script>

<!-- Floating cart button -->
<button
  onclick={abrirCarrinho}
  class="fixed bottom-4 right-4 z-50 bg-marrom-escuro text-bege rounded-full p-4 shadow-xl cursor-pointer
         hover:bg-marrom-claro transition-colors duration-200"
  aria-label="Abrir carrinho"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
  {#if cart.count > 0}
    <span class="absolute -top-1 -right-1 bg-bege text-marrom-escuro text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cart.count > 99 ? '99+' : cart.count}
    </span>
  {/if}
</button>

<!-- Floating WhatsApp button -->
<a
  href="https://wa.me/556992366937?text=Olá! Gostaria de saber mais sobre as peças do Ateliê Ahois."
  target="_blank"
  rel="noopener"
  class="fixed bottom-4 left-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl transition-colors duration-200 animate-whatsapp-pulse"
  aria-label="Fale conosco no WhatsApp"
>
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
</a>

<!-- Toast notification -->
{#if aviso}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed bottom-24 right-4 z-50 bg-marrom-escuro text-bege px-5 py-3 rounded-xl shadow-xl text-sm max-w-xs"
  >
    <div class="flex items-center gap-2">
      <span class="text-base">🧶</span>
      <span>{aviso}</span>
    </div>
  </div>
{/if}

<!-- Backdrop -->
{#if aberto}
  <div
    onclick={() => aberto = false}
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
  ></div>
{/if}

<!-- Drawer -->
<div
  class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-branco shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
         {aberto ? 'translate-x-0' : 'translate-x-full'}"
>
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 border-b border-bege">
    <h2 class="text-xl font-bold text-marrom-escuro">Seu Carrinho</h2>
    <button
      onclick={() => aberto = false}
      class="text-marrom-claro hover:text-marrom-escuro cursor-pointer transition-colors"
      aria-label="Fechar carrinho"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Items or empty state -->
  <div class="flex-1 overflow-y-auto px-6 py-4">
    {#if cart.items.length === 0}
      <div class="flex flex-col items-center justify-center h-full text-center gap-4">
        <span class="text-6xl">🧶</span>
        <p class="text-xl font-semibold text-marrom-escuro">Seu carrinho está vazio</p>
        <p class="text-sm text-marrom-claro/60 max-w-xs">
          Navegue pelo catálogo e adicione peças artesanais feitas com carinho para você!
        </p>
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        {#each cart.items as item (item.product.id)}
          <div class="flex items-center gap-4 bg-bege/30 rounded-lg p-3">
            <div class="w-12 h-12 rounded-lg bg-bege flex items-center justify-center text-2xl shrink-0">
              {item.product.emoji}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-marrom-escuro text-sm truncate">{item.product.name}</p>
              <p class="text-xs text-marrom-claro/60">R$ {item.product.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center gap-1">
              <button
                onclick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                class="w-7 h-7 rounded-full bg-marrom-escuro text-bege text-sm font-bold cursor-pointer
                       hover:bg-marrom-claro transition-colors"
                aria-label="Diminuir quantidade"
              >
                &minus;
              </button>
              <span class="w-7 text-center text-sm font-semibold text-marrom-escuro">{item.quantity}</span>
              <button
                onclick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                class="w-7 h-7 rounded-full bg-marrom-escuro text-bege text-sm font-bold cursor-pointer
                       hover:bg-marrom-claro transition-colors"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-marrom-escuro">
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                onclick={() => cart.remove(item.product.id)}
                class="text-xs text-marrom-claro/50 hover:text-red-600 cursor-pointer transition-colors"
                aria-label="Remover item"
              >
                remover
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Footer -->
  {#if cart.items.length > 0}
    <div class="border-t border-bege px-6 py-4 space-y-3">
      <input
        type="text"
        bind:value={nome}
        placeholder="Seu nome (opcional)"
        class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow"
      />
      <div class="flex justify-between items-center">
        <span class="text-base font-semibold text-marrom-escuro">Total</span>
        <span class="text-xl font-bold text-marrom-escuro">R$ {cart.total.toFixed(2)}</span>
      </div>
      <button
        onclick={finalizar}
        disabled={salvando}
        class="block w-full bg-green-600 text-white text-center font-semibold rounded-full py-3
               hover:bg-green-700 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {salvando ? 'Abrindo WhatsApp...' : 'Encomendar via WhatsApp'}
      </button>
    </div>
  {/if}
</div>

<style>
  @keyframes whatsapp-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  .animate-whatsapp-pulse {
    animation: whatsapp-pulse 2s ease-in-out infinite;
  }
</style>

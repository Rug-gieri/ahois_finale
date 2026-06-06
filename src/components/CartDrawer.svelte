<script>
  import { fade } from 'svelte/transition'
  import { cart } from '../lib/cart.svelte'
  import { calcularFrete } from '../lib/frete'
  import { getSupabase } from '../lib/supabase'

  let aviso = $state('')
  let salvando = $state(false)
  let timeoutAviso = $state(null)

  const PHONE = '556981201606'

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
    cart.aberto = true
  }

  function atualizarFrete() {
    if (!cart.cep || !cart.estado) {
      cart.freteValor = 0
      cart.freteGratis = false
      cart.freteMotivo = ''
      return
    }
    const result = calcularFrete(cart.cep, cart.estado, cart.total)
    cart.freteValor = result.valor
    cart.freteGratis = result.gratis
    cart.freteMotivo = result.motivo
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
            .insert({ name: cart.nome || 'Cliente WhatsApp', phone: PHONE })
            .select()
            .single()

          await sb.from('pedidos').insert({
            cliente_id: cliente?.id ?? null,
            cliente_nome: cart.nome || 'Cliente WhatsApp',
            cliente_phone: PHONE,
            items: pedidoItems,
            total: cart.totalComFrete,
            status: 'pending',
            cep: cart.cep || null,
            endereco: cart.endereco || null,
            cidade: cart.cidade || null,
            estado: cart.estado || null,
            complemento: cart.complemento || null,
            frete: cart.freteGratis ? 0 : cart.freteValor,
            metodo_envio: 'pac',
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

<!-- Floating cart button (mobile only, appears when cart has items) -->
{#if cart.count > 0}
  <button
    onclick={abrirCarrinho}
    class="md:hidden fixed bottom-4 right-4 z-50 bg-marrom-escuro text-bege rounded-full p-4 shadow-xl cursor-pointer
           hover:bg-marrom-claro transition-colors duration-200"
    aria-label="Abrir carrinho"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
    <span class="absolute -top-1 -right-1 bg-bege text-marrom-escuro text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cart.count > 99 ? '99+' : cart.count}
    </span>
  </button>
{/if}

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
{#if cart.aberto}
  <div
    onclick={() => cart.aberto = false}
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
  ></div>
{/if}

<!-- Drawer -->
<div
  class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-branco shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
         {cart.aberto ? 'translate-x-0' : 'translate-x-full'}"
>
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 border-b border-bege">
    <h2 class="text-xl font-bold text-marrom-escuro">Seu Carrinho</h2>
    <button
      onclick={() => cart.aberto = false}
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
      <input type="text" bind:value={cart.nome} placeholder="Nome completo" required
        class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow" />

      <div class="grid grid-cols-2 gap-2">
        <input type="text" bind:value={cart.cep} placeholder="CEP" maxlength="9" oninput={atualizarFrete}
          class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow" />
        <select bind:value={cart.estado} onchange={atualizarFrete}
          class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow">
          <option value="">Estado</option>
          <option value="RO">RO</option>
          <option value="AC">AC</option>
          <option value="AM">AM</option>
          <option value="RR">RR</option>
          <option value="PA">PA</option>
          <option value="AP">AP</option>
          <option value="TO">TO</option>
          <option value="MA">MA</option>
          <option value="PI">PI</option>
          <option value="CE">CE</option>
          <option value="RN">RN</option>
          <option value="PB">PB</option>
          <option value="PE">PE</option>
          <option value="AL">AL</option>
          <option value="SE">SE</option>
          <option value="BA">BA</option>
          <option value="MT">MT</option>
          <option value="MS">MS</option>
          <option value="GO">GO</option>
          <option value="DF">DF</option>
          <option value="SP">SP</option>
          <option value="RJ">RJ</option>
          <option value="MG">MG</option>
          <option value="ES">ES</option>
          <option value="PR">PR</option>
          <option value="SC">SC</option>
          <option value="RS">RS</option>
        </select>
      </div>

      <input type="text" bind:value={cart.endereco} placeholder="Endereço (rua e número)"
        class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow" />

      <input type="text" bind:value={cart.cidade} placeholder="Cidade"
        class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow" />

      <input type="text" bind:value={cart.complemento} placeholder="Complemento (opcional)"
        class="w-full border border-bege rounded-full px-4 py-2.5 text-sm text-marrom-escuro bg-branco placeholder:text-marrom-claro/40 focus:outline-none focus:ring-2 focus:ring-marrom-claro/30 transition-shadow" />

      {#if cart.freteMotivo}
        <div class="flex justify-between items-center text-sm">
          <span class="text-marrom-claro/70">{cart.freteMotivo}</span>
          {#if !cart.freteGratis}
            <span class="font-semibold text-marrom-escuro">R$ {cart.freteValor.toFixed(2)}</span>
          {/if}
        </div>
      {/if}

      <div class="flex justify-between items-center pt-2 border-t border-bege/50">
        <span class="text-base font-semibold text-marrom-escuro">Total</span>
        <span class="text-xl font-bold text-marrom-escuro">R$ {cart.totalComFrete.toFixed(2)}</span>
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



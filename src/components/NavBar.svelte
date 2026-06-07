<script>
  import { cart } from '../lib/cart.svelte'

  let scrolled = $state(false)
  let menuOpen = $state(false)
  let menuMounted = $state(false)
  let ticking = $state(false)
  let notificacao = $state('')

  const navLinks = [
    { href: '#', label: 'Início' },
    { href: '#materiais', label: 'Materiais' },
    { href: '#artesanato', label: 'Artesanato' },
    {
      href: 'https://www.instagram.com/atelieahois_?igsh=MXNkdzJxaWx6OWli',
      label: 'Instagram',
      external: true,
    },
  ]

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        scrolled = window.scrollY > 20
        ticking = false
      })
      ticking = true
    }
  }

  function toggleMenu() {
    menuOpen = !menuOpen
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }

  function closeMenu() {
    menuOpen = false
    document.body.style.overflow = ''
  }

  $effect(() => {
    if (menuOpen) {
      requestAnimationFrame(() => {
        menuMounted = true
      })
    } else {
      menuMounted = false
    }
  })

  $effect(() => {
    if (cart.lastAddedName) {
      notificacao = `${cart.lastAddedName} adicionado!`
      const timer = setTimeout(() => { notificacao = '' }, 2500)
      return () => clearTimeout(timer)
    }
  })
</script>

<svelte:window onscroll={onScroll} />

<!-- ===== MOBILE BAR ===== -->
<div
  class="md:hidden fixed top-3 left-3 right-3 z-50 transition-all duration-700 ease-out"
>
  <div
    class={`flex items-center justify-between rounded-2xl px-4 py-2.5 border shadow-lg transition-all duration-500 ${menuOpen ? 'bg-white/10 backdrop-blur-xl border-white/10' : scrolled ? 'bg-white/80 backdrop-blur-md border-white/20' : 'bg-white/50 backdrop-blur-sm border-white/10'}`}
  >
    <a
      href="#"
      class={`flex-shrink-0 flex items-center gap-2 transition-all duration-500`}
      aria-label="Ateliê Ahois - Início"
    >
      <img
        src="/images/wale_logo.png"
        alt="Ahois"
        class="h-8 w-auto"
      />
      <span class="font-marmelad leading-tight text-right" class:invert={menuOpen}>
        <span class="block text-sm font-bold">Ahois</span>
        <span class="block text-[10px] -mt-0.5">Ateliê</span>
      </span>
    </a>

    <button
      onclick={toggleMenu}
      class={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-500 hover:scale-105 active:scale-95 ${menuOpen ? 'bg-transparent border-white/30' : 'bg-marrom-escuro border-marrom-escuro/10'}`}
      aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      <div class="relative w-5 h-5">
        <span
          class={`absolute left-0 right-0 top-1/2 h-px transition-all duration-500 ${menuOpen ? 'bg-white rotate-45' : 'bg-bege -translate-y-[5px]'}`}
        />
        <span
          class={`absolute left-0 right-0 top-1/2 h-px transition-all duration-500 ${menuOpen ? 'bg-white -rotate-45' : 'bg-bege translate-y-[5px]'}`}
        />
      </div>
    </button>
  </div>
</div>

<!-- ===== MOBILE OVERLAY ===== -->
{#if menuOpen}
  <div
    class="md:hidden fixed inset-2 z-40 bg-marrom-escuro rounded-2xl flex flex-col overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Navegação"
  >
    <nav class="flex flex-col items-center justify-center gap-6 flex-1 pt-20 pb-12 px-6">
      {#each navLinks as link, i}
        <a
          href={link.href}
          {...link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
          onclick={closeMenu}
          class="text-white text-3xl font-medium tracking-wide hover:text-bege transition-colors duration-300 overflow-hidden"
        >
          <span
            class={`block transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] ${menuMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style="transition-delay: {0.3 + i * 0.1}s"
          >
            {link.label}
          </span>
        </a>
      {/each}
      <a
        href="#catalogo"
        onclick={closeMenu}
        class="bg-bege text-marrom-escuro text-lg font-semibold px-10 py-3.5 rounded-full hover:bg-white transition-all duration-300 active:scale-95 overflow-hidden mt-2"
      >
        <span
          class={`block transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] ${menuMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style="transition-delay: 0.7s"
        >
          Encomendar
        </span>
      </a>
    </nav>
  </div>
{/if}

<!-- ===== DESKTOP NAVBAR (two pills) ===== -->
<nav
  class="hidden md:block fixed top-0 left-0 right-0 z-30 px-6 pt-5 navbar-animate"
>
  <div class="flex items-center justify-between">
    <!-- Logo pill -->
    <div class="relative rounded-3xl px-7 py-4">
      <div class="absolute inset-0 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/10 shadow-lg transition-opacity duration-500 {scrolled ? 'opacity-100' : 'opacity-0'}" />
      <a href="#" aria-label="Ateliê Ahois - Início" class="relative flex items-center gap-3">
        <img
          src="/images/wale_logo.png"
          alt="Ahois"
          class="h-11 w-auto"
        />
        <span class="font-marmelad leading-tight text-marrom-escuro text-right">
          <span class="block text-lg font-bold">Ahois</span>
          <span class="block text-xs -mt-0.5">Ateliê</span>
        </span>
      </a>
    </div>

    <!-- Nav links pill -->
    <div
      class="bg-white/50 backdrop-blur-sm rounded-3xl px-5 py-3 border border-white/10 shadow-lg flex items-center gap-1"
    >
      {#each navLinks as link}
        <a
          href={link.href}
          {...link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
          class="text-marrom-escuro/80 text-base font-medium tracking-wide px-4 py-2.5 rounded-xl hover:bg-marrom-escuro/5 hover:text-marrom-escuro transition-all duration-300"
        >
          {link.label}
        </a>
      {/each}

      <!-- Cart button -->
      <div class="relative">
        <button
          onclick={() => { cart.aberto = !cart.aberto; cart.clearLastAdded() }}
          class="relative text-marrom-escuro/80 text-base font-medium tracking-wide px-4 py-2.5 rounded-xl hover:bg-marrom-escuro/5 hover:text-marrom-escuro transition-all duration-300 flex items-center gap-1.5"
          aria-label={cart.aberto ? 'Fechar carrinho' : 'Abrir carrinho'}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Carrinho
          {#if cart.count > 0}
            <span class="absolute -top-0.5 -right-0.5 bg-marrom-escuro text-bege text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
              {cart.count > 99 ? '99+' : cart.count}
            </span>
          {/if}
        </button>

        <!-- Notification toast -->
        {#if notificacao}
          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-marrom-escuro text-bege text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg animate-notification-pop z-50">
            {notificacao}
          </div>
        {/if}
      </div>

      <a
        href="#catalogo"
        class="bg-marrom-escuro text-bege text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-marrom-claro transition-all duration-300 active:scale-95 ml-1"
      >
        Encomendar
      </a>
    </div>
  </div>
</nav>

<style>
  @keyframes notification-pop {
    0% { transform: translate(-50%, 8px); opacity: 0; }
    15% { transform: translate(-50%, 0); opacity: 1; }
    85% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, -4px); opacity: 0; }
  }
  .animate-notification-pop {
    animation: notification-pop 2.5s ease-out forwards;
  }
</style>

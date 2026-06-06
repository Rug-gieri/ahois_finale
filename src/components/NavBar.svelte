<script>
  let scrolled = $state(false)
  let menuOpen = $state(false)
  let menuMounted = $state(false)
  let ticking = $state(false)

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
      class={`flex-shrink-0 transition-all duration-500 ${menuOpen ? 'invert' : ''}`}
      aria-label="Ateliê Ahois - Início"
    >
      <img
        src="/images/footer_logo.png"
        alt="Ateliê Ahois"
        class="h-8 w-auto brightness-0"
      />
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
    <div
      class="bg-white/50 backdrop-blur-sm rounded-3xl px-8 py-5 border border-white/10 shadow-lg transition-all duration-500"
    >
      <a href="#" aria-label="Ateliê Ahois - Início" class="block">
        <img
          src="/images/footer_logo.png"
          alt="Ateliê Ahois"
          class="h-11 w-auto brightness-0"
        />
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
      <a
        href="#catalogo"
        class="bg-marrom-escuro text-bege text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-marrom-claro transition-all duration-300 active:scale-95 ml-1"
      >
        Encomendar
      </a>
    </div>
  </div>
</nav>

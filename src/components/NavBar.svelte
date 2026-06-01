<script>
  let visible = $state(false);
  let menuOpen = $state(false);

  function onScroll() {
    visible = window.scrollY > window.innerHeight * 0.8;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    menuOpen = false;
    document.body.style.overflow = '';
  }
</script>

<svelte:window onscroll={onScroll} />

<!-- Mobile hamburger -->
<button
  onclick={toggleMenu}
  class="md:hidden fixed top-4 right-4 z-50 p-2.5 rounded-full bg-marrom-escuro/85 backdrop-blur-md text-bege shadow-lg border border-bege/10 transition-all duration-300 hover:bg-marrom-escuro active:scale-90"
  aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    {#if menuOpen}
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    {:else}
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    {/if}
  </svg>
</button>

<!-- Mobile overlay -->
{#if menuOpen}
  <div
    class="md:hidden fixed inset-0 z-40 bg-marrom-escuro/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10"
    onclick={(e) => { if (e.target === e.currentTarget) closeMenu(); }}
    role="dialog"
    aria-modal="true"
    aria-label="Navegação"
  >
    <a href="#" onclick={closeMenu} class="text-bege text-2xl font-semibold tracking-wide hover:text-white transition-colors">
      Início
    </a>
    <a href="#materiais" onclick={closeMenu} class="text-bege/70 text-2xl font-medium tracking-wide hover:text-white transition-colors">
      Materiais
    </a>
    <a href="#artesanato" onclick={closeMenu} class="text-bege/70 text-2xl font-medium tracking-wide hover:text-white transition-colors">
      Artesanato
    </a>
    <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer"
       class="bg-bege text-marrom-escuro text-lg font-semibold px-10 py-3.5 rounded-full hover:bg-white transition-all duration-300 active:scale-95 mt-2"
       onclick={closeMenu}>
      Encomendar
    </a>
  </div>
{/if}

<!-- Desktop navbar -->
<nav
  class="hidden md:block fixed top-0 left-0 right-0 z-30 transition-all duration-700 ease-out"
  class:translate-y-0={visible}
  class:-translate-y-full={!visible}
  class:opacity-100={visible}
  class:opacity-0={!visible}
  class:pointer-events-none={!visible}
>
  <div class="flex justify-center mt-2">
    <div class="bg-marrom-escuro/85 backdrop-blur-md rounded-full px-4 py-2 flex items-center justify-center gap-6 shadow-lg border border-bege/10">
      <a href="#" class="text-bege text-sm font-semibold tracking-wide hover:text-white transition-colors">
        Início
      </a>
      <a href="#materiais" class="text-bege/70 text-sm font-medium tracking-wide hover:text-white transition-colors">
        Materiais
      </a>
      <a href="#artesanato" class="text-bege/70 text-sm font-medium tracking-wide hover:text-white transition-colors">
        Artesanato
      </a>
      <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer"
         class="bg-bege text-marrom-escuro text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-white transition-colors">
        Encomendar
      </a>
    </div>
  </div>
</nav>

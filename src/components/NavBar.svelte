<script>
  let visible = $state(false);

  function onScroll() {
    visible = window.scrollY > window.innerHeight * 0.8;
  }
</script>

<svelte:window onscroll={onScroll} />

<nav
  class="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500"
  class:translate-y-0={visible}
  class:-translate-y-full={!visible}
  class:opacity-100={visible}
  class:opacity-0={!visible}
  class:pointer-events-none={!visible}
>
  <div class="flex justify-center mt-2">
    <div
      class="bg-marrom-escuro/85 backdrop-blur-md rounded-full px-4 py-2
             flex items-center justify-center gap-6 shadow-lg border border-bege/10"
    >
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

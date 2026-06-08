<script>
  let visivel = $state(false)
  let ticking = $state(false)

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        visivel = window.scrollY > 400
        ticking = false
      })
      ticking = true
    }
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<svelte:window onscroll={onScroll} />

<button
  onclick={scrollTop}
  class={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-bege/60 backdrop-blur-sm hover:bg-bege text-marrom-escuro flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
  aria-label="Voltar ao topo"
>
  <svg class="w-5 h-5 rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</button>

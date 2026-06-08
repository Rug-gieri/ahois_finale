<script>
  let visivel = $state(false)

  $effect(() => {
    const consentido = localStorage.getItem('cookie-consent')
    if (!consentido) {
      requestAnimationFrame(() => { visivel = true })
    }
  })

  function aceitar() {
    localStorage.setItem('cookie-consent', 'true')
    visivel = false
  }
</script>

{#if visivel}
  <div class="fixed bottom-0 left-0 right-0 z-[100] animate-slide-up">
    <div class="bg-marrom-escuro/95 backdrop-blur-md border-t border-bege/10 px-6 py-4">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-bege/80 text-sm text-center sm:text-left max-w-2xl">
          Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site. Ao continuar navegando, você concorda com nossa política de privacidade.
        </p>
        <div class="flex items-center gap-3 shrink-0">
          <a
            href="#"
            class="text-bege/50 hover:text-bege text-sm underline underline-offset-2 transition-colors"
          >
            Saber mais
          </a>
          <button
            onclick={aceitar}
            class="bg-bege text-marrom-escuro font-semibold px-6 py-2 rounded-full text-sm hover:bg-white transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
</style>

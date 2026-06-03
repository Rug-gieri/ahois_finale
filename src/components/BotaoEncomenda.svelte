<script>
  let { href = undefined } = $props()
</script>

{#if href}
  <a
    {href}
    target="_blank"
    rel="noopener noreferrer"
    class="group bg-gradient-to-b from-bege to-bege/85 text-marrom-escuro font-semibold px-8 py-4 rounded-full inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 hover:from-bege hover:to-bege/70"
  >
    Encomende agora
    <svg
      class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
      fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </a>
{:else}
  <button
    class="group bg-gradient-to-b from-bege to-bege/85 text-marrom-escuro font-semibold px-8 py-4 rounded-full inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 hover:from-bege hover:to-bege/70"
  >
    Encomende agora
    <svg
      class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
      fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </button>
{/if}

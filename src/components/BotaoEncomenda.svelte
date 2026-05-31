<script>
  let hovering = $state(false);
</script>

<button
  class="bg-bege text-marrom-escuro font-semibold px-8 py-4 rounded-full flex items-center gap-3 text-lg cursor-pointer transition-all duration-300 hover:bg-marrom-escuro hover:text-bege hover:scale-105 shadow-lg hover:shadow-xl"
  onmouseenter={() => hovering = true}
  onmouseleave={() => hovering = false}
>
  Encomende agora
  <svg
    class="w-5 h-5 transition-transform duration-300 {hovering ? 'translate-x-1' : 'translate-x-0'}"
    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</button>
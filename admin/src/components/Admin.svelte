<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'
  import Dashboard from './Dashboard.svelte'

  let loggedIn = $state(false)
  let email = $state('')
  let password = $state('')
  let loading = $state(false)
  let erro = $state('')
  let checking = $state(true)

  onMount(async () => {
    if (!supabase) {
      erro = 'Supabase não configurado. Configure PUBLISH_SUPABASE_URL e PUBLISH_SUPABASE_ANON_KEY no .env'
      checking = false
      return
    }
    const { data } = await supabase.auth.getSession()
    if (data.session) loggedIn = true
    checking = false

    supabase.auth.onAuthStateChange((_event, session) => {
      loggedIn = !!session
    })
  })

  async function login() {
    erro = ''
    if (!email || !password) {
      erro = 'Preencha email e senha.'
      return
    }
    if (!supabase) return
    loading = true
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    loading = false
    if (error) {
      erro = error.message
      return
    }
  }

  function entrarDemo() {
    loggedIn = true
  }

  async function logout() {
    if (!supabase) {
      loggedIn = false
      return
    }
    await supabase.auth.signOut()
  }
</script>

{#if checking}
  <div class="min-h-screen flex items-center justify-center bg-branco">
    <p class="text-marrom-escuro/40 text-lg">Carregando...</p>
  </div>
{:else if !loggedIn}
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-bege to-branco p-4 relative">
    <a href="/"
      class="absolute top-4 left-4 text-marrom-escuro/50 hover:text-marrom-escuro text-sm transition-colors cursor-pointer flex items-center gap-1">
      ← Voltar
    </a>
    <div class="bg-marrom-escuro p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-bege text-2xl font-bold">Ateliê Ahois</h1>
        <p class="text-bege/50 text-sm mt-1">Painel Administrativo</p>
      </div>

      <form onsubmit={(e) => { e.preventDefault(); login() }} class="flex flex-col gap-4">
        <input
          bind:value={email}
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 rounded-xl bg-bege/10 text-bege placeholder-bege/40 border border-bege/20 focus:outline-none focus:border-bege focus:ring-1 focus:ring-bege/30 text-sm"
        />
        <input
          bind:value={password}
          type="password"
          placeholder="Senha"
          class="w-full px-4 py-3 rounded-xl bg-bege/10 text-bege placeholder-bege/40 border border-bege/20 focus:outline-none focus:border-bege focus:ring-1 focus:ring-bege/30 text-sm"
        />

        {#if erro}
          <p class="text-red-300 text-sm text-center">{erro}</p>
        {/if}

        <button
          type="submit"
          disabled={loading}
          class="w-full bg-bege text-marrom-escuro font-semibold py-3 rounded-xl hover:bg-white transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-bege/10 text-center">
        <button onclick={entrarDemo} class="text-bege/40 hover:text-bege text-xs transition-colors cursor-pointer">
          Modo demonstração (sem login)
        </button>
      </div>
    </div>
  </div>
{:else}
  <Dashboard {logout} />
{/if}

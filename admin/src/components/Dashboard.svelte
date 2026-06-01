<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'

  let { logout } = $props()

  let aba = $state('produtos')
  let produtos = $state([])
  let enderecos = $state([])
  let carregando = $state(true)
  let erroDb = $state('')

  let form = $state(null)
  let editando = $state(null)

  let fp = $state({ name: '', description: '', price: '', category: '', emoji: '🧶', materiais: '', tamanho: '', cores: '', cuidados: '' })
  let fe = $state({ nome: '', tipo: 'oficina', logradouro: '', cidade: '', estado: '', cep: '', mapa_url: '' })
  let salvando = $state(false)

  onMount(async () => {
    await carregar()
  })

  async function carregar() {
    carregando = true
    erroDb = ''
    if (!supabase) {
      produtos = [
        { id: 1, emoji: '🧣', name: 'Cachecol Ahois', category: 'Inverno', price: 89.90 },
        { id: 2, emoji: '🧶', name: 'Novelo Artesanal', category: 'Linhas', price: 34.50 },
        { id: 3, emoji: '👜', name: 'Bolsa Crochê', category: 'Acessórios', price: 129.90 },
      ]
      enderecos = [
        { id: 1, nome: 'Ateliê Principal', tipo: 'oficina', logradouro: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP' },
        { id: 2, nome: 'Feira de Artesanato', tipo: 'evento', logradouro: 'Praça Central, s/n', cidade: 'São Paulo', estado: 'SP' },
      ]
      carregando = false
      return
    }
    try {
      const [p, e] = await Promise.all([
        supabase.from('produtos').select('*').order('id'),
        supabase.from('enderecos').select('*').order('id'),
      ])
      if (p.error) throw p.error
      if (e.error) throw e.error
      produtos = p.data ?? []
      enderecos = e.data ?? []
    } catch (err) {
      erroDb = err.message || 'Erro ao carregar dados.'
    }
    carregando = false
  }

  function resetFormProduto() {
    fp = { name: '', description: '', price: '', category: '', emoji: '🧶', materiais: '', tamanho: '', cores: '', cuidados: '' }
  }

  function resetFormEndereco() {
    fe = { nome: '', tipo: 'oficina', logradouro: '', cidade: '', estado: '', cep: '', mapa_url: '' }
  }

  function novaProduto() {
    editando = null
    resetFormProduto()
    form = 'produto'
  }

  function editarProduto(p) {
    editando = p
    fp = {
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      category: p.category,
      emoji: p.emoji,
      materiais: p.details?.materiais ?? '',
      tamanho: p.details?.tamanho ?? '',
      cores: p.details?.cores?.join(', ') ?? '',
      cuidados: p.details?.cuidados ?? '',
    }
    form = 'produto'
  }

  async function salvarProduto() {
    salvando = true
    const payload = {
      name: fp.name,
      description: fp.description || null,
      price: parseFloat(fp.price),
      category: fp.category,
      emoji: fp.emoji,
      details: {
        materiais: fp.materiais,
        tamanho: fp.tamanho,
        cores: fp.cores.split(',').map(c => c.trim()).filter(Boolean),
        cuidados: fp.cuidados,
      },
    }
    if (!supabase) {
      if (editando) {
        const i = produtos.findIndex(p => p.id === editando.id)
        if (i !== -1) produtos[i] = { ...editando, ...payload }
      } else {
        produtos = [...produtos, { id: Date.now(), ...payload }]
      }
      form = null
      editando = null
      salvando = false
      return
    }
    try {
      const { error } = editando
        ? await supabase.from('produtos').update(payload).eq('id', editando.id)
        : await supabase.from('produtos').insert(payload)
      if (error) throw error
      form = null
      editando = null
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao salvar.')
    }
    salvando = false
  }

  async function excluirProduto(id) {
    if (!confirm('Excluir este produto?')) return
    if (!supabase) {
      produtos = produtos.filter(p => p.id !== id)
      return
    }
    try {
      const { error } = await supabase.from('produtos').delete().eq('id', id)
      if (error) throw error
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao excluir.')
    }
  }

  function novoEndereco() {
    editando = null
    resetFormEndereco()
    form = 'endereco'
  }

  function editarEndereco(e) {
    editando = e
    fe = {
      nome: e.nome,
      tipo: e.tipo,
      logradouro: e.logradouro,
      cidade: e.cidade,
      estado: e.estado,
      cep: e.cep ?? '',
      mapa_url: e.mapa_url ?? '',
    }
    form = 'endereco'
  }

  async function salvarEndereco() {
    salvando = true
    const payload = {
      nome: fe.nome,
      tipo: fe.tipo,
      logradouro: fe.logradouro,
      cidade: fe.cidade,
      estado: fe.estado,
      cep: fe.cep || null,
      mapa_url: fe.mapa_url || null,
    }
    if (!supabase) {
      if (editando) {
        const i = enderecos.findIndex(e => e.id === editando.id)
        if (i !== -1) enderecos[i] = { ...editando, ...payload }
      } else {
        enderecos = [...enderecos, { id: Date.now(), ...payload }]
      }
      form = null
      editando = null
      salvando = false
      return
    }
    try {
      const { error } = editando
        ? await supabase.from('enderecos').update(payload).eq('id', editando.id)
        : await supabase.from('enderecos').insert(payload)
      if (error) throw error
      form = null
      editando = null
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao salvar.')
    }
    salvando = false
  }

  async function excluirEndereco(id) {
    if (!confirm('Excluir este endereço?')) return
    if (!supabase) {
      enderecos = enderecos.filter(e => e.id !== id)
      return
    }
    try {
      const { error } = await supabase.from('enderecos').delete().eq('id', id)
      if (error) throw error
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao excluir.')
    }
  }
</script>

<div class="min-h-screen bg-branco flex flex-col">
  <header class="bg-marrom-escuro px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
    <div class="flex items-center gap-4">
      <a href="/"
        class="text-bege/60 hover:text-bege text-sm transition-colors cursor-pointer flex items-center gap-1">
        ← Voltar
      </a>
      <h1 class="text-bege text-lg md:text-xl font-bold">Admin — Ateliê Ahois</h1>
    </div>
    <button onclick={logout} class="text-bege/60 hover:text-bege text-sm transition-colors cursor-pointer">
      Sair
    </button>
  </header>

  <div class="px-4 md:px-8 pt-6 pb-2">
    <div class="flex gap-2">
      <button onclick={() => aba = 'produtos'}
        class="px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200
               {aba === 'produtos' ? 'bg-marrom-escuro text-bege shadow-md' : 'bg-bege text-marrom-escuro hover:bg-marrom-claro hover:text-bege'}">
        Produtos
      </button>
      <button onclick={() => aba = 'enderecos'}
        class="px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200
               {aba === 'enderecos' ? 'bg-marrom-escuro text-bege shadow-md' : 'bg-bege text-marrom-escuro hover:bg-marrom-claro hover:text-bege'}">
        Endereços
      </button>
    </div>
  </div>

  <div class="flex-1 px-4 md:px-8 py-6">
    {#if carregando}
      <p class="text-marrom-claro/50 text-center py-12">Carregando...</p>

    {:else if erroDb}
      <p class="text-red-500 text-center py-12">{erroDb}</p>

    {:else if aba === 'produtos'}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-marrom-escuro">Produtos ({produtos.length})</h2>
        {#if form !== 'produto'}
          <button onclick={novaProduto} class="bg-marrom-escuro text-bege px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">+ Novo</button>
        {/if}
      </div>

      {#if form === 'produto'}
        <div class="bg-bege/20 rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-marrom-escuro mb-4">{editando ? 'Editar' : 'Novo'} Produto</h3>
          <form onsubmit={(e) => { e.preventDefault(); salvarProduto() }} class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input bind:value={fp.name} placeholder="Nome" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.category} placeholder="Categoria" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.price} type="number" step="0.01" placeholder="Preço" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.emoji} placeholder="Emoji" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <div class="md:col-span-2">
              <textarea bind:value={fp.description} placeholder="Descrição" rows="2" class="w-full px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro resize-none"></textarea>
            </div>
            <input bind:value={fp.materiais} placeholder="Materiais" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.tamanho} placeholder="Tamanho" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.cores} placeholder="Cores (separadas por vírgula)" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fp.cuidados} placeholder="Cuidados" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <div class="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={salvando} class="bg-marrom-escuro text-bege px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onclick={() => { form = null; editando = null }} class="border border-marrom-claro text-marrom-claro px-6 py-2.5 rounded-lg font-semibold hover:bg-marrom-claro hover:text-bege transition-colors cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      {/if}

      <div class="overflow-x-auto rounded-xl border border-bege/30">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-bege/30 text-marrom-claro text-xs uppercase tracking-wide">
              <th class="text-left px-4 py-3">Produto</th>
              <th class="text-left px-4 py-3">Categoria</th>
              <th class="text-left px-4 py-3">Preço</th>
              <th class="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each produtos as p}
              <tr class="border-t border-bege/20 hover:bg-bege/10 transition-colors">
                <td class="px-4 py-3">{p.emoji} {p.name}</td>
                <td class="px-4 py-3 text-marrom-claro/70">{p.category}</td>
                <td class="px-4 py-3 font-medium">R$ {Number(p.price).toFixed(2)}</td>
                <td class="px-4 py-3 flex gap-3">
                  <button onclick={() => editarProduto(p)} class="text-marrom-claro hover:text-marrom-escuro underline text-xs cursor-pointer">Editar</button>
                  <button onclick={() => excluirProduto(p.id)} class="text-red-500 hover:text-red-700 underline text-xs cursor-pointer">Excluir</button>
                </td>
              </tr>
            {:else}
              <tr><td colspan="4" class="text-center py-12 text-marrom-claro/50">Nenhum produto cadastrado.</td></tr>
            {/each}
          </tbody>
        </table>
      </div>

    {:else if aba === 'enderecos'}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-marrom-escuro">Endereços ({enderecos.length})</h2>
        {#if form !== 'endereco'}
          <button onclick={novoEndereco} class="bg-marrom-escuro text-bege px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">+ Novo</button>
        {/if}
      </div>

      {#if form === 'endereco'}
        <div class="bg-bege/20 rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-marrom-escuro mb-4">{editando ? 'Editar' : 'Novo'} Endereço</h3>
          <form onsubmit={(e) => { e.preventDefault(); salvarEndereco() }} class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input bind:value={fe.nome} placeholder="Nome" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <select bind:value={fe.tipo} class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro">
              <option value="oficina">Oficina</option>
              <option value="evento">Evento</option>
              <option value="entrega">Entrega</option>
            </select>
            <div class="md:col-span-2">
              <input bind:value={fe.logradouro} placeholder="Logradouro" required class="w-full px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            </div>
            <input bind:value={fe.cidade} placeholder="Cidade" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fe.estado} placeholder="Estado" required class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fe.cep} placeholder="CEP" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <input bind:value={fe.mapa_url} placeholder="URL do Mapa" class="px-3 py-2 rounded-lg border border-bege bg-branco text-sm focus:outline-none focus:border-marrom-claro" />
            <div class="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={salvando} class="bg-marrom-escuro text-bege px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onclick={() => { form = null; editando = null }} class="border border-marrom-claro text-marrom-claro px-6 py-2.5 rounded-lg font-semibold hover:bg-marrom-claro hover:text-bege transition-colors cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      {/if}

      <div class="overflow-x-auto rounded-xl border border-bege/30">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-bege/30 text-marrom-claro text-xs uppercase tracking-wide">
              <th class="text-left px-4 py-3">Nome</th>
              <th class="text-left px-4 py-3">Tipo</th>
              <th class="text-left px-4 py-3">Endereço</th>
              <th class="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each enderecos as e}
              <tr class="border-t border-bege/20 hover:bg-bege/10 transition-colors">
                <td class="px-4 py-3 font-medium">{e.nome}</td>
                <td class="px-4 py-3">
                  <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                    {e.tipo === 'oficina' ? 'bg-blue-100 text-blue-700' : e.tipo === 'evento' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}">{e.tipo}</span>
                </td>
                <td class="px-4 py-3 text-marrom-claro/70">{e.logradouro}, {e.cidade}/{e.estado}</td>
                <td class="px-4 py-3 flex gap-3">
                  <button onclick={() => editarEndereco(e)} class="text-marrom-claro hover:text-marrom-escuro underline text-xs cursor-pointer">Editar</button>
                  <button onclick={() => excluirEndereco(e.id)} class="text-red-500 hover:text-red-700 underline text-xs cursor-pointer">Excluir</button>
                </td>
              </tr>
            {:else}
              <tr><td colspan="4" class="text-center py-12 text-marrom-claro/50">Nenhum endereço cadastrado.</td></tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

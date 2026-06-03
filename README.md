# Ateliê Ahois

Site institucional e catálogo de crochê artesanal com carrinho de compras e painel administrativo. O cliente navega pelo catálogo, adiciona itens ao carrinho e finaliza via WhatsApp. O painel admin permite gerenciar produtos e endereços.

## Tecnologias

- **[Astro](https://astro.build)** v6 — Framework SSR/SSG com ilhas de interatividade
- **[Svelte](https://svelte.dev)** v5 — Componentes reativos com runes (`$state`, `$derived`, `$props`)
- **[Supabase](https://supabase.com)** — PostgreSQL, Auth e Storage como backend
- **[Tailwind CSS](https://tailwindcss.com)** v4 — Estilos utilitários com `@theme` para design tokens

## Estrutura do Projeto

```
tanstack/
├── admin/                          # Workspace: painel administrativo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin.svelte         # Tela de login + autenticação
│   │   │   └── Dashboard.svelte     # CRUD de produtos e endereços
│   │   ├── lib/
│   │   │   └── supabase.ts          # Cliente Supabase (export direto)
│   │   ├── pages/
│   │   │   └── index.astro          # Página admin
│   │   └── styles/
│   │       └── global.css
│   ├── astro.config.mjs
│   ├── svelte.config.js
│   ├── tsconfig.json
│   └── package.json
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Admin.svelte          # Login com modo demo
│   │   │   └── Dashboard.svelte      # CRUD com upload de imagem
│   │   ├── Agenda.astro              # Seção de eventos e feiras
│   │   ├── BotaoEncomenda.svelte     # Botão CTA WhatsApp
│   │   ├── CartDrawer.svelte         # Drawer do carrinho + botão WhatsApp flutuante
│   │   ├── Catalogo.svelte           # Catálogo com filtros por categoria (server-side)
│   │   ├── ComoFunciona.astro        # Seção de 4 passos do fluxo de compra
│   │   ├── Entrega.astro             # Seção de frete e entrega
│   │   ├── FAQ.astro                 # Dúvidas frequentes (accordion nativo)
│   │   ├── FeatureLeft.astro         # Seção materiais
│   │   ├── FeatureRight.astro        # Seção artesanato
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── NavBar.svelte             # Navbar com menu mobile
│   │   ├── ProductCard.svelte        # Card de produto
│   │   └── SobreArtesa.astro         # Seção sobre a artesã
│   ├── data/
│   │   └── produtos.ts              # Tipos e dados estáticos de fallback
│   ├── layouts/
│   │   └── Layout.astro              # HTML base com SEO (OG, Twitter Card, JSON-LD)
│   ├── lib/
│   │   ├── cart.svelte.ts            # CartStore reativo (Svelte 5 runes)
│   │   ├── produtos.ts               # Fetch server-side com cache e fallback
│   │   └── supabase.ts               # Cliente Supabase lazy singleton
│   ├── pages/
│   │   ├── index.astro               # Página principal da loja
│   │   └── admin.astro               # Página admin (inline, sem Layout)
│   └── styles/
│       └── global.css                # Design tokens + resets
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql            # Tabelas: produtos, clientes, pedidos
│       └── 002_enderecos.sql         # Tabela: endereços
├── public/
│   └── images/                       # Assets estáticos (logos, fotos)
├── astro.config.mjs
├── svelte.config.js
├── tsconfig.json
└── package.json
```

## Pré-requisitos

- **Node.js** >= 22.12.0

## Instalação e Configuração

```bash
# Clone o repositório
git clone <repo-url>
cd tanstack

# Instale as dependências (raiz + admin)
npm install

# Copie as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

### Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (anon key) do Supabase |

> O site funciona sem Supabase configurado — os dados estáticos em `src/data/produtos.ts` são usados como fallback e o admin exibe um modo demonstração.

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Inicia o site em `localhost:4321` |
| `npm run build` | Build de produção do site |
| `npm run preview` | Preview do build do site |
| `npm run dev:admin` | Inicia o painel admin em `localhost:4321` |
| `npm run build:admin` | Build de produção do admin |
| `npm run preview:admin` | Preview do build do admin |

## Arquitetura e Padrões

### Monorepo com npm Workspaces

O projeto usa npm workspaces com dois packages independentes:

- **Raiz** (`/`) — Site da loja (Astro + Svelte)
- **admin** (`/admin`) — Painel administrativo separado (Astro + Svelte)

Cada workspace tem seu próprio `astro.config.mjs`, `svelte.config.js`, e `tsconfig.json`.

### Ilhas de Interatividade (Astro Islands)

Componentes estáticos são `.astro` (Hero, FeatureLeft, Footer, Agenda). Componentes interativos usam Svelte com diretivas de hidratação:

- `client:load` — NavBar, Catalogo, CartDrawer (precisam de estado imediato)
- `client:only="svelte"` — Admin (somente client-side, usa Supabase Auth)

### Estado Reativo com Svelte 5 Runes

O `CartStore` (`src/lib/cart.svelte.ts`) é uma class Svelte 5 que usa runes:

- `$state` — itens do carrinho
- `$derived` — total e contagem calculados automaticamente
- Exportado como singleton (`cart`)

### Supabase: Lazy Singleton com Fallback

O cliente Supabase em `src/lib/supabase.ts` usa lazy initialization — só cria a instância quando as variáveis de ambiente existem. Isso permite que o site funcione offline com dados de fallback (`src/data/produtos.ts`).

O admin em `admin/src/lib/supabase.ts` exporta o cliente diretamente (não lazy) para uso autenticado.

### Design Tokens (Tailwind CSS v4)

Cores e fontes são definidas em `@theme` no `global.css`:

| Token | Valor |
|---|---|
| `--color-marrom-escuro` | `#351803` |
| `--color-marrom-claro` | `#7f4222` |
| `--color-bege` | `#ffd3ae` |
| `--color-branco` | `#ffffff` |
| `--font-sans` | Inter, system-ui |

### Fluxo de Compra (WhatsApp)

1. Cliente adiciona itens ao `CartStore`
2. Clica no botão flutuante do carrinho
3. O `CartDrawer` gera uma mensagem formatada com os itens e espaço para chave Pix
4. O pedido é salvo no Supabase (tabela `pedidos`) e o cliente é redirecionado ao WhatsApp com a mensagem pré-preenchida

### Painel Admin

O administrador autentica via Supabase Auth (email/senha). Se o Supabase não está configurado, um modo demonstração está disponível com dados fictícios. Funcionalidades:

- CRUD de produtos (com upload de imagem para o Supabase Storage)
- CRUD de endereços (oficina, evento, entrega)

## Banco de Dados

### Tabelas

**produtos** — Produtos artesanais do catálogo

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | BIGSERIAL PK | ID automático |
| `name` | TEXT | Nome do produto |
| `description` | TEXT | Descrição |
| `price` | DECIMAL(10,2) | Preço em R$ |
| `category` | TEXT | Categoria (Amigurumi, Casa & Decoração, Baby, Acessórios) |
| `emoji` | TEXT | Emoji representativo |
| `details` | JSONB | Objeto com materiais, tamanho, cores, cuidados |
| `image_url` | TEXT | URL da imagem (Supabase Storage) |
| `active` | BOOLEAN | Produto ativo/visível |

**clientes** — Dados dos clientes

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | BIGSERIAL PK | ID automático |
| `name` | TEXT | Nome |
| `phone` | TEXT | Telefone |
| `email` | TEXT | Email (opcional) |
| `address` | TEXT | Endereço (opcional) |
| `notes` | TEXT | Observações |

**pedidos** — Pedidos realizados via WhatsApp

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | BIGSERIAL PK | ID automático |
| `cliente_id` | BIGINT FK | Referência ao cliente |
| `items` | JSONB | Array de itens do pedido |
| `total` | DECIMAL(10,2) | Valor total |
| `status` | TEXT | pending / confirmed / completed / cancelled |

**enderecos** — Endereços da artesã (oficina, eventos, entrega)

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | BIGSERIAL PK | ID automático |
| `nome` | TEXT | Nome do local |
| `tipo` | TEXT | oficina / evento / entrega |
| `logradouro` | TEXT | Endereço |
| `cidade` | TEXT | Cidade |
| `estado` | TEXT | Estado |
| `cep` | TEXT | CEP |
| `mapa_url` | TEXT | URL do Google Maps |

### RLS (Row Level Security)

- `produtos`: leitura pública, escrita autenticada
- `clientes` e `pedidos`: inserção via anon key
- `enderecos`: leitura pública, edição via anon key

## Redes Sociais

- **Instagram:** [@atelieahois_](https://www.instagram.com/atelieahois_?igsh=MXNkdzJxaWx6OWli)
- **TikTok:** _(em breve)_

## Contato

- **WhatsApp:** [(69) 9236-6937](https://wa.me/556992366937)

## Licença

Projeto privado. Todos os direitos reservados a Ateliê Ahois.

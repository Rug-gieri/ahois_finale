import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client
  const url = import.meta.env.PUBLIC_SUPABASE_URL
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  if (url && key) {
    _client = createClient(url, key)
  }
  return _client
}

export interface ProdutoDB {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  details: {
    materiais: string
    tamanho: string
    cores: string[]
    cuidados: string
  } | null
  image_url: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface ClienteDB {
  id: number
  name: string
  phone: string
  email: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PedidoDB {
  id: number
  cliente_id: number | null
  cliente_nome: string | null
  cliente_phone: string | null
  items: { product_id: number; product_name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  cep: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  complemento: string | null
  frete: number | null
  metodo_envio: string | null
  codigo_rastreio: string | null
  created_at: string
  updated_at: string
}

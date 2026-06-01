import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export interface ProdutoDB {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  emoji: string
  details: {
    materiais: string
    tamanho: string
    cores: string[]
    cuidados: string
  } | null
  image_url: string | null
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
  created_at: string
  updated_at: string
}

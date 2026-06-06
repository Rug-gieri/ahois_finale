import { getSupabase } from './supabase'
import { exemplares, categorias, type Product, type ProductDetails } from '../data/produtos'
import type { ProdutoDB } from './supabase'

const defaultDetails: ProductDetails = {
  materiais: '',
  tamanho: '',
  cores: [],
  cuidados: '',
}

function toProduct(row: ProdutoDB): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price,
    category: row.category,
    details: row.details ?? defaultDetails,
    image_url: row.image_url,
  }
}

let cache: Promise<{ produtos: Product[]; categorias: string[] }> | null = null

export function getProdutos(): Promise<{ produtos: Product[]; categorias: string[] }> {
  if (cache) return cache
  cache = fetchProdutos()
  return cache
}

async function fetchProdutos(): Promise<{ produtos: Product[]; categorias: string[] }> {
  const sb = getSupabase()
  if (!sb) {
    return { produtos: exemplares, categorias: [...categorias] }
  }
  try {
    const { data, error } = await sb.from('produtos').select('*').eq('active', true).order('id')
    if (error) throw error
    if (!data || data.length === 0) {
      return { produtos: exemplares, categorias: [...categorias] }
    }
    return {
      produtos: (data as ProdutoDB[]).map(toProduct),
      categorias: [...categorias],
    }
  } catch {
    return { produtos: exemplares, categorias: [...categorias] }
  }
}

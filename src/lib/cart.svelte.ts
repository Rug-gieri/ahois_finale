import type { Product } from '../data/produtos'

interface CartItem {
  product: Product
  quantity: number
}

class CartStore {
  items = $state<CartItem[]>([])
  nome = $state('')
  cep = $state('')
  endereco = $state('')
  cidade = $state('')
  estado = $state('')
  complemento = $state('')
  freteValor = $state(0)
  freteGratis = $state(false)
  freteMotivo = $state('')

  add(product: Product) {
    const existing = this.items.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      this.items.push({ product, quantity: 1 })
    }
  }

  remove(id: number) {
    this.items = this.items.filter((item) => item.product.id !== id)
  }

  updateQuantity(id: number, qty: number) {
    if (qty <= 0) {
      this.remove(id)
      return
    }
    const item = this.items.find((item) => item.product.id === id)
    if (item) {
      item.quantity = qty
    }
  }

  total = $derived(
    this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  totalComFrete = $derived(this.total + (this.freteGratis ? 0 : this.freteValor))

  count = $derived(this.items.reduce((sum, item) => sum + item.quantity, 0))

  whatsappMessage(phone: string): string {
    const lines = this.items.map(
      (item) =>
        `${item.quantity}x ${item.product.name} - R$ ${item.product.price.toFixed(2)}`,
    )
    const parts: string[] = [
      "Olá! Gostaria de encomendar:",
      ...lines,
      "",
      `Subtotal: R$ ${this.total.toFixed(2)}`,
    ]
    if (this.freteMotivo) {
      const freteLabel = this.freteGratis
        ? `Grátis (${this.freteMotivo})`
        : `R$ ${this.freteValor.toFixed(2)}`
      parts.push(`Frete: ${freteLabel}`)
    }
    if (this.nome) {
      parts.push("", `Nome: ${this.nome}`)
    }
    if (this.endereco) {
      parts.push(`Endereço: ${this.endereco}`)
    }
    if (this.cidade || this.estado) {
      const local = [this.cidade, this.estado].filter(Boolean).join(', ')
      parts.push(`Cidade: ${local}`)
    }
    if (this.cep) {
      parts.push(`CEP: ${this.cep}`)
    }
    parts.push("", `Total: R$ ${this.totalComFrete.toFixed(2)}`, "", "Chave Pix: ", "", "Obrigado!")
    return parts.join("%0A")
  }

  whatsappUrl(phone: string): string {
    const message = this.whatsappMessage(phone)
    return `https://wa.me/${phone}?text=${message}`
  }
}

export const cart = new CartStore()

import type { Product } from '../data/produtos'

interface CartItem {
  product: Product
  quantity: number
}

class CartStore {
  items = $state<CartItem[]>([])

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

  count = $derived(this.items.reduce((sum, item) => sum + item.quantity, 0))

  whatsappMessage(phone: string): string {
    const lines = this.items.map(
      (item) =>
        `${item.quantity}x ${item.product.name} - R$ ${item.product.price.toFixed(2)}`,
    )
    const total = `R$ ${this.total.toFixed(2)}`
    const message = [
      "Olá! Gostaria de encomendar:",
      ...lines,
      "",
      `Total: ${total}`,
      "",
      "Chave Pix: ",
      "",
      "Obrigado!",
    ].join("%0A")
    return message
  }

  whatsappUrl(phone: string): string {
    const message = this.whatsappMessage(phone)
    return `https://wa.me/${phone}?text=${message}`
  }
}

export const cart = new CartStore()

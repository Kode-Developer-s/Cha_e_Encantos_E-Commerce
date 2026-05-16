import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: string
  name: string
  category: string
  tag: string
  price: number
  weight: string
  ingredients: string
  description: string
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const cart = ref<Record<string, number>>({})

  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const total = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
    cart.value[product.id] = (cart.value[product.id] || 0) + 1
  }

  const increaseQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity++
      cart.value[productId] = (cart.value[productId] || 0) + 1
    }
  }

  const decreaseQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity--
      cart.value[productId]--
      if (item.quantity <= 0) {
        items.value = items.value.filter((item) => item.product.id !== productId)
        delete cart.value[productId]
      }
    }
  }

  const clearCart = () => {
    items.value = []
    cart.value = {}
  }

  return {
    items,
    cart,
    itemCount,
    total,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }
})

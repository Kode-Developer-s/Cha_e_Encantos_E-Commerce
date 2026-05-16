<template>
  <div id="app">
    <header class="site-header">
      <a class="brand" href="/" @click="handleNavClick">
        <img class="brand-mark" src="/logo-header.png" alt="" />
        <span>Chá e Encantos</span>
      </a>

      <nav class="main-nav" aria-label="Principal">
        <router-link to="/">Início</router-link>
        <router-link to="/sobre">Nossa História</router-link>
        <router-link to="/catalogo">Catálogo</router-link>
        <a href="#contato">Contato</a>
        <router-link to="/atividades">Atividades</router-link>
      </nav>

      <button class="cart-button" type="button" @click="openCart" aria-label="Abrir carrinho">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 9h10l-1 10H8L7 9Z" />
          <path d="M9 9a3 3 0 0 1 6 0" />
        </svg>
        <strong>{{ cartStore.itemCount }}</strong>
      </button>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="site-footer" id="contato">
      <div class="footer-brand">
        <img class="footer-mark" src="/logo-footer.svg" alt="" aria-hidden="true" />
        <div>
          <h2>Chá e Encantos</h2>
          <p>Infusões botânicas que trazem magia e aconchego para o seu dia a dia.</p>
          <p>Feito com amor e natureza.</p>
        </div>
      </div>
      <p class="copyright">Chá & Encantos. Todos os direitos reservados.</p>
    </footer>

    <!-- Cart Drawer -->
    <aside class="cart-drawer" :class="{ 'is-open': isCartOpen }" :aria-hidden="!isCartOpen">
      <div class="cart-panel">
        <div class="cart-header">
          <div>
            <p class="eyebrow">Pedido</p>
            <h2>Carrinho</h2>
          </div>
          <button class="icon-button" type="button" @click="closeCart" aria-label="Fechar carrinho">x</button>
        </div>

        <div class="cart-items">
          <p v-if="cartStore.items.length === 0" class="empty-cart">Seu carrinho está vazio.</p>
          <article v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
            <div>
              <h3>{{ item.product.name }}</h3>
              <p>{{ formatPrice(item.product.price) }} - {{ item.product.weight }}</p>
            </div>
            <div class="quantity">
              <button type="button" @click="cartStore.decreaseQuantity(item.product.id)">-</button>
              <strong>{{ item.quantity }}</strong>
              <button type="button" @click="cartStore.increaseQuantity(item.product.id)">+</button>
            </div>
          </article>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <strong>{{ formatPrice(cartStore.total) }}</strong>
          </div>
          <button class="button primary full" type="button" @click="handleCheckout">Finalizar pedido</button>
          <p class="checkout-note" role="status">{{ checkoutMessage }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from './stores/cart'

const cartStore = useCartStore()
const isCartOpen = ref(false)
const checkoutMessage = ref('')

const openCart = () => {
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const handleNavClick = (e: Event) => {
  e.preventDefault()
  window.location.hash = ''
}

const handleCheckout = () => {
  if (cartStore.items.length === 0) {
    checkoutMessage.value = 'Adicione produtos para continuar.'
  } else {
    checkoutMessage.value = 'Stripe Checkout será integrado em breve.'
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped>
/* Estilos serão importados de um arquivo CSS global */
</style>

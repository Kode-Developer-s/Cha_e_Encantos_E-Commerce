<template>
  <section class="view content-view is-active">
    <div class="product-detail-container">
      <!-- Botão voltar -->
      <button class="back-button" @click="goBack" type="button" aria-label="Voltar">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
        Voltar
      </button>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <p>Carregando produto...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Conteúdo do produto -->
      <div v-if="product && !loading" class="product-detail">
        <div class="product-detail-grid">
          <!-- Imagem do produto -->
          <div class="product-detail-image">
            <img :src="product.image" :alt="product.name" />
            <div class="product-badge">
              <span class="tag">{{ product.tag }}</span>
            </div>
          </div>

          <!-- Informações do produto -->
          <div class="product-detail-info">
            <div class="product-header">
              <h1>{{ product.name }}</h1>
              <span class="category-label">{{ formatCategory(product.category) }}</span>
            </div>

            <div class="product-price-section">
              <p class="price-label">Preço</p>
              <strong class="price">{{ formatPrice(product.price) }}</strong>
            </div>

            <!-- Descrição -->
            <div class="product-section">
              <h3>Descrição</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- Detalhes -->
            <div class="product-section">
              <h3>Detalhes</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <p class="detail-label">Peso</p>
                  <p class="detail-value">{{ product.weight }}</p>
                </div>
                <div class="detail-item">
                  <p class="detail-label">Ingredientes</p>
                  <p class="detail-value">{{ product.ingredients }}</p>
                </div>
              </div>
            </div>

            <!-- Quantidade e compra -->
            <div class="product-actions">
              <div class="quantity-selector">
                <label for="quantity">Quantidade:</label>
                <div class="quantity-input">
                  <button @click="decreaseQuantity" type="button" aria-label="Diminuir quantidade">-</button>
                  <input
                    id="quantity"
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    max="99"
                    aria-label="Quantidade"
                  />
                  <button @click="increaseQuantity" type="button" aria-label="Aumentar quantidade">+</button>
                </div>
              </div>

              <div class="action-buttons">
                <button class="button primary" type="button" @click="addToCart">
                  Adicionar ao Carrinho
                </button>
                <button class="button secondary" type="button" @click="toggleFavorite" aria-label="Marcar como favorito">
                  <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ filled: isFavorite }">
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                  </svg>
                  {{ isFavorite ? 'Adicionado' : 'Favoritar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { productService } from '../services/api'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const product = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const quantity = ref(1)
const isFavorite = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}

const formatCategory = (category: string) => {
  const map: Record<string, string> = {
    relaxar: 'Relaxar',
    energia: 'Energia',
    digestivo: 'Digestivo',
    floral: 'Floral',
  }
  return map[category] || category
}

const loadProduct = async () => {
  const productId = route.params.id as string
  loading.value = true
  error.value = null
  try {
    const response = await productService.getById(productId)
    product.value = response.data
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
    error.value = 'Erro ao carregar o produto. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value)
    }
    // Feedback visual
    alert('Produto adicionado ao carrinho!')
  }
}

const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Aqui você pode integrar com uma API de favoritos se necessário
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #f5f5f5;
  border-color: #999;
}

.back-button svg {
  width: 1.2rem;
  height: 1.2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.product-detail {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 2rem;
}

.product-detail-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 1;
}

.product-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.product-detail-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.product-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.product-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.category-label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  color: #666;
  text-transform: capitalize;
}

.product-price-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.price-label {
  font-size: 0.85rem;
  color: #999;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price {
  font-size: 2rem;
  color: #2c3e50;
  display: block;
}

.product-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.product-section h3 {
  font-size: 0.95rem;
  margin: 0 0 0.75rem 0;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.product-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
}

.detail-label {
  font-size: 0.8rem;
  color: #999;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  color: #333;
  font-weight: 500;
  margin: 0;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-selector label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
}

.quantity-input button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  transition: background 0.3s ease;
}

.quantity-input button:hover {
  background: #efefef;
}

.quantity-input input {
  width: 4rem;
  border: none;
  text-align: center;
  font-size: 1rem;
  padding: 0;
}

.quantity-input input:focus {
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.button {
  flex: 1;
  padding: 0.95rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button.primary {
  background: #6b5b3d;
  color: white;
}

.button.primary:hover {
  background: #5a4a2f;
}

.button.secondary {
  background: white;
  border: 2px solid #ddd;
  color: #333;
}

.button.secondary:hover {
  border-color: #6b5b3d;
  color: #6b5b3d;
}

.button svg {
  width: 1.2rem;
  height: 1.2rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.button.secondary svg.filled {
  fill: currentColor;
  stroke: none;
}

/* Responsive */
@media (max-width: 768px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .product-detail-image {
    aspect-ratio: 1;
    max-height: 400px;
  }

  .product-header h1 {
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

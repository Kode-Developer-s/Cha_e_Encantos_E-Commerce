<template>
  <section class="view content-view is-active">
    <div class="section-heading">
      <p class="eyebrow">Atividades</p>
      <h2>Experiências e encontros</h2>
      <p>Oficinas, degustações e encontros para conhecer ingredientes de perto.</p>
    </div>

    <div class="activity-layout">
      <div class="activity-list">
        <article v-for="activity in activities" :key="activity.id" class="activity-card">
          <header>
            <div>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.duration }}</p>
            </div>
            <strong>{{ formatPrice(activity.price) }}</strong>
          </header>
          <p>{{ activity.description }}</p>
          <div class="activity-slots">
            <span v-for="slot in activity.slots" :key="slot.id">
              {{ formatDate(slot.dateTime) }}
            </span>
          </div>
        </article>
      </div>

      <form class="booking-panel" @submit.prevent="handleSubmit">
        <h3>Reservar vaga</h3>
        <label>
          Atividade
          <select v-model="formData.activity" required>
            <option v-for="activity in activities" :key="activity.id" :value="activity.id">
              {{ activity.title }}
            </option>
          </select>
        </label>
        <label>
          Data e horário
          <select v-model="formData.slot" required>
            <option v-for="slot in currentActivitySlots" :key="slot">{{ slot }}</option>
          </select>
        </label>
        <label>
          Nome
          <input v-model="formData.name" type="text" autocomplete="name" required />
        </label>
        <label>
          Email
          <input v-model="formData.email" type="email" autocomplete="email" required />
        </label>
        <button class="button primary" type="submit">Solicitar reserva</button>
        <p class="form-status" role="status">{{ formStatus }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { activityService } from '../services/api'

const activities = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const formData = ref({
  activity: '',
  slot: '',
  name: '',
  email: '',
})
const formStatus = ref('')

const currentActivitySlots = computed(() => {
  const activity = activities.value.find((a) => a.id === formData.value.activity)
  return activity ? activity.slots : []
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const handleSubmit = () => {
  const activity = activities.value.find((a) => a.id === formData.value.activity)
  formStatus.value = `Reserva solicitada: ${activity?.title}, ${formData.value.slot}.`
  formData.value = {
    activity: '',
    slot: '',
    name: '',
    email: '',
  }
  setTimeout(() => {
    formStatus.value = ''
  }, 3000)
}

const loadActivities = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await activityService.getAll()
    activities.value = response.data
    if (activities.value.length > 0) {
      formData.value.activity = activities.value[0].id
      if (activities.value[0].slots?.length > 0) {
        formData.value.slot = activities.value[0].slots[0].id
      }
    }
  } catch (err) {
    console.error('Erro ao carregar atividades:', err)
    error.value = 'Erro ao carregar atividades'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadActivities()
})
</script>

<style scoped>
/* Estilos herdados da folha de estilos global */
</style>

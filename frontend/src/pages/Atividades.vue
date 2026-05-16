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
.activity-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.activity-list {
  display: grid;
  gap: 1.5rem;
}

.activity-card {
  padding: 1.5rem;
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.75);

  backdrop-filter: blur(8px);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.activity-card header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 1rem;
}

.activity-card h3 {
  margin-bottom: 0.35rem;
  color: #2d2d2d;
}

.activity-card strong {
  color: #8b5e3c;
  font-size: 1.1rem;
}

.activity-card p {
  line-height: 1.6;
  color: #555;
}

.activity-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  margin-top: 1.25rem;
}

.activity-slots span {
  padding: 0.5rem 0.9rem;
  border-radius: 999px;

  background: #f4ece6;

  font-size: 0.9rem;
  color: #6b4d38;
}

.booking-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1.75rem;

  border-radius: 20px;

  background: #fffaf7;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);

  height: fit-content;
}

.booking-panel h3 {
  margin-bottom: 0.5rem;
}

.booking-panel label {
  display: flex;
  flex-direction: column;

  gap: 0.45rem;

  font-size: 0.95rem;
  color: #444;
}

.booking-panel input,
.booking-panel select {
  padding: 0.85rem 1rem;

  border: 1px solid #ddd;
  border-radius: 12px;

  font-size: 0.95rem;

  transition: border-color 0.2s ease;
}

.booking-panel input:focus,
.booking-panel select:focus {
  outline: none;
  border-color: #8b5e3c;
}

.button.primary {
  padding: 0.9rem 1.2rem;

  border: none;
  border-radius: 12px;

  background: #8b5e3c;
  color: white;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.button.primary:hover {
  background: #71492d;
  transform: translateY(-2px);
}

.form-status {
  min-height: 20px;

  font-size: 0.9rem;
  color: #6b4d38;
}

@media (max-width: 900px) {
  .activity-layout {
    grid-template-columns: 1fr;
  }
}
</style>

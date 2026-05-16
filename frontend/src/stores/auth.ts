import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/api'

export interface User {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const register = async (email: string, password: string, name: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(email, password, name)
      const { user: userData, token: newToken } = response.data
      user.value = userData
      token.value = newToken
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      const { user: userData, token: newToken } = response.data
      user.value = userData
      token.value = newToken
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const loadFromStorage = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    loadFromStorage,
  }
})

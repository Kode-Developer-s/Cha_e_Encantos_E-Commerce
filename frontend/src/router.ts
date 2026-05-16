import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Catalogo from './pages/Catalogo.vue'
import Sobre from './pages/Sobre.vue'
import Atividades from './pages/Atividades.vue'
import ProductDetail from './pages/ProductDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/catalogo',
    name: 'Catalogo',
    component: Catalogo,
  },
  {
    path: '/produto/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: Sobre,
  },
  {
    path: '/atividades',
    name: 'Atividades',
    component: Atividades,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import AddBookView from '../views/AddBookView.vue'
import BooksView from '@/views/BooksView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetailView.vue')
  },
  {
    path: '/books/:id/edit',
    name: 'EditBook',
    component: () => import('../views/EditBookView.vue')
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView
  },
  {
    path: '/add-book',
    name: 'AddBook',
    component: AddBookView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
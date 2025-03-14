<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import libraryService from '../api/libraryService'
import BookList from '../components/BookList.vue'
import DashboardStats from '../components/DashboardStats.vue'
import type { Book, PaginatedResponse, Checkout } from '../types/library'

const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(5) // Reduced to show fewer books on dashboard
const totalItems = ref(0)
const books = ref<Book[]>([])
const recentCheckouts = ref<Checkout[]>([])
const loading = ref(false)
const checkoutsLoading = ref(false)
const searchQuery = ref('')

const loadDashboardData = async () => {
  loading.value = true
  try {
    const booksResponse = await libraryService.getBooks(currentPage.value, pageSize.value)
    const booksData = booksResponse.data as PaginatedResponse<Book>
    books.value = booksData.data
    totalItems.value = booksData.pagination.totalItems
    await loadRecentCheckouts()
  } catch (error) {
    message.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const loadRecentCheckouts = async () => {
  checkoutsLoading.value = true
  try {
    const response = await libraryService.getCheckouts(1, 5) // Get 5 most recent checkouts
    const data = response.data as PaginatedResponse<Checkout>
    recentCheckouts.value = data.data
  } catch (error) {
    console.error('Failed to load checkouts', error)
  } finally {
    checkoutsLoading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page when searching
  loadDashboardData()
}

const deleteBook = async (id: string) => {
  try {
    await libraryService.deleteBook(id)
    message.success('Book deleted')
    loadDashboardData()
  } catch (error) {
    message.error('Failed to delete book')
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadDashboardData()
}

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Library Management Dashboard</h1>
    </div>
    <DashboardStats />
    <a-row :gutter="[16, 16]" class="quick-actions-row">
      <a-col :span="24">
        <a-card title="Quick Actions" class="dashboard-card quick-actions-card">
          <a-row :gutter="[12, 12]">
            <a-col :xs="24" :sm="8">
              <a-button type="primary" block @click="router.push('/checkout')">
                New Checkout
              </a-button>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-button block @click="router.push('/books')"> Manage Books </a-button>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-button block @click="router.push('/checkout')"> Manage Checkouts </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card title="Recent Books" class="dashboard-card books-list-card">
          <template #extra>
            <a-button type="link" @click="router.push('/books')">View All</a-button>
          </template>
          <a-spin :spinning="loading">
            <BookList :books="books" @delete="deleteBook" @search="handleSearch">
              <template #header-actions></template>
            </BookList>

            <a-pagination
              v-model:current="currentPage"
              :page-size="pageSize"
              :total="totalItems"
              @change="handlePageChange"
              show-less-items
              :showSizeChanger="false"
              class="pagination"
            />
          </a-spin>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card title="Recent Checkouts" class="dashboard-card recent-checkouts-card">
          <template #extra>
            <a-button type="link" @click="router.push('/checkout')">View All</a-button>
          </template>
          <a-spin :spinning="checkoutsLoading">
            <template v-if="recentCheckouts.length === 0">
              <a-empty description="No checkouts found" />
            </template>
            <template v-else>
              <a-list item-layout="horizontal" :data-source="recentCheckouts">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ item.studentName }}</span>
                      </template>
                      <template #description>
                        <div>Book ID: {{ item.bookId }}</div>
                        <div>Date: {{ formatDate(item.checkoutDate) }}</div>
                      </template>
                    </a-list-item-meta>
                    <template #extra>
                      <a-tag :color="item.returnDate ? 'green' : 'blue'">
                        {{ item.returnDate ? 'Returned' : 'Activ e' }}
                      </a-tag>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </template>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.quick-actions-row {
  margin-bottom: 24px;
}

.dashboard-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  height: 100%;
}

.books-list-card {
  height: auto;
}

.recent-checkouts-card {
  margin-bottom: 16px;
}

.quick-actions-card {
  transition: all 0.3s ease;
}

.quick-actions-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

@media (max-width: 576px) {
  .dashboard-header h1 {
    font-size: 20px;
  }

  .quick-actions-row .ant-btn {
    margin-bottom: 8px;
  }
}
</style>

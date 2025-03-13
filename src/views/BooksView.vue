<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import libraryService from '../api/libraryService'
import BookList from '../components/BookList.vue'
import type { Book, PaginatedResponse } from '../types/library'

const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const books = ref<Book[]>([])
const loading = ref(false)
const searchQuery = ref('')

const loadBooks = async () => {
  loading.value = true
  try {
    const response = await libraryService.getBooks(
      currentPage.value,
      pageSize.value,
      searchQuery.value,
    )
    const data = response.data as PaginatedResponse<Book>
    books.value = data.data
    totalItems.value = data.pagination.totalItems
  } catch (error) {
    message.error('Failed to load books')
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page when searching
  loadBooks()
}

const deleteBook = async (id: string) => {
  try {
    await libraryService.deleteBook(id)
    message.success('Book deleted')
    loadBooks()
  } catch (error) {
    message.error('Failed to delete book')
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadBooks()
}

onMounted(() => {
  loadBooks()
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>Library Dashboard</h2>
    </div>

    <a-card class="dashboard-card">
      <a-spin :spinning="loading">
        <BookList :books="books" @delete="deleteBook" @search="handleSearch">
          <template #header-actions> </template>
        </BookList>

        <a-pagination
          v-model:current="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          @change="handlePageChange"
          show-less-items
          class="pagination"
        />
      </a-spin>
    </a-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>

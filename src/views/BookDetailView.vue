<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import libraryService from '../api/libraryService'
import BookCheckoutHistory from '../components/BookCheckoutHistory.vue'

import type { Book } from '../types/library'

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)
const loading = ref(true)
onMounted(async () => {
  const bookId = route.params.id as string
  try {
    loading.value = true
    const response = await libraryService.getBook(bookId)
    book.value = response.data
  } catch (error) {
    message.error('Failed to load book details')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="book-detail-container">
    <a-page-header title="Book Details" @back="() => router.push('/books')" class="page-header" />

    <a-spin :spinning="loading">
      <a-card v-if="book" class="book-card">
        <a-descriptions bordered>
          <a-descriptions-item label="Title" span="3">{{ book.title }}</a-descriptions-item>
          <a-descriptions-item label="Author" span="3">{{ book.author }}</a-descriptions-item>
          <a-descriptions-item label="Available Copies" span="3">
            <a-badge
              :count="book.availableCopies"
              :color="book.availableCopies > 0 ? 'green' : 'red'"
            />
          </a-descriptions-item>
          <a-descriptions-item label="ID" span="3">
            <a-tag color="blue">{{ book.id }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <BookCheckoutHistory v-if="book" :bookId="book.id" />
    </a-spin>
  </div>
</template>

<style scoped>
.book-detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

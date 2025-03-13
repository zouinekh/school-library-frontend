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
const editing = ref(false)

const editForm = ref({
  title: '',
  author: '',
  availableCopies: 0,
})

onMounted(async () => {
  const bookId = route.params.id as string
  try {
    loading.value = true
    const response = await libraryService.getBook(bookId)
    book.value = response.data
    if (book.value) {
      editForm.value = {
        title: book.value.title,
        author: book.value.author,
        availableCopies: book.value.availableCopies,
      }
    }
  } catch (error) {
    message.error('Failed to load book details')
  } finally {
    loading.value = false
  }
})

const startEditing = () => {
  editing.value = true
}

const cancelEditing = () => {
  editing.value = false
  if (book.value) {
    editForm.value = {
      title: book.value.title,
      author: book.value.author,
      availableCopies: book.value.availableCopies,
    }
  }
}

const saveChanges = async () => {
  if (!book.value) return

  try {
    const response = await libraryService.updateBook(book.value.id, editForm.value)
    book.value = response.data
    editing.value = false
    message.success('Book updated successfully')
  } catch (error) {
    message.error('Failed to update book')
  }
}
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
      <a-card v-if="book && editing" title="Edit Book" class="book-card">
        <a-form :model="editForm" layout="vertical">
          <a-form-item label="Title" name="title">
            <a-input v-model:value="editForm.title" />
          </a-form-item>
          <a-form-item label="Author" name="author">
            <a-input v-model:value="editForm.author" />
          </a-form-item>
          <a-form-item label="Available Copies" name="availableCopies">
            <a-input-number v-model:value="editForm.availableCopies" :min="0" style="width: 100%" />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="saveChanges">Save</a-button>
              <a-button @click="cancelEditing">Cancel</a-button>
            </a-space>
          </a-form-item>
        </a-form>
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

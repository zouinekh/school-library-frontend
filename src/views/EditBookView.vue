<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import libraryService from '../api/libraryService'
import type { Book } from '../types/library'

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)
const loading = ref(true)

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

const saveChanges = async () => {
  if (!book.value) return

  try {
    const response = await libraryService.updateBook(book.value.id, editForm.value)
    message.success('Book updated successfully')
    router.push(`/books/${book.value.id}`)
  } catch (error) {
    message.error('Failed to update book')
  }
}

const cancelEdit = () => {
  router.push('/books')
}
</script>

<template>
  <div class="edit-book-container">
    <a-page-header title="Edit Book" @back="cancelEdit" class="page-header" />

    <a-spin :spinning="loading">
      <a-card v-if="book" class="book-card">
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
              <a-button @click="cancelEdit">Cancel</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
.edit-book-container {
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

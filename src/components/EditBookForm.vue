<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import libraryService from '../api/libraryService'
import type { Book } from '../types/library'

const props = defineProps<{
  book: Book
}>()

const emit = defineEmits(['update:book', 'cancel'])

const editForm = ref({
  title: props.book.title,
  author: props.book.author,
  availableCopies: props.book.availableCopies,
})

const saveChanges = async () => {
  try {
    const response = await libraryService.updateBook(props.book.id, editForm.value)
    emit('update:book', response.data)
    message.success('Book updated successfully')
  } catch (error) {
    message.error('Failed to update book')
  }
}

const cancelEditing = () => {
  emit('cancel')
}
</script>

<template>
  <a-card title="Edit Book" class="book-card">
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
</template>

<style scoped>
.book-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

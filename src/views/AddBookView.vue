<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import libraryService from '../api/libraryService'

const router = useRouter()
const form = reactive({
  title: '',
  author: '',
  availableCopies: 1,
})
const rules = {
  title: [{ required: true, message: 'Please input the title', trigger: 'blur' }],
  author: [{ required: true, message: 'Please input the author', trigger: 'blur' }],
  availableCopies: [{ required: true, message: 'Please input available copies', trigger: 'blur' }],
}

const handleSubmit = async () => {
  try {
    console.log(form)
    await libraryService.createBook(form)
    message.success('Book added successfully!')
    router.push('/')
  } catch (error) {
    message.error(error instanceof Error ? error.message : 'Failed to add book')
  }
}
</script>

<template>
  <div class="add-book-container">
    <a-page-header title="Add New Book" @back="() => router.push('/')" class="page-header" />
    <a-card class="form-card">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="handleSubmit">
        <a-form-item label="Title" name="title">
          <a-input v-model:value="form.title" placeholder="Enter book title" />
        </a-form-item>

        <a-form-item label="Author" name="author">
          <a-input v-model:value="form.author" placeholder="Enter author name" />
        </a-form-item>

        <a-form-item label="Available Copies" name="availableCopies">
          <a-input-number
            v-model:value="form.availableCopies"
            :min="1"
            style="width: 100%"
            placeholder="Enter number of copies"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block> Add Book </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.add-book-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

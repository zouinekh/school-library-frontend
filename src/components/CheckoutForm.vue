<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { Checkout } from '../types/library'
import libraryService from '../api/libraryService'
import { SwapOutlined } from '@ant-design/icons-vue'
const emit = defineEmits<{
  (e: 'success'): void
}>()

const form = reactive<Omit<Checkout, 'id' | 'checkoutDate'>>({
  studentName: '',
  bookId: '',
})

const rules = {
  studentName: [{ required: true, message: 'Please input student name!', trigger: 'blur' }],
  bookId: [{ required: true, message: 'Please input book ID!', trigger: 'blur' }],
}

const handleSubmit = async () => {
  try {
    if (form.studentName.trim() === '') {
      message.error('Student name cannot be empty.')
      return
    }
    if (form.bookId.trim() === '') {
      message.error('Book ID cannot be empty.')
      return
    }
    await libraryService.createCheckout(form)
    message.success('Checkout successful!')
    emit('success')
    form.studentName = ''
    form.bookId = ''
  } catch (error) {
    message.error('There is no available copies for that book at this moment.')
  }
}
</script>
<template>
  <a-form :model="form" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Student Name" name="studentName">
      <a-input v-model:value="form.studentName" placeholder="Enter student name" />
    </a-form-item>

    <a-form-item label="Book ID" name="bookId">
      <a-input v-model:value="form.bookId" placeholder="Enter book ID" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" block>
        <SwapOutlined />
        Checkout Book
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-input:hover) {
  border-color: #40a9ff;
}

:deep(.ant-input:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>

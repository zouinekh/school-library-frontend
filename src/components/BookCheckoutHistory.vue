<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import libraryService from '../api/libraryService'
import type { Checkout } from '../types/library'

const props = defineProps<{
  bookId: string
}>()

const checkoutHistory = ref<Checkout[]>([])
const loading = ref(false)

const loadCheckoutHistory = async () => {
  if (!props.bookId) return

  try {
    loading.value = true
    const response = await libraryService.getBookCheckoutHistory(props.bookId)

    if (response?.data?.data?.length) {
      console.log('object')
      checkoutHistory.value = response.data.data
      console.log(checkoutHistory.value)
    } else {
      checkoutHistory.value = []
    }
  } catch (error) {
    console.error('Error loading checkout history:', error)
    message.error('Failed to load checkout history')
    checkoutHistory.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  loadCheckoutHistory()
})

watch(
  () => props.bookId,
  (newVal) => {
    if (newVal) {
      loadCheckoutHistory()
    }
  },
)
</script>

<template>
  <a-card title="Checkout History" class="history-card">
    <a-spin :spinning="loading">
      <template v-if="checkoutHistory.length === 0">
        <a-empty description="No checkout history available" />
      </template>
      <template v-else>
        <p>Found {{ checkoutHistory.length }} checkout records</p>
        <a-table
          :dataSource="checkoutHistory"
          :pagination="false"
          :columns="[
            {
              title: 'Student Name',
              dataIndex: 'studentName',
              key: 'student_name',
            },
            {
              title: 'Checkout Date',
              dataIndex: 'checkoutDate',
              key: 'checkout_date',
              customRender: ({ text }: any) => formatDate(text),
            },
            {
              title: 'Return Date',
              dataIndex: 'returnDate',
              key: 'return_date',
              customRender: ({ text }: any) => (text ? formatDate(text) : 'Not returned yet'),
            },
          ]"
          :rowKey="(record: any) => record.checkout_id || record.checkout_date"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="!text">-</template>
          </template>
        </a-table>
      </template>
    </a-spin>
  </a-card>
</template>

<style scoped>
.history-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>

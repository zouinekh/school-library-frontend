<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import CheckoutForm from '@/components/CheckoutForm.vue'
import libraryService from '../api/libraryService'
import type { Checkout, PaginatedResponse } from '../types/library'
import { h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const checkouts = ref<Checkout[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const showForm = ref(false)
const editingCheckout = ref<Checkout | null>(null)

const loadCheckouts = async () => {
  loading.value = true
  try {
    const response = await libraryService.getCheckouts(currentPage.value, pageSize.value)
    const data = response.data as PaginatedResponse<Checkout>
    checkouts.value = data.data
    totalItems.value = data.pagination.totalItems
  } catch (error) {
    message.error('Failed to load checkouts')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadCheckouts()
}
const returnBook = async (id: string) => {
  console.log(id)
  try {
    await libraryService.returnBook(id)
    message.success('Book returned successfully')
    loadCheckouts()
  } catch (error) {
    message.error('Failed to return book')
  }
}

const formatDate = (dateString: string | Date | undefined) => {
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

const toggleForm = () => {
  showForm.value = !showForm.value
  editingCheckout.value = null
}
const handleSuccess = () => {
  message.success('Checkout recorded successfully!')
  showForm.value = false
  loadCheckouts()
}

onMounted(() => {
  loadCheckouts()
})
</script>

<template>
  <div class="checkout-container">
    <a-page-header title="Book Checkouts" @back="() => router.push('/')" class="page-header" />

    <div class="checkout-actions">
      <a-button type="primary" @click="toggleForm">
        <PlusOutlined />
        {{ showForm ? 'Hide Form' : 'New Checkout' }}
      </a-button>
    </div>
    <a-card v-if="showForm" class="checkout-card">
      <p class="checkout-description">
        Use this form to check out a book to a student. Enter the student's name and the book ID.
      </p>
      <checkout-form @success="handleSuccess" />
    </a-card>
    <a-card class="checkout-card" title="All Checkouts">
      <a-spin :spinning="loading">
        <template v-if="checkouts.length === 0">
          <a-empty description="No checkouts found" />
        </template>
        <template v-else>
          <a-table
            :dataSource="checkouts"
            :pagination="false"
            :rowKey="(record: any) => record.id"
            :rowClassName="(record: any) => (record.returnDate ? 'returned-row' : 'active-row')"
            bordered
            class="checkout-table"
          >
            <a-table-column title="Student Name" dataIndex="studentName" />
            <a-table-column title="Book ID" dataIndex="bookId" />
            <a-table-column
              title="Checkout Date"
              dataIndex="checkoutDate"
              :customRender="({ text }: any) => formatDate(text)"
            />
            <a-table-column
              title="Return Date"
              dataIndex="returnDate"
              :customRender="({ text }: any) => (text ? formatDate(text) : 'Not returned yet')"
            />
            <a-table-column
              title="Status"
              :customRender="
                ({ record }: any) => {
                  return record.returnDate
                    ? h('a-tag', { color: 'green' }, 'Returned')
                    : h('a-tag', { color: 'blue' }, 'Checked Out')
                }
              "
            />

            <a-table-column
              title="Actions"
              :customRender="
                ({ record }: any) => {
                  if (!record.returnDate) {
                    return h(
                      'a-button',
                      {
                        type: 'primary',
                        danger: true,
                        size: 'middle',
                        onClick: () => returnBook(record._id),
                        class: 'action-button',
                        style: { display: 'flex', alignItems: 'center', gap: '8px' },
                      },
                      [
                        h('span', { class: 'anticon' }, h('i', { class: 'fas fa-undo' })),
                        h('span', 'Return Book'),
                      ],
                    )
                  }
                  return null
                }
              "
            />
          </a-table>

          <a-pagination
            v-model:current="currentPage"
            :pageSize="pageSize"
            :total="totalItems"
            @change="handlePageChange"
            show-less-items
            class="pagination"
          />
        </template>
      </a-spin>
    </a-card>
  </div>
</template>

<style scoped>
.checkout-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.checkout-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.checkout-description {
  margin-bottom: 20px;
  color: #666;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>

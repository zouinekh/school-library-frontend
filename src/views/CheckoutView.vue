<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import CheckoutForm from '@/components/CheckoutForm.vue'
import libraryService from '../api/libraryService'
import type { Checkout, PaginatedResponse } from '../types/library'
import type { ColumnType } from 'ant-design-vue/es/table'
import { PlusOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { Tag } from 'ant-design-vue'
const checkouts = ref<Checkout[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const showForm = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)

const router = useRouter()

const loadCheckouts = async () => {
  loading.value = true
  try {
    const response = await libraryService.getCheckouts(
      currentPage.value,
      pageSize.value,
      searchQuery.value,
    )
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
  })
}

const handleSearch = () => {
  isSearching.value = true
  currentPage.value = 1
  loadCheckouts()
  setTimeout(() => {
    isSearching.value = false
  }, 1000)
}

const handleSearchChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  searchQuery.value = value
  if (value.length >= 0) {
    currentPage.value = 1
    loadCheckouts()
  }
}

const columns: ColumnType<Checkout>[] = [
  { title: 'Student Name', dataIndex: 'studentName', key: 'studentName' },
  { title: 'Book ID', dataIndex: 'bookId', key: 'bookId' },
  {
    title: 'Checkout Date',
    dataIndex: 'checkoutDate',
    key: 'checkoutDate',
    customRender: ({ text }) => formatDate(text),
  },
  {
    title: 'Return Date',
    dataIndex: 'returnDate',
    key: 'returnDate',
    customRender: ({ text }) => (text ? formatDate(text) : 'Not returned yet'),
  },
  {
    title: 'Status',
    key: 'status',
    customRender: ({ record }) => {
      return h(
        Tag,
        {
          color: record.returnDate ? 'green' : 'blue',
        },
        record.returnDate ? 'Returned' : 'Active',
      )
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 120,
  },
]

onMounted(() => {
  loadCheckouts()
})
</script>

<template>
  <div class="checkout-container">
    <div class="page-header">
      <h2>Book Checkouts</h2>
    </div>

    <a-card class="checkout-card">
      <a-spin :spinning="loading">
        <div class="header">
          <div class="search-container">
            <a-input-search
              v-model:value="searchQuery"
              placeholder="Search checkouts by student name..."
              enter-button
              :loading="isSearching"
              @search="handleSearch"
              @input="handleSearchChange"
              allow-clear
            />
          </div>
          <a-button type="primary" @click="showForm = true">
            <template #icon><plus-outlined /></template>
            New Checkout
          </a-button>
        </div>

        <a-table
          :data-source="checkouts"
          :columns="columns"
          :row-key="(record: any) => record.id"
          :pagination="false"
          :scroll="{ x: 800 }"
          class="checkout-table"
          :rowClassName="(record: any) => (record.returnDate ? 'returned-row' : 'active-row')"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <div class="action-buttons-container">
                <a-popconfirm
                  v-if="!record.returnDate"
                  title="Are you sure you want to return this book?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="returnBook(record._id)"
                >
                  <a-button class="action-btn return-btn">
                    Return
                    <undo-outlined />
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>

        <a-pagination
          v-model:current="currentPage"
          :pageSize="pageSize"
          :total="totalItems"
          @change="handlePageChange"
          show-less-items
          :showSizeChanger="false"
          class="pagination"
        />
      </a-spin>
    </a-card>

    <a-modal
      v-model:visible="showForm"
      title="New Checkout"
      :footer="null"
      @cancel="showForm = false"
    >
      <CheckoutForm
        @success="
          () => {
            showForm = false
            loadCheckouts()
          }
        "
      />
    </a-modal>
  </div>
</template>

<style scoped>
.checkout-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.search-container {
  flex: 2;
  max-width: 80%;
}

.checkout-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.checkout-table {
  width: 100%;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.action-buttons-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.view-btn {
  background-color: #e6f7ff;
  color: #1890ff;
}

.view-btn:hover {
  background-color: #bae7ff;
}

.return-btn {
  background-color: #f6ffed;
  color: #52c41a;
}

.return-btn:hover {
  background-color: #d9f7be;
}

.returned-row {
  background-color: #f6ffed;
}

.active-row {
  background-color: #fff;
}
</style>

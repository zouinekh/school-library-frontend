<script setup lang="ts">
import { defineProps, defineEmits, h, ref } from 'vue'
import type { PropType } from 'vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { Book } from '../types/library'
import { useRouter } from 'vue-router'
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  books: {
    type: Array as PropType<Book[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'search', query: string): void
}>()

const router = useRouter()
const searchQuery = ref('')
const isSearching = ref(false)

const handleSearchChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('search', value)
}

const handleSearch = () => {
  isSearching.value = true
  emit('search', searchQuery.value)
  setTimeout(() => {
    isSearching.value = false
  }, 1000)
}

const columns: ColumnType<Book>[] = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Author', dataIndex: 'author', key: 'author' },
  {
    title: 'Available Copies',
    dataIndex: 'availableCopies',
    key: 'available',
    customRender: ({ text }) => {
      const color = text > 0 ? 'green' : 'red'
      const columns: ColumnType<Book>[] = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Author', dataIndex: 'author', key: 'author' },
        {
          title: 'Available Copies',
          dataIndex: 'availableCopies',
          key: 'available',

          customRender: ({ record }) => {
            return h('a-badge', { count: record.availableCopies, color })
          },
        },
      ]
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 200,
  },
]
</script>

<template>
  <div class="book-list-container">
    <div class="header">
      <div class="search-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Search by title or author..."
          enter-button
          :loading="isSearching"
          @search="handleSearch"
          @input="handleSearchChange"
          allow-clear
        />
      </div>

      <a-button type="primary" @click="router.push('/add-book')">
        <template #icon><plus-outlined /></template>
        Add New Book
      </a-button>
    </div>

    <a-table
      :data-source="books"
      :columns="columns"
      :row-key="(record: Book) => record.id"
      :pagination="false"
      :scroll="{ x: 800 }"
      class="book-table"
    >
      <template #bodyCell="{ column, record }: { column: ColumnType<Book>; record: Book }">
        <template v-if="column.key === 'actions'">
          <div class="action-buttons-container">
            <a-button class="action-btn view-btn" @click="() => router.push(`/books/${record.id}`)">
              <eye-outlined />
            </a-button>
            <a-button
              class="action-btn edit-btn"
              @click="() => router.push(`/books/${record.id}/edit`)"
            >
              <edit-outlined />
            </a-button>
            <a-button class="action-btn delete-btn" @click="emit('delete', record.id)">
              <delete-outlined />
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.book-list-container {
  width: 100%;
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

.book-table {
  width: 100%;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

.primary-icon {
  color: #1890ff;
}

.success-icon {
  color: #52c41a;
}

.danger-icon {
  color: #ff4d4f;
}
.action-buttons-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  display: flex;
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

.edit-btn {
  background-color: #f6ffed;
  color: #52c41a;
}

.edit-btn:hover {
  background-color: #d9f7be;
}

.delete-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.delete-btn:hover {
  background-color: #ffccc7;
}
</style>

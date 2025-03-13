<script setup lang="ts">
import { defineProps, defineEmits, h } from 'vue'
import type { PropType } from 'vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { Book } from '../types/library'
import { useRouter } from 'vue-router'

defineProps({
  books: {
    type: Array as PropType<Book[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const router = useRouter()

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
            const color = record.availableCopies > 0 ? 'green' : 'red'
            return h('a-badge', { count: record.availableCopies, color })
          },
        },
      ]
    },
  },
  { title: 'Actions', key: 'actions' },
]
</script>

<template>
  <a-table
    :data-source="books"
    :columns="columns"
    :row-key="(record: Book) => record.id"
    :pagination="false"
    class="book-table"
  >
    <template #bodyCell="{ column, record }: { column: ColumnType<Book>; record: Book }">
      <template v-if="column.key === 'actions'">
        <a-space>
          <a-button type="primary" @click="() => router.push(`/book/${record.id}`)">
            <template #icon><eye-outlined /></template>
            Details
          </a-button>
          <a-button danger @click="emit('delete', record.id)">
            <template #icon><delete-outlined /></template>
            Delete
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.book-table {
  width: 100%;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #e6f7ff;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import libraryService from '../api/libraryService'
import {
  BookOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'

const stats = ref({
  totalBooks: 0,
  availableBooks: 0,
  totalCheckouts: 0,
  activeCheckouts: 0,
})

const loading = ref(false)

const loadDashboardStats = async () => {
  loading.value = true
  try {
    const response = await libraryService.getDashboardStats()
    stats.value = response.data
    console.log(stats.value)
  } catch (error) {
    console.error('Failed to load dashboard statistics', error)
    message.error('Failed to load dashboard statistics')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardStats()
})
</script>

<template>
  <a-spin :spinning="loading">
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card books-card">
          <div class="stat-content">
            <div class="stat-icon">
              <book-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalBooks }}</div>
              <div class="stat-label">Total Books</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card available-card">
          <div class="stat-content">
            <div class="stat-icon">
              <check-circle-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.availableBooks }}</div>
              <div class="stat-label">Available Books</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card checkouts-card">
          <div class="stat-content">
            <div class="stat-icon">
              <solution-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCheckouts }}</div>
              <div class="stat-label">Total Checkouts</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card active-card">
          <div class="stat-content">
            <div class="stat-icon">
              <close-circle-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activeCheckouts }}</div>
              <div class="stat-label">Active Checkouts</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
</template>

<style scoped>
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.books-card .stat-icon {
  background-color: #e6f7ff;
  color: #1890ff;
}

.available-card .stat-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.checkouts-card .stat-icon {
  background-color: #fff7e6;
  color: #fa8c16;
}

.active-card .stat-icon {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
}
</style>

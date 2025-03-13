<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOutlined,
  SwapOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const router = useRouter()

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="app-container">
    <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
        <div class="logo">
          <h2 v-if="!collapsed">Library</h2>
          <h2 v-else>📚</h2>
        </div>
        <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
          <a-menu-item key="1" @click="navigateTo('/')">
            <dashboard-outlined />
            <span>Dashboard</span>
          </a-menu-item>
          <a-menu-item key="2" @click="navigateTo('/books')">
            <book-outlined />
            <span>Books</span>
          </a-menu-item>
          <a-menu-item key="3" @click="navigateTo('/checkout')">
            <swap-outlined />
            <span>Checkout</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="header">
          <div class="header-content">
            <button class="trigger" @click="toggleCollapsed">
              <menu-fold-outlined v-if="collapsed" />
              <menu-unfold-outlined v-else />
            </button>
            <h1>School Library Management</h1>
          </div>
        </a-layout-header>
        <a-layout-content class="content">
          <slot></slot>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          School Library Management System ©{{ new Date().getFullYear() }}
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<style scoped>
.app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #001529;
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.header {
  background: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.header h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #001529;
}

.trigger {
  padding: 0 24px;
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
  background: none;
  border: none;
}

.trigger:hover {
  color: #1890ff;
}

.content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
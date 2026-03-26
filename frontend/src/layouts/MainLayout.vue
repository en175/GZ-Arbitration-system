<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gacLogo from '@/assets/gac-logo.png'

const route = useRoute()
const router = useRouter()

const menuList = [
  { label: '办案秘书工作台', path: '/workbench' },
  { label: '案件办理台', path: '/case-workbench' },
  { label: '立案中心', path: '/batch-filing' },
]

const activeTab = computed(() => {
  const path = route.path
  const matched = menuList.find(item => path.startsWith(item.path))
  return matched ? matched.path : '/workbench'
})

const navigate = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="embedded-shell">

    <!-- 顶部 Tab 导航栏 -->
    <header class="top-nav-bar">
      <div class="nav-left">
        <!-- 广仲品牌标识 -->
        <div class="system-brand">
          <img :src="gacLogo" alt="广州仲裁委员会" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">广州仲裁委员会</span>
            <span class="brand-tagline">仲裁系统</span>
          </div>
        </div>
        <div class="nav-divider"></div>
        <!-- Tab 导航 -->
        <nav class="tab-list">
          <button
            v-for="item in menuList"
            :key="item.path"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === item.path }"
            @click="navigate(item.path)"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
    </header>

    <!-- 页面内容区 -->
    <main class="page-body">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
.embedded-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  gap: 14px;
  background: var(--bg-page);
}

/* ===================== 顶部导航栏 ===================== */
.top-nav-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(59, 102, 245, 0.06);
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
}

/* 品牌区域 */
.system-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-right: 18px;
  flex-shrink: 0;
}

.brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
  mix-blend-mode: multiply;
}

.brand-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.brand-name {
  font-size: 14px;
  font-weight: 800;
  color: #1a4fa0;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.brand-tagline {
  font-size: 11px;
  color: var(--text-sub);
  line-height: 1.2;
}

.nav-divider {
  width: 1px;
  height: 22px;
  background: rgba(229, 230, 235, 0.8);
  margin: 0 16px 0 0;
  flex-shrink: 0;
}

/* Tab 列表 */
.tab-list {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tab-btn {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background: rgba(59, 102, 245, 0.06);
  color: var(--primary-color);
}

.tab-btn--active {
  background: linear-gradient(135deg, #3b66f5 0%, #6187fa 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(59, 102, 245, 0.28);
}

/* ===================== 内容区 ===================== */
.page-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-body::-webkit-scrollbar {
  display: none;
}
</style>

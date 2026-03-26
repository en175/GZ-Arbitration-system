<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gacLogo from '@/assets/gac-logo.png'

const route = useRoute()
const router = useRouter()

// ===== 角色 =====
const roles = [
  { key: 'secretary', label: '办案秘书' },
  { key: 'filing',    label: '立案秘书' },
  { key: 'arbitrator',label: '仲裁员' },
  { key: 'manager',   label: '管理人员' },
]
const activeRole = ref('secretary')
const showRoleMenu = ref(false)
const roleTriggerRef = ref(null)
const roleMenuPos = ref({ top: '0px', right: '0px' })
const currentRole = computed(() => roles.find(r => r.key === activeRole.value))

// ===== 导航菜单（按角色动态切换）=====
const roleMenuMap = {
  secretary:  [
    { label: '工作台',    path: '/workbench' },
    { label: '案件作业台', path: '/case-workbench' },
    { label: '立案中心',  path: '/batch-filing' },
  ],
  filing: [
    { label: '工作台',    path: '/batch-filing' },
    { label: '案件作业台', path: '/case-workbench' },
  ],
  arbitrator: [
    { label: '工作台',   path: '/arbitrator-workbench' },
    { label: '案件作业台', path: '/case-workbench' },
  ],
  manager: [
    { label: '工作台',   path: '/admin-dashboard' },
    { label: '案件作业台', path: '/case-workbench' },
  ],
}
const roleHomeMap = {
  secretary:  '/workbench',
  filing:     '/batch-filing',
  arbitrator: '/arbitrator-workbench',
  manager:    '/admin-dashboard',
}
const menuList = computed(() => roleMenuMap[activeRole.value] || roleMenuMap.secretary)
const activeTab = computed(() => {
  const path = route.path
  const matched = menuList.value.find(item => path.startsWith(item.path))
  return matched ? matched.path : menuList.value[0]?.path
})
const navigate = (path) => router.push(path)

const toggleRoleMenu = () => {
  if (!showRoleMenu.value && roleTriggerRef.value) {
    const rect = roleTriggerRef.value.getBoundingClientRect()
    roleMenuPos.value = {
      top: rect.bottom + 6 + 'px',
      right: window.innerWidth - rect.right + 'px',
    }
  }
  showRoleMenu.value = !showRoleMenu.value
  showEndpointMenu.value = false
}
const switchRole = (key) => {
  activeRole.value = key
  showRoleMenu.value = false
  router.push(roleHomeMap[key] || '/workbench')
}

// ===== 端口 =====
// web: 全宽网页  |  app: 移动App（占位，后续开发）  |  ipad: 华为平板帧
const endpoints = [
  { key: 'web',  label: 'Web 端' },
  { key: 'app',  label: 'App 端' },
  { key: 'ipad', label: 'iPad 端' },
]
const activeEndpoint = ref('web')
const showEndpointMenu = ref(false)
const endpointTriggerRef = ref(null)
const endpointMenuPos = ref({ top: '0px', right: '0px' })
const currentEndpoint = computed(() => endpoints.find(e => e.key === activeEndpoint.value))

const toggleEndpointMenu = () => {
  if (!showEndpointMenu.value && endpointTriggerRef.value) {
    const rect = endpointTriggerRef.value.getBoundingClientRect()
    endpointMenuPos.value = {
      top: rect.bottom + 6 + 'px',
      right: window.innerWidth - rect.right + 'px',
    }
  }
  showEndpointMenu.value = !showEndpointMenu.value
  showRoleMenu.value = false
}
const switchEndpoint = (key) => {
  activeEndpoint.value = key
  showEndpointMenu.value = false
}

// 点击外部关闭下拉
// 注意：mousedown 比 click 先触发，需排除 Teleport 下拉内部的点击，
// 让按钮自身的 click 处理器（switchEndpoint / switchRole）先执行。
const handleOutside = (e) => {
  if (e.target.closest('.t-dropdown')) return   // 点在下拉内，不干预

  if (roleTriggerRef.value && !roleTriggerRef.value.contains(e.target)) {
    showRoleMenu.value = false
  }
  if (endpointTriggerRef.value && !endpointTriggerRef.value.contains(e.target)) {
    showEndpointMenu.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleOutside))
</script>

<template>
  <!-- iPad 模式：灰色桌面底 + 平板帧；web/app 模式：全宽铺满 -->
  <div :class="['app-root', activeEndpoint === 'ipad' && 'app-root--ipad']">
    <div :class="['embedded-shell', activeEndpoint === 'ipad' && 'embedded-shell--ipad']">

      <!-- 顶部导航栏 -->
      <header class="top-nav-bar">
        <div class="nav-left">
          <div class="system-brand">
            <img :src="gacLogo" alt="广州仲裁委员会" class="brand-logo" />
            <div class="brand-text">
              <span class="brand-name">广州仲裁委员会</span>
              <span class="brand-tagline">仲裁系统</span>
            </div>
          </div>
          <div class="nav-divider"></div>
          <nav class="tab-list">
            <button
              v-for="item in menuList"
              :key="item.path"
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === item.path }"
              @click="navigate(item.path)"
            >{{ item.label }}</button>
          </nav>
        </div>

        <div class="nav-right">
          <!-- 端口切换 trigger -->
          <div
            ref="endpointTriggerRef"
            class="endpoint-tag"
            :class="'endpoint-tag--' + activeEndpoint"
            @click="toggleEndpointMenu"
          >
            <!-- Web端 图标：显示器 -->
            <svg v-if="activeEndpoint === 'web'" class="ep-icon" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M5 14h6M8 12v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            <!-- App端 图标：手机 -->
            <svg v-else-if="activeEndpoint === 'app'" class="ep-icon" viewBox="0 0 16 16" fill="none">
              <rect x="4.5" y="1" width="7" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
            </svg>
            <!-- iPad端 图标：平板 -->
            <svg v-else class="ep-icon" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
              <line x1="4.5" y1="3" x2="11.5" y2="3" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
            </svg>
            <span>{{ currentEndpoint.label }}</span>
            <svg class="chevron-icon" :class="{ rotated: showEndpointMenu }" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="right-divider"></div>

          <!-- 角色切换 trigger -->
          <div
            ref="roleTriggerRef"
            class="role-tag"
            @click="toggleRoleMenu"
          >
            <div class="role-avatar">{{ currentRole.label[0] }}</div>
            <span class="role-label">{{ currentRole.label }}</span>
            <svg class="chevron-icon" :class="{ rotated: showRoleMenu }" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </header>

      <!-- 页面内容区 -->
      <main class="page-body">
        <router-view />
      </main>

    </div>
  </div>

  <!-- ===== Teleport 下拉（渲染到 body，避免被 backdrop-filter 层叠裁切）===== -->
  <Teleport to="body">

    <!-- 端口下拉 -->
    <div
      v-if="showEndpointMenu"
      class="t-dropdown"
      :style="{ top: endpointMenuPos.top, right: endpointMenuPos.right }"
    >
      <div class="t-dropdown-header">切换端口</div>
      <button
        v-for="ep in endpoints"
        :key="ep.key"
        class="t-dropdown-item"
        :class="{ 'active': activeEndpoint === ep.key }"
        @click="switchEndpoint(ep.key)"
      >
        <svg v-if="ep.key === 'web'" class="t-item-icon" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M5 14h6M8 12v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else-if="ep.key === 'app'" class="t-item-icon" viewBox="0 0 16 16" fill="none">
          <rect x="4.5" y="1" width="7" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
        </svg>
        <svg v-else class="t-item-icon" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
        </svg>
        {{ ep.label }}
      </button>
    </div>

    <!-- 角色下拉 -->
    <div
      v-if="showRoleMenu"
      class="t-dropdown"
      :style="{ top: roleMenuPos.top, right: roleMenuPos.right }"
    >
      <div class="t-dropdown-header">切换角色</div>
      <button
        v-for="role in roles"
        :key="role.key"
        class="t-dropdown-item"
        :class="{ 'active': activeRole === role.key }"
        @click="switchRole(role.key)"
      >
        <div class="t-item-avatar">{{ role.label[0] }}</div>
        {{ role.label }}
      </button>
    </div>

  </Teleport>
</template>

<style scoped>
/* ===== 布局根节点 ===== */
.app-root {
  min-height: 100vh;
  background: var(--bg-page);
}

/* iPad 模式：模拟平板桌面背景 + 居中帧 */
.app-root--ipad {
  background: #b6bac4;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
}

/* 默认 Shell */
.embedded-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 14px 16px;
  gap: 14px;
  background: var(--bg-page);
}

/*
  iPad 帧 —— 参考华为 MatePad Pro 11（2023）
  屏幕分辨率 2560×1600，@2x → CSS viewport 1280×800
*/
.embedded-shell--ipad {
  width: 1280px;
  height: 800px;
  min-height: unset;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 18px;
  /* 外层深色边框模拟机身，内层细线模拟玻璃边缘 */
  box-shadow:
    0 0 0 10px #1c1d2e,
    0 0 0 11px #3a3b52,
    0 0 0 12px #1c1d2e,
    0 32px 80px rgba(0, 0, 0, 0.55);
}

/* iPad 模式下内容区高度自适应帧 */
.embedded-shell--ipad .page-body {
  flex: 1;
  min-height: 0;
}

/* ===== 顶部导航栏 ===== */
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(59, 102, 245, 0.06);
  flex-shrink: 0;
  /* 不要 overflow:hidden，让子定位元素能溢出（即便用了 Teleport 也保留） */
}

.nav-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

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

/* ===== 右侧区域 ===== */
.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.right-divider {
  width: 1px;
  height: 18px;
  background: rgba(229, 230, 235, 0.8);
  margin: 0 2px;
}

/* 端口 tag */
.endpoint-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  background: rgba(248, 249, 252, 0.8);
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.18s;
  white-space: nowrap;
  color: var(--text-regular);
}

.endpoint-tag--web {
  color: #3b66f5;
  background: rgba(59, 102, 245, 0.06);
  border-color: rgba(59, 102, 245, 0.18);
}

.endpoint-tag--app {
  color: #059669;
  background: rgba(5, 150, 105, 0.06);
  border-color: rgba(5, 150, 105, 0.2);
}

.endpoint-tag--ipad {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
  border-color: rgba(124, 58, 237, 0.18);
}

.ep-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* 角色 tag */
.role-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  background: rgba(248, 249, 252, 0.8);
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.18s;
  white-space: nowrap;
}

.role-tag:hover {
  border-color: rgba(59, 102, 245, 0.25);
  background: rgba(59, 102, 245, 0.04);
}

.role-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-regular);
}

.chevron-icon {
  width: 9px;
  height: 9px;
  color: var(--text-sub);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* ===== 内容区 ===== */
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

<!-- Teleport 下拉样式（非 scoped，渲染在 body 下） -->
<style>
.t-dropdown {
  position: fixed;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(220, 222, 230, 0.9);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0,0,0,0.06);
  padding: 4px;
  z-index: 9999;
  min-width: 130px;
}

.t-dropdown-header {
  font-size: 11px;
  color: #9ca3af;
  padding: 6px 10px 4px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.t-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  white-space: nowrap;
}

.t-dropdown-item:hover {
  background: rgba(59, 102, 245, 0.06);
  color: #3b66f5;
}

.t-dropdown-item.active {
  background: rgba(59, 102, 245, 0.08);
  color: #3b66f5;
  font-weight: 600;
}

.t-item-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.t-item-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>

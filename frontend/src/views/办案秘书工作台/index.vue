<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { alertCards, todayTodos, aiAssistContent } from './mock'
import { stageColumns, kanbanCases } from '../流程节点追踪/mock'

const router = useRouter()
const mainTab = ref('todo')
const todoFilter = ref('all')
const caseFilter = ref('all')

// 今日待办筛选：按办案秘书实际工作类型划分
const filterOptions = [
  { key: 'all',   label: '全部' },
  { key: 'today', label: '今日截止' },
  { key: 'doc',   label: '文书送达' },
  { key: 'node',  label: '节点归档' },
]

const filteredTodos = computed(() => {
  if (todoFilter.value === 'all')   return todayTodos
  if (todoFilter.value === 'today') return todayTodos.filter(t => t.dueType === 'danger')
  if (todoFilter.value === 'doc')   return todayTodos.filter(t => t.todoType === 'doc')
  if (todoFilter.value === 'node')  return todayTodos.filter(t => t.todoType === 'node')
  return todayTodos
})

const filterCount = (key) => {
  if (key === 'all')   return todayTodos.length
  if (key === 'today') return todayTodos.filter(t => t.dueType === 'danger').length
  if (key === 'doc')   return todayTodos.filter(t => t.todoType === 'doc').length
  if (key === 'node')  return todayTodos.filter(t => t.todoType === 'node').length
  return 0
}

// 在办案件看板筛选（由顶部告警卡片点击触发）
const filteredKanbanCases = computed(() => {
  if (caseFilter.value === 'all') return kanbanCases
  return Object.fromEntries(
    Object.entries(kanbanCases).map(([key, cases]) => [
      key,
      cases.filter(c => {
        if (caseFilter.value === 'urgent')   return ['urgent', 'high'].includes(c.priority)
        if (caseFilter.value === 'overtime') return c.priority === 'urgent'
        if (caseFilter.value === 'issues')   return c.issues > 0
        return true
      }),
    ])
  )
})

const filterLabelMap = {
  urgent:   '临期 / 高优先',
  overtime: '超期案件',
  issues:   '存在问题项',
  all:      null,
}

const handleAlertCard = (card) => {
  mainTab.value = 'cases'
  caseFilter.value = card.filterKey
}

const enterCase = (caseId) => {
  router.push({ path: '/case-workbench', query: { id: caseId } })
}
</script>

<template>
  <div class="workbench-page">

    <!-- 顶部告警卡片行 -->
    <div class="alert-cards-row">
      <div
        v-for="card in alertCards"
        :key="card.key"
        class="alert-card"
        :class="`alert-card--${card.type}`"
        @click="handleAlertCard(card)"
      >
        <div class="alert-card-inner">
          <div class="alert-value">
            {{ card.value }}<span class="alert-unit">{{ card.unit }}</span>
          </div>
          <div class="alert-label">{{ card.label }}</div>
          <div class="alert-desc">{{ card.desc }}</div>
        </div>
        <div class="alert-card-glow"></div>
      </div>
    </div>

    <!-- 主内容区：左侧内容 + 右侧AI面板 -->
    <div class="main-grid">

      <!-- 左侧：待办 + 案件（Tab切换） -->
      <div class="content-col">
        <div class="content-block">

          <!-- Tab 切换头 -->
          <div class="block-header">
            <div class="main-tabs">
              <button
                class="main-tab"
                :class="{ 'main-tab--active': mainTab === 'todo' }"
                @click="mainTab = 'todo'"
              >
                今日待办
                <span class="main-tab-count" :class="mainTab === 'todo' ? 'count--active' : ''">
                  {{ todayTodos.length }}
                </span>
              </button>
              <button
                class="main-tab"
                :class="{ 'main-tab--active': mainTab === 'cases' }"
                @click="mainTab = 'cases'"
              >
                在办案件
                <span class="main-tab-count" :class="mainTab === 'cases' ? 'count--active' : ''">
                  {{ Object.values(kanbanCases).reduce((s, a) => s + a.length, 0) }}
                </span>
              </button>
            </div>

            <!-- 待办筛选（仅在待办Tab显示） -->
            <div class="filter-tabs" v-if="mainTab === 'todo'">
              <button
                v-for="opt in filterOptions"
                :key="opt.key"
                class="filter-tab"
                :class="{ 'filter-tab--active': todoFilter === opt.key }"
                @click="todoFilter = opt.key"
              >
                {{ opt.label }}
                <span class="tab-count">{{ filterCount(opt.key) }}</span>
              </button>
            </div>

            <!-- 在办案件筛选状态提示 -->
            <div class="case-filter-tip" v-if="mainTab === 'cases' && filterLabelMap[caseFilter]">
              <span class="filter-tip-text">筛选：{{ filterLabelMap[caseFilter] }}</span>
              <button class="filter-clear-btn" @click="caseFilter = 'all'">清除</button>
            </div>
          </div>

          <!-- 今日待办列表 -->
          <div v-if="mainTab === 'todo'" class="todo-list">
            <div
              v-for="item in filteredTodos"
              :key="item.id"
              class="todo-card"
              :class="`todo-card--${item.priority}`"
            >
              <div class="priority-bar" :class="`pbar--${item.priority}`"></div>
              <div class="todo-body">
                <div class="todo-top-row">
                  <span class="todo-case-no" @click="enterCase(item.caseId)">{{ item.caseNo }}</span>
                  <span class="todo-stage-tag">{{ item.stage }}</span>
                </div>
                <div class="todo-action">{{ item.action }}</div>
                <div class="todo-desc">{{ item.desc }}</div>
              </div>
              <div class="todo-right">
                <div class="todo-due" :class="`due--${item.dueType}`">
                  <span class="due-icon"></span>
                  {{ item.due }}
                </div>
                <button class="enter-case-btn" @click="enterCase(item.caseId)">
                  进入案件
                </button>
              </div>
            </div>
          </div>

          <!-- 我的在办案件：看板视图 -->
          <div v-else class="inline-kanban">
            <div
              v-for="stage in stageColumns"
              :key="stage.key"
              class="ik-col"
              :style="{ '--ik-color': stage.color, '--ik-bg': stage.bgColor }"
            >
              <div class="ik-col-header">
                <span class="ik-dot" :style="{ background: stage.color }"></span>
                <span class="ik-label">{{ stage.label }}</span>
                <span class="ik-count">{{ (filteredKanbanCases[stage.key] || []).length }}</span>
              </div>
              <div class="ik-cards">
                <div
                  v-for="c in (filteredKanbanCases[stage.key] || [])"
                  :key="c.id"
                  class="ik-card"
                  :class="{ 'ik-card--urgent': c.priority === 'urgent', 'ik-card--high': c.priority === 'high' }"
                  @click="enterCase(c.id)"
                >
                  <div class="ik-card-bar" :class="`ikbar--${c.priority}`"></div>
                  <div class="ik-card-body">
                    <div class="ik-case-no">{{ c.caseNo }}</div>
                    <div class="ik-parties">{{ c.parties }}</div>
                    <div class="ik-node-row">
                      <span class="ik-node">{{ c.node }}</span>
                      <span v-if="c.issues > 0" class="ik-issues">{{ c.issues }}项问题</span>
                    </div>
                    <div class="ik-due" :class="c.priority === 'urgent' ? 'due--red' : c.priority === 'high' ? 'due--orange' : ''">
                      {{ c.due }}
                    </div>
                  </div>
                </div>
                <div v-if="!(filteredKanbanCases[stage.key] || []).length" class="ik-empty">暂无</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 右侧：AI 工作助手面板 -->
      <aside class="ai-side-panel">
        <!-- Panel 头部 -->
        <div class="ai-panel-header">
          <div class="ai-panel-title">AI 工作助手</div>
          <span class="live-chip">实时</span>
        </div>

        <!-- 优先级提示 -->
        <div class="ai-section">
          <div class="ai-section-label">
            <span class="section-icon section-icon--warn"></span>
            优先级提示
          </div>
          <div class="ai-tips">
            <div
              v-for="(tip, i) in aiAssistContent.priorityTips"
              :key="i"
              class="ai-tip-row"
            >
              <span class="tip-bullet tip-bullet--red"></span>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>

        <div class="ai-divider"></div>

        <!-- 处理建议 -->
        <div class="ai-section">
          <div class="ai-section-label">
            <span class="section-icon section-icon--blue"></span>
            处理建议
          </div>
          <div class="ai-tips">
            <div
              v-for="(s, i) in aiAssistContent.suggestions"
              :key="i"
              class="ai-tip-row"
            >
              <span class="tip-bullet tip-bullet--blue"></span>
              <span>{{ s }}</span>
            </div>
          </div>
        </div>

        <div class="ai-divider"></div>

        <!-- 规则依据 -->
        <div class="ai-section">
          <div class="ai-section-label">
            <span class="section-icon section-icon--gray"></span>
            规则依据
          </div>
          <div class="rule-hints">
            <div
              v-for="(hint, i) in aiAssistContent.ruleHints"
              :key="i"
              class="rule-hint-row"
            >
              {{ hint }}
            </div>
          </div>
        </div>

        <div class="ai-divider"></div>

        <!-- 快捷入口 -->
        <div class="ai-section">
          <div class="ai-section-label">
            <span class="section-icon section-icon--green"></span>
            快捷入口
          </div>
          <div class="quick-entries">
            <button
              class="quick-entry-btn"
              @click="enterCase('GZ-2026-5412')"
            >
              进入5412号案作业台
            </button>
            <button
              class="quick-entry-btn quick-entry-btn--ghost"
              @click="$router.push('/batch-filing')"
            >
              前往立案中心
            </button>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* ===================== 页面基础 ===================== */
.workbench-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

/* ===================== 告警卡片行 ===================== */
.alert-cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.alert-card {
  border-radius: 16px;
  padding: 20px 22px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.alert-card:hover {
  transform: translateY(-3px);
}

.alert-card-inner {
  position: relative;
  z-index: 1;
}

.alert-card-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
}

.alert-card:hover .alert-card-glow {
  opacity: 1;
}

/* 临期 - 红 */
.alert-card--danger {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  box-shadow: 0 8px 24px rgba(245, 63, 63, 0.25);
  color: #fff;
}
.alert-card--danger .alert-unit,
.alert-card--danger .alert-desc {
  color: rgba(255,255,255,0.75);
}

/* 超期 - 深橙 */
.alert-card--overtime {
  background: linear-gradient(135deg, #fa541c 0%, #ff7a45 100%);
  box-shadow: 0 8px 24px rgba(250, 84, 28, 0.25);
  color: #fff;
}
.alert-card--overtime .alert-unit,
.alert-card--overtime .alert-desc {
  color: rgba(255,255,255,0.75);
}

/* 待确认 - 蓝紫 */
.alert-card--warning {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  box-shadow: 0 8px 24px rgba(114, 46, 209, 0.22);
  color: #fff;
}
.alert-card--warning .alert-unit,
.alert-card--warning .alert-desc {
  color: rgba(255,255,255,0.75);
}

/* 今日总计 - 主蓝 */
.alert-card--primary {
  background: linear-gradient(135deg, #3b66f5 0%, #6187fa 100%);
  box-shadow: 0 8px 24px rgba(59, 102, 245, 0.25);
  color: #fff;
}
.alert-card--primary .alert-unit,
.alert-card--primary .alert-desc {
  color: rgba(255,255,255,0.75);
}

.alert-value {
  font-size: 38px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}

.alert-unit {
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
  letter-spacing: 0;
}

.alert-label {
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  opacity: 0.95;
}

.alert-desc {
  font-size: 12px;
  margin-top: 4px;
}

/* ===================== 主内容网格 ===================== */
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 268px;
  gap: 18px;
  align-items: start;
}

.content-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ===================== 通用区块 ===================== */
.content-block {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(59, 102, 245, 0.05);
  padding: 22px 24px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
}

/* 主 Tab 切换 */
.main-tabs {
  display: flex;
  gap: 4px;
  background: rgba(245, 247, 250, 0.8);
  border-radius: 10px;
  padding: 3px;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 18px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s ease;
}

.main-tab--active {
  background: #fff;
  color: var(--primary-color);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(59, 102, 245, 0.1);
}

.main-tab-count {
  font-size: 12px;
  background: rgba(59, 102, 245, 0.08);
  color: var(--primary-color);
  border-radius: 20px;
  padding: 1px 8px;
  font-weight: 600;
}

.count--active {
  background: rgba(59, 102, 245, 0.12);
}

.block-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.title-bar {
  display: block;
  width: 3px;
  height: 16px;
  background: linear-gradient(180deg, #3b66f5, #6187fa);
  border-radius: 2px;
}

.title-count {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.07);
  padding: 2px 10px;
  border-radius: 20px;
}

/* ===================== 筛选 Tab ===================== */
.filter-tabs {
  display: flex;
  gap: 6px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: 20px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  background: transparent;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: rgba(59, 102, 245, 0.3);
  color: var(--primary-color);
}

.filter-tab--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}

.tab-count {
  font-size: 11px;
  opacity: 0.75;
}

/* ===================== 待办卡片 ===================== */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-card {
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.todo-card:hover {
  box-shadow: 0 4px 16px rgba(59, 102, 245, 0.08);
  transform: translateX(2px);
}

/* 左侧优先级色条 */
.priority-bar {
  width: 4px;
  flex-shrink: 0;
}

.pbar--urgent { background: #f53f3f; }
.pbar--high { background: #ff7d00; }
.pbar--normal { background: #3b66f5; }
.pbar--low { background: #c9cdd4; }

/* 主体 */
.todo-body {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}

.todo-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.todo-case-no {
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-case-no:hover {
  text-decoration: underline;
}

.todo-stage-tag {
  font-size: 11px;
  background: rgba(59, 102, 245, 0.07);
  color: var(--primary-color);
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
  flex-shrink: 0;
}

.todo-action {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 5px;
}

.todo-desc {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.5;
}

/* 右侧时限+按钮 */
.todo-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  padding: 14px 16px;
  flex-shrink: 0;
}

.todo-due {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.due--danger { color: #f53f3f; }
.due--warning { color: #ff7d00; }
.due--info { color: var(--text-sub); }

.due-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.enter-case-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(59, 102, 245, 0.25);
  background: rgba(59, 102, 245, 0.05);
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.enter-case-btn:hover {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

/* ===================== 内嵌看板 ===================== */
.inline-kanban {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
}

.ik-col {
  background: var(--ik-bg);
  border: 1px solid rgba(229, 230, 235, 0.4);
  border-top: 3px solid var(--ik-color);
  border-radius: 10px;
  overflow: hidden;
}

.ik-col-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid rgba(229, 230, 235, 0.35);
}

.ik-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ik-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ik-count {
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 230, 235, 0.6);
  border-radius: 20px;
  padding: 1px 7px;
  color: var(--text-regular);
  flex-shrink: 0;
}

.ik-cards {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ik-card {
  background: #fff;
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  overflow: hidden;
  transition: all 0.18s ease;
}

.ik-card:hover {
  box-shadow: 0 3px 10px rgba(59, 102, 245, 0.1);
  transform: translateY(-1px);
}

.ik-card-bar {
  width: 3px;
  flex-shrink: 0;
}
.ikbar--urgent { background: #f53f3f; }
.ikbar--high   { background: #ff7d00; }
.ikbar--normal { background: #3b66f5; }
.ikbar--low    { background: #c9cdd4; }

.ik-card-body {
  flex: 1;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ik-case-no {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
}

.ik-parties {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.ik-node-row {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.ik-node {
  font-size: 11px;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.06);
  padding: 1px 6px;
  border-radius: 3px;
}

.ik-issues {
  font-size: 11px;
  color: #ff7d00;
  background: rgba(255, 125, 0, 0.08);
  padding: 1px 5px;
  border-radius: 3px;
}

.ik-due {
  font-size: 11px;
  color: var(--text-sub);
  font-weight: 500;
}

.due--red    { color: #f53f3f; }
.due--orange { color: #ff7d00; }

.ik-empty {
  text-align: center;
  font-size: 12px;
  color: var(--text-sub);
  padding: 14px 0;
}

/* 在办案件筛选提示条 */
.case-filter-tip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-tip-text {
  font-size: 12px;
  color: var(--primary-color);
  background: rgba(59, 102, 245, 0.07);
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.filter-clear-btn {
  font-size: 12px;
  color: var(--text-sub);
  background: transparent;
  border: 1px solid rgba(229, 230, 235, 0.8);
  border-radius: 20px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.18s;
}

.filter-clear-btn:hover {
  color: var(--primary-color);
  border-color: rgba(59, 102, 245, 0.3);
}

/* ===================== AI 侧面板 ===================== */
.ai-side-panel {
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 255, 0.92) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(59, 102, 245, 0.07);
  overflow: hidden;
  position: sticky;
  top: 0;
}

.ai-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  background: linear-gradient(135deg, #3b66f5 0%, #6187fa 100%);
}

.ai-panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.live-chip {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 20px;
  padding: 2px 9px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ai-section {
  padding: 16px 20px;
}

.ai-section-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}

.section-icon {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.section-icon--warn { background: #ff4d4f; }
.section-icon--blue { background: #3b66f5; }
.section-icon--gray { background: #86909c; }
.section-icon--green { background: #00b479; }

.ai-tips {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.ai-tip-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.5;
}

.tip-bullet {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.tip-bullet--red { background: #f53f3f; }
.tip-bullet--blue { background: #3b66f5; }

.ai-divider {
  height: 1px;
  background: rgba(229, 230, 235, 0.5);
  margin: 0 20px;
}

.rule-hints {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.rule-hint-row {
  font-size: 12px;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.04);
  border: 1px solid rgba(59, 102, 245, 0.1);
  border-radius: 6px;
  padding: 6px 10px;
  line-height: 1.5;
}

.quick-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-entry-btn {
  width: 100%;
  padding: 9px 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #3b66f5 0%, #6187fa 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.quick-entry-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.quick-entry-btn--ghost {
  background: transparent;
  border: 1px solid rgba(59, 102, 245, 0.25);
  color: var(--primary-color);
}

.quick-entry-btn--ghost:hover {
  background: rgba(59, 102, 245, 0.05);
}

/* ===================== 响应式 ===================== */
@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .ai-side-panel {
    position: static;
  }

  .alert-cards-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
